const StatusButton = (props) => {
  const { record } = props;
  const cssColor =
    record.params.status === 'Processing'
      ? 'blue'
      : record.params.status === 'Completed'
      ? 'green'
      : record.params.status === 'Cancelled'
      ? 'red'
      : record.params.status === 'Pending'
      ? 'orange'
      : '';

  return (
    <div>
      <button
        className="status-button"
        style={{ backgroundColor: cssColor }}
        disabled
      >
        {record.params.status}
      </button>
    </div>
  );
};

export default StatusButton;
