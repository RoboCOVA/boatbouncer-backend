import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

const components = {
  MyImage: componentLoader.add('MyImage', './ImageDisplay'),
};

export { components, componentLoader };
