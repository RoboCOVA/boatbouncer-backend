import { Badge, Box, Text } from '@adminjs/design-system';
import { commonStyle } from './Badge';

const TypeButton = (props) => {
  const { record } = props;

  return (
    <Box marginBottom={props.where === 'show' ? 24 : 0}>
      {props.where === 'show' ? (
        <Text color="#898A9A" marginBottom={4} fontWeight={300} fontSize={12}>
          Type
        </Text>
      ) : null}
      <Badge
        style={{
          ...commonStyle,
          color:
            record.params.type === 'Per Hour'
              ? 'rgba(13, 110, 253)'
              : 'rgb(2, 136, 209)',
          backgroundColor:
            record.params.type === 'Per Hour'
              ? 'rgba(13, 110, 253,0.24)'
              : 'rgba(2, 136, 209, 0.24)',
        }}
      >
        {record.params.type}
      </Badge>
    </Box>
  );
};

export default TypeButton;
