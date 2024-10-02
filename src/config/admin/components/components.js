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
  OwnerInfo: componentLoader.add('OwnerInfo', './OwnerInfo'),
  RenterInfo: componentLoader.add('RenterInfo', './RenterInfo'),
  Analytics: componentLoader.add('Analytics', './Analytics'),
  BoatId: componentLoader.add('BoatId', './BoatId'),
  SuperButton: componentLoader.add('SuperButton', './SuperButton'),
  BooleanButton: componentLoader.add('BooleanButton', './BooleanButton'),
};

export { components, componentLoader };
