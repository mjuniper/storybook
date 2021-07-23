import { start } from '@storybook/core/client';
import './globals';
import render from './render';
const {
  configure: coreConfigure,
  clientApi,
  forceReRender
} = start(render);
export const {
  setAddon,
  addDecorator,
  addParameters,
  clearDecorators,
  getStorybook,
  raw
} = clientApi;
const framework = 'ember';
export const storiesOf = (kind, m) => clientApi.storiesOf(kind, m).addParameters({
  framework
});
export const configure = (loadable, m) => coreConfigure(framework, loadable, m);
export { forceReRender };