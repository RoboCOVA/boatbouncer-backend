import prettyMilliseconds from 'pretty-ms';
import { Box, Text } from '@adminjs/design-system';

const ResponseTime = (props) => {
  const { record } = props;

  return (
    <Box marginBottom={props.where === 'show' ? 14 : 0}>
      {props.where === 'show' ? (
        <Text color="#898A9A" marginBottom={4} fontWeight={300} fontSize={12}>
          {props.property.label}
        </Text>
      ) : null}

      {record?.params?.avgResponseTime
        ? prettyMilliseconds(record?.params?.avgResponseTime)
        : '—'}
    </Box>
  );
};

export default ResponseTime;
