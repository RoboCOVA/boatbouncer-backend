import { useEffect, useState, useRef } from 'react';
import { Box, H2, H5, Overlay, Loader } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    setLoading(true);
    api
      .getPage({ pageName: 'Statistics' })
      .then((res) => {
        const { boats, mapboxApiToken } = res.data;

        const boatFeatures = boats.map((boat) => ({
          type: 'Feature',
          geometry: boat.latLng,
          properties: boat,
        }));

        mapboxgl.accessToken = mapboxApiToken;
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [-103.5917, 40.6699],
          zoom: 3,
        });
        mapRef.current.on('load', () => {
          mapRef.current.addSource('boats', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: boatFeatures,
            },
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
          });

          mapRef.current.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'boats',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': [
                'step',
                ['get', 'point_count'],
                '#06b6d4',
                100,
                '#f1f075',
                750,
                '#3b82f6',
              ],
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                30,
                110,
                40,
                760,
                50,
              ],
            },
          });

          mapRef.current.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'boats',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': ['get', 'point_count_abbreviated'],
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 17,
            },
          });

          mapRef.current.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'boats',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-color': '#06b6d4',
              'circle-radius': 10,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
            },
          });

          // inspect a cluster on click
          mapRef.current.on('click', 'clusters', (e) => {
            const features = mapRef.current.queryRenderedFeatures(e.point, {
              layers: ['clusters'],
            });
            const clusterId = features[0].properties.cluster_id;
            mapRef.current
              .getSource('boats')
              .getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) return;
                mapRef.current.easeTo({
                  center: features[0].geometry.coordinates,
                  zoom: zoom,
                });
              });
          });
          // When a click event occurs on a feature in
          // the unclustered-point layer, open a popup at
          // the location of the feature, with
          // description HTML from its properties.
          mapRef.current.on('click', 'unclustered-point', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const { boatName, location, pricing, currency, status } =
              e.features[0].properties;

            const loc = JSON.parse(location);
            let prices = JSON.parse(pricing);

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(
                `<div style="font-family: Arial, sans-serif; font-style:italic; padding: 10px;">
                    <h3 style="margin-bottom: 5px;">Name: ${boatName}</h3>
                    <h3 style="margin-bottom: 5px;">Status: ${status}</h3>
                    <p style="margin-bottom: 5px;">
                      <strong>Location: </strong>${
                        loc.address ? loc.address + ',' : ''
                      } ${loc.city ? loc.city + ',' : ''} ${
                  loc.state ? loc.state + ',' : ''
                } ${loc.zipCode ?? ''}
                    </p>
                    <p>
                      <strong>Pricing:</strong>
                      <ul style="padding-left: 20px;">
                        ${
                          prices[0]
                            ? `<li>${prices[0].type}: ${prices[0].value} ${currency}</li>`
                            : null
                        }
                        ${
                          prices[1]
                            ? `<li>${prices[1].type}: ${prices[1].value} ${currency}</li>`
                            : null
                        }
                      </ul>
                    </p>
                  </div>
                `
              )
              .addTo(mapRef.current);
          });

          mapRef.current.on('mouseenter', 'clusters', () => {
            mapRef.current.getCanvas().style.cursor = 'pointer';
          });

          mapRef.current.on('mouseenter', 'unclustered-point', () => {
            mapRef.current.getCanvas().style.cursor = 'pointer';
          });

          mapRef.current.on('mouseleave', 'unclustered-point', () => {
            mapRef.current.getCanvas().style.cursor = '';
          });

          mapRef.current.on('mouseleave', 'clusters', () => {
            mapRef.current.getCanvas().style.cursor = '';
          });
        });

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });

    return () => mapRef.current.remove();
  }, [page]);

  return (
    <Box>
      <Box position="relative">
        <img
          // src="/images/boat-bouncer.png"
          alt=""
          height="200px"
          width="100%"
          style={{
            objectFit: 'cover',
            borderRadius: '4px',
            background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
          }}
        />
        <Box
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}
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
            <H2 style={{ fontWeight: 900 }}>Boat Cluster Distribution</H2>
            <H5 style={{ fontWeight: 700 }}>
              Boat distribution across different areas. Zoom in or click on the
              cluster to see the sub cluster divisions. Zoom out to see clusters
              back.
            </H5>
          </Box>
        </Box>
      </Box>

      {loading && <Overlay />}
      {loading && <Loader />}

      <div
        id="map"
        ref={mapContainerRef}
        style={{ height: 'calc(67.5vh)' }}
      ></div>
    </Box>
  );
};

export default Statistics;
