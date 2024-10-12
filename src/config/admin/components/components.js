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
  BoatId: componentLoader.add('BoatId', './BoatId'),
  SuperButton: componentLoader.add('SuperButton', './SuperButton'),
  BooleanButton: componentLoader.add('BooleanButton', './BooleanButton'),
  CurrencyButton: componentLoader.add('CurrencyButton', './CurrencyButton'),
  Analytics: componentLoader.add('Analytics', './Analytics'),
  // Statistics: componentLoader.add('Statistics', './Statistics'),
};

export { components, componentLoader };
