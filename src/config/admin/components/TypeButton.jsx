const TypeButton = (props) => {
  const { record } = props;
  const cssColor =
    record.params.type === 'Per Hour'
      ? 'blue'
      : record.params.type === 'Per Day'
      ? 'green'
      : '';

  return (
    <div>
      <button
        className="status-button"
        style={{ backgroundColor: cssColor }}
        disabled
      >
        {record.params.type}
      </button>
    </div>
  );
};

export default TypeButton;
