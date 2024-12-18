import { Box } from '@adminjs/design-system';

const Members = (props) => {
  return (
    <Box>
      {
        props.record.populated[
          `members.${props?.property?.path === 'member1' ? 1 : 0}`
        ]?.title
      }
    </Box>
  );
};

export default Members;
