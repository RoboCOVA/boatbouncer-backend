import { Box, Text } from '@adminjs/design-system';

const OwnerInfo = (props) => {
  const key = props.property.props.name;

  return (
    <Box
      marginBottom={props.where === 'show' ? 14 : 0}
      color={key === 'email' ? 'rgb(48, 64, 214)' : null}
    >
      {props.where === 'show' ? (
        <Text color="#898A9A" marginBottom={4} fontWeight={300} fontSize={12}>
          {props.property.label}
        </Text>
      ) : null}
      {props.record.populated.owner.params[key]}
    </Box>
  );
};

export default OwnerInfo;
