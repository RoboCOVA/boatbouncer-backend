import { Box, Text } from '@adminjs/design-system';
import Badges from './Badge';

const StatusButton = (props) => {
  const { record } = props;

  return (
    <Box marginBottom={props.where === 'show' ? 24 : 0}>
      {props.where === 'show' ? (
        <Text color="#898A9A" marginBottom={4} fontWeight={300} fontSize={12}>
          {props.property.label}
        </Text>
      ) : null}
      <Badges
        text={record.params.status}
        stat={record.params?.status?.toLowerCase() ?? ''}
      />
    </Box>
  );
};

export default StatusButton;
