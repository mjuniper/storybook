var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import "core-js/modules/es.object.assign.js";
import "core-js/modules/es.function.name.js";
import "core-js/modules/es.array.concat.js";
import "core-js/modules/es.array.slice.js";
import "core-js/modules/es.object.freeze.js";
import global from 'global';
import dedent from 'ts-dedent';
var globalWindow = global.window,
    document = global.document;
var rootEl = document.getElementById('root');
var requireFuncName = globalWindow.STORYBOOK_REQUIRE_ALIAS || 'require';
var requireFunc = globalWindow[requireFuncName];
var config = requireFunc("".concat(globalWindow.STORYBOOK_NAME, "/config/environment"));
var app = requireFunc("".concat(globalWindow.STORYBOOK_NAME, "/app")).default.create(Object.assign({
  autoboot: false,
  rootElement: rootEl
}, config.APP));
var lastPromise = app.boot();
var hasRendered = false;
var isRendering = false;

function render(options, el) {
  if (isRendering) return;
  isRendering = true;
  var template = options.template,
      _options$context = options.context,
      context = _options$context === void 0 ? {} : _options$context,
      element = options.element;

  if (hasRendered) {
    lastPromise = lastPromise.then(function (instance) {
      return instance.destroy();
    });
  }

  lastPromise = lastPromise.then(function () {
    var appInstancePrivate = app.buildInstance();
    return appInstancePrivate.boot().then(function () {
      return appInstancePrivate;
    });
  }).then(function (instance) {
    instance.register('component:story-mode', Ember.Component.extend(Object.assign({
      layout: template || options
    }, context)));
    var component = instance.lookup('component:story-mode');

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

export default function renderMain(_ref) {
  var storyFn = _ref.storyFn,
      kind = _ref.kind,
      name = _ref.name,
      showMain = _ref.showMain,
      showError = _ref.showError;
  var element = storyFn();

  if (!element) {
    showError({
      title: "Expecting a Ember element from the story: \"".concat(name, "\" of \"").concat(kind, "\"."),
      description: dedent(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n        Did you forget to return the Ember element from the story?\n        Use \"() => hbs('{{component}}')\" or \"() => { return {\n          template: hbs`{{component}}`\n        } }\" when defining the story.\n      "], ["\n        Did you forget to return the Ember element from the story?\n        Use \"() => hbs('{{component}}')\" or \"() => { return {\n          template: hbs\\`{{component}}\\`\n        } }\" when defining the story.\n      "])))
    });
    return;
  }

  showMain();
  render(element, rootEl);
}