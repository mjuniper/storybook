"use strict";

var _global = _interopRequireDefault(require("global"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globalWindow = _global.default.window;
globalWindow.STORYBOOK_NAME = process.env.STORYBOOK_NAME;
globalWindow.STORYBOOK_ENV = 'ember';
globalWindow.STORYBOOK_REQUIRE_ALIAS = process.env.STORYBOOK_REQUIRE_ALIAS;