import { useEffect, useState } from 'react';
import { Box, H2, H5, Overlay, Loader } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const Analytics = () => {
  const api = new ApiClient();
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getPage({ pageName: 'Analytics' })
      .then((result) => {
        // setResponse(result);
        // console.log(result);

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });

    return () => {};
  }, []);

  return (
    <Box>
      <Box>
        <img
          src="/images/boat-bouncer.png"
          height={'400vh'}
          width={'100%'}
          style={{ objectFit: 'cover' }}
        />
      </Box>

      <Box
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}
        py={30}
      >
        <Box
          marginLeft={30}
          style={{
            position: 'absolute',
            top: 135,
            zIndex: 100,
            marginInline: 30,
            color: 'white',
            fontWeight: 900,
          }}
        >
          <H2>Welcome To Boatbouncer Admin</H2>
          <H5>
            Welcome to your admin interface, where you can manage your
            platform's users and all of your resources.
          </H5>
        </Box>
      </Box>

      {loading && <Overlay />}
      {loading && <Loader />}

      {!loading && <></>}
    </Box>
  );
};

export default Analytics;
