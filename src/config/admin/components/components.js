import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

const components = {
  MyImage: componentLoader.add('MyImage', './ImageDisplay'),
  StatusButton: componentLoader.add('StatusButton', './StatusButton'),
  TypeButton: componentLoader.add('TypeButton', './TypeButton'),
  VerificationButton: componentLoader.add(
    'VerificationButton',
    './VerificationButton'
  ),
};

export { components, componentLoader };
