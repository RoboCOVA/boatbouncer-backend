import { Badge, Box, Text } from '@adminjs/design-system';
import { commonStyle } from './Badge';

const VerificationButton = (props) => {
  const { record } = props;

  return (
    <Box marginBottom={props.where === 'show' ? 24 : 0}>
      {props.where === 'show' ? (
        <Text color="#898A9A" marginBottom={4} fontWeight={300} fontSize={12}>
          {props.property.label}
        </Text>
      ) : null}
      <Badge
        style={{
          ...commonStyle,
          color:
            record.params.verified === false
              ? 'rgb(234,84,85)'
              : 'rgb(40,199,111)',
          backgroundColor:
            record.params.verified === false
              ? 'rgba(234,84,85,0.16)'
              : 'rgba(40,199,111,0.16)',
        }}
      >
        {record.params.verified === false ? 'Not Verified' : 'Verified'}
      </Badge>
    </Box>
  );
};

export default VerificationButton;
