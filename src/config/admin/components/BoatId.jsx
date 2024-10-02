import { Box, Text } from '@adminjs/design-system';
import Badges from './Badge';
import { status } from '../utils/constants';

const BoatId = (props) => {
  return (
    <>
      <Box marginBottom={props.where === 'show' ? 24 : 0}>
        {props.where === 'show' ? (
          <Text color="#898A9A" marginBottom={4} fontWeight={300} fontSize={12}>
            {props.property.label}
          </Text>
        ) : null}

        <Box>
          {props.record.populated.boatId?.params?.boatName ?? (
            <Badges stat={status?.deleted} text="Boat Unavailable" />
          )}
        </Box>
      </Box>
    </>
  );
};

export default BoatId;
