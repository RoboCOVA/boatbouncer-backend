import { Badge, Box, Text } from '@adminjs/design-system';
import { commonStyle } from './Badge';

const NoticeButton = (props) => {
  const { record } = props;

  console.log(props);

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
          color: !record.params[props.property.label.toLowerCase()]
            ? 'rgb(234,84,85)'
            : 'rgb(40,199,111)',
          backgroundColor: !record.params[props.property.label.toLowerCase()]
            ? 'rgb(234,84,85,0.24)'
            : 'rgb(40,199,111,0.24)',
        }}
      >
        {record.params[props.property.label.toLowerCase()] ? 'Yes' : 'No'}
      </Badge>
    </Box>
  );
};

export default NoticeButton;
