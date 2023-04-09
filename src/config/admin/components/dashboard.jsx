import { Box, Text, H3 } from '@adminjs/design-system';

const Dashboard = () => {
  return (
    <Box bg="primary100" color="white" py="xl" pl={30}>
      <Box
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}
        py={30}
      >
        <Box>
          <H3>Welcome To Boat Bouncer Admin</H3>
          <Text fontSize={16}>
            Welcome to your admin interface, where you can manage your
            platform's users and all of your resources.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
