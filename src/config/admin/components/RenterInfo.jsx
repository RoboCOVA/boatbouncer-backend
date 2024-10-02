import { Box, Text } from '@adminjs/design-system';
import Badges from './Badge';
import { status } from '../utils/constants';

const RenterInfo = (props) => {
  const key = props.property?.props?.name;

  return (
    <Box
      marginBottom={props.where === 'show' ? 14 : 0}
      color={key === 'email' ? 'rgb(48, 64, 214)' : null}
    >
      {props?.where === 'show' ? (
        <Text color="#898A9A" marginBottom={4} fontWeight={300} fontSize={12}>
          {props?.property?.label}
        </Text>
      ) : null}
      {key === 'boatName'
        ? props.record.populated.boatId?.params?.boatName ?? (
            <Badges stat={status?.deleted} text="Boat Unavailable" />
          )
        : props.record.populated?.renter?.params[key]}
    </Box>
  );
};

export default RenterInfo;
