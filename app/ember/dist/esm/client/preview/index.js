import { start } from '@storybook/core/client';
import './globals';
import render from './render';

var _start = start(render),
    coreConfigure = _start.configure,
    clientApi = _start.clientApi,
    forceReRender = _start.forceReRender;

var setAddon = clientApi.setAddon,
    addDecorator = clientApi.addDecorator,
    addParameters = clientApi.addParameters,
    clearDecorators = clientApi.clearDecorators,
    getStorybook = clientApi.getStorybook,
    raw = clientApi.raw;
export { setAddon, addDecorator, addParameters, clearDecorators, getStorybook, raw };
var framework = 'ember';
export var storiesOf = function storiesOf(kind, m) {
  return clientApi.storiesOf(kind, m).addParameters({
    framework: framework
  });
};
export var configure = function configure(loadable, m) {
  return coreConfigure(framework, loadable, m);
};
export { forceReRender };