import { Badge, Box, Text } from '@adminjs/design-system';
import { commonStyle } from './Badge';

const SuperButton = (props) => {
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
          color: !record.params.super ? 'rgb(234,84,85)' : 'rgb(40,199,111)',
          backgroundColor: !record.params.super
            ? 'rgb(234,84,85,0.24)'
            : 'rgb(40,199,111,0.24)',
        }}
      >
        {record.params.super ? 'Yes' : 'No'}
      </Badge>
    </Box>
  );
};

export default SuperButton;
