import { Badge, Box, Text } from '@adminjs/design-system';
import { commonStyle } from './Badge';

const CurrencyButton = (props) => {
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
          color: 'rgb(17,140,79)',
          backgroundColor: 'rgba(17,140,79,0.16)',
        }}
      >
        {record.params[props.property.label.toLowerCase()]}
      </Badge>
    </Box>
  );
};

export default CurrencyButton;
