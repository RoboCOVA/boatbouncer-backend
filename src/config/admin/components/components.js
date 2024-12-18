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
  EditButton: componentLoader.add('EditButton', './EditButton'),
  BooleanButton: componentLoader.add('BooleanButton', './BooleanButton'),
  CurrencyButton: componentLoader.add('CurrencyButton', './CurrencyButton'),
  Analytics: componentLoader.add('Analytics', './Analytics'),
  Statistics: componentLoader.add('Statistics', './Statistics'),
  Conversations: componentLoader.add('Conversations', './Conversations'),
  Members: componentLoader.add('Members', './Members'),
};

export { components, componentLoader };
