import { useEffect, useState } from 'react';
import {
  Box,
  H2,
  H3,
  H5,
  Overlay,
  Loader,
  Pagination,
  Text,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Badge,
} from '@adminjs/design-system';
import { ApiClient } from 'adminjs';
import { commonStyle } from './Badge';
import prettyMilliseconds from 'pretty-ms';

// Helper function to get the status count
const getStatusCount = (statusArray, statusName) => {
  const status = statusArray.find((s) => s.status === statusName);
  return status ? status.count : 0;
};

const Statistics = () => {
  const api = new ApiClient();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .getPage({ pageName: 'Analytics', params: { page } })
      .then((result) => {
        setResponse(result.data[0]);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [page]);

  return (
    <Box>
      <Box position={'relative'}>
        <img
          src="/images/boat-bouncer.png"
          height={'400vh'}
          width={'100%'}
          style={{ objectFit: 'cover' }}
        />
        <Box
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}
          pt={20}
        >
          <Box
            marginLeft={30}
            style={{
              position: 'absolute',
              top: 40,
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
      </Box>

      {loading && <Overlay />}
      {loading && <Loader />}

      {!loading && response && (
        <Box px="xl">
          <H3 marginLeft={5}>Boat Status Overview</H3>
          <Table>
            <thead>
              <TableRow>
                <TableCell>Boat Name</TableCell>
                <TableCell>Searchable</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>Completed</TableCell>
                <TableCell>Cancelled</TableCell>
                <TableCell>Avg.Resp.Time</TableCell>
              </TableRow>
            </thead>
            <TableBody>
              {response.data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Text marginBottom={4} fontWeight={400} fontSize={14}>
                      <a
                        className="anchor-link"
                        href={`/admin/resources/Boats/records/${item._id}/show`}
                      >
                        {item.boatDetails?.boatName || 'N/A'}
                      </a>
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        ...commonStyle,
                        color: !item.boatDetails?.searchable
                          ? 'rgb(234,84,85)'
                          : 'rgb(40,199,111)',
                        backgroundColor: !item.boatDetails?.searchable
                          ? 'rgba(234,84,85,0.24)'
                          : 'rgba(40,199,111,0.24)',
                      }}
                    >
                      {item.boatDetails?.searchable ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Text
                      marginBottom={4}
                      color="#FFA500"
                      backgroundColor="#FFF5E6"
                      style={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        borderRadius: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      fontWeight={500}
                      fontSize={18}
                    >
                      {getStatusCount(item.status, 'Pending')}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text
                      marginBottom={4}
                      color="#008000"
                      backgroundColor="#E6FFE6"
                      style={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        borderRadius: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      fontWeight={500}
                      fontSize={18}
                    >
                      {getStatusCount(item.status, 'Completed')}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text
                      marginBottom={4}
                      color="#FF0000"
                      backgroundColor="#FFE6E6"
                      style={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        borderRadius: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      fontWeight={500}
                      fontSize={18}
                    >
                      {getStatusCount(item.status, 'Cancelled')}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text
                      marginBottom={4}
                      marginLeft={10}
                      style={{
                        display: 'flex',
                        borderRadius: '100%',
                      }}
                      fontWeight={500}
                      fontSize={18}
                    >
                      {item.boatDetails?.avgResponseTime
                        ? prettyMilliseconds(item.boatDetails?.avgResponseTime)
                        : '—'}
                    </Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Text py="xl" textAlign="center">
            <Pagination
              total={response.metadata[0].total}
              page={page}
              perPage={10}
              onChange={(item) => setPage(item)}
            />
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Statistics;
