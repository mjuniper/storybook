import global from 'global';
import dedent from 'ts-dedent';
const {
  window: globalWindow,
  document
} = global;
const rootEl = document.getElementById('root');
const requireFuncName = globalWindow.STORYBOOK_REQUIRE_ALIAS || 'require';
const requireFunc = globalWindow[requireFuncName];
const config = requireFunc(`${globalWindow.STORYBOOK_NAME}/config/environment`);
const app = requireFunc(`${globalWindow.STORYBOOK_NAME}/app`).default.create(Object.assign({
  autoboot: false,
  rootElement: rootEl
}, config.APP));
let lastPromise = app.boot();
let hasRendered = false;
let isRendering = false;

function render(options, el) {
  if (isRendering) return;
  isRendering = true;
  const {
    template,
    context = {},
    element
  } = options;

  if (hasRendered) {
    lastPromise = lastPromise.then(instance => instance.destroy());
  }

  lastPromise = lastPromise.then(() => {
    const appInstancePrivate = app.buildInstance();
    return appInstancePrivate.boot().then(() => appInstancePrivate);
  }).then(instance => {
    instance.register('component:story-mode', Ember.Component.extend(Object.assign({
      layout: template || options
    }, context)));
    const component = instance.lookup('component:story-mode');

    if (element) {
      component.appendTo(element);
      element.appendTo(el);
    } else {
      component.appendTo(el);
    }

    hasRendered = true;
    isRendering = false;
    return instance;
  });
}

export default function renderMain({
  storyFn,
  kind,
  name,
  showMain,
  showError
}) {
  const element = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Ember element from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the Ember element from the story?
        Use "() => hbs('{{component}}')" or "() => { return {
          template: hbs\`{{component}}\`
        } }" when defining the story.
      `
    });
    return;
  }

  showMain();
  render(element, rootEl);
}