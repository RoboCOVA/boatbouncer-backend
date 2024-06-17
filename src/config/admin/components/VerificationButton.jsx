const VerificationButton = (props) => {
  const { record } = props;
  const cssColor =
    record.params.verified === false
      ? 'red'
      : record.params.verified === true
      ? 'green'
      : '';

  return (
    <div>
      <button
        className="status-button"
        style={{ backgroundColor: cssColor }}
        disabled
      >
        {record.params.verified === false ? 'Not Verified' : 'Verified'}
      </button>
    </div>
  );
};

export default VerificationButton;
