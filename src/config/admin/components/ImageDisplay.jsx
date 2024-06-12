import React from 'react';

const ImageDisplay = (props) => {
  console.log('img', props);
  const { record } = props;

  const imageUrls = [];

  for (let i = 0; i < 5; i++) {
    const imageUrl = record.params[`imageUrls.${i}`];
    if (imageUrl) {
      imageUrls.push(imageUrl);
    }
  }

  return (
    <div>
      {imageUrls.length > 0 ? (
        imageUrls.map((url, index) =>
          url ? (
            <img
              key={index}
              src={url}
              alt={`Boat Image ${index + 1}`}
              style={{ width: '250px', margin: '10px' }}
            />
          ) : null
        )
      ) : (
        <p>No images available</p>
      )}
    </div>
  );
};

export default ImageDisplay;
