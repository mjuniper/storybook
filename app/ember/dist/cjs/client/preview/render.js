"use strict";

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.object.freeze.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderMain;

require("core-js/modules/es.object.assign.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.concat.js");

var _global = _interopRequireDefault(require("global"));

var _tsDedent = _interopRequireDefault(require("ts-dedent"));

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var globalWindow = _global.default.window,
    document = _global.default.document;
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

function renderMain(_ref) {
  var storyFn = _ref.storyFn,
      kind = _ref.kind,
      name = _ref.name,
      showMain = _ref.showMain,
      showError = _ref.showError;
  var element = storyFn();

  if (!element) {
    showError({
      title: "Expecting a Ember element from the story: \"".concat(name, "\" of \"").concat(kind, "\"."),
      description: (0, _tsDedent.default)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n        Did you forget to return the Ember element from the story?\n        Use \"() => hbs('{{component}}')\" or \"() => { return {\n          template: hbs`{{component}}`\n        } }\" when defining the story.\n      "], ["\n        Did you forget to return the Ember element from the story?\n        Use \"() => hbs('{{component}}')\" or \"() => { return {\n          template: hbs\\`{{component}}\\`\n        } }\" when defining the story.\n      "])))
    });
    return;
  }

  showMain();
  render(element, rootEl);
}