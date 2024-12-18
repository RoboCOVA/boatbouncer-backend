import { Input, Select, Label } from '@adminjs/design-system';
import { useCurrentAdmin } from 'adminjs';

const EditButton = (props) => {
  const { onChange, value, property } = props;
  const [currentAdmin] = useCurrentAdmin();

  if (!currentAdmin.super) {
    return (
      <div>
        <Label>* Super</Label>
        <Input
          value="No"
          disabled
          style={{ width: '100%', fontSize: '14px' }}
        />
      </div>
    );
  }

  return (
    <div>
      <Label>Super</Label>
      <Select
        value={property.availableValues.find(
          (option) => option.value === value
        )}
        options={property.availableValues}
        onChange={(selected) => {
          onChange(property.name, selected.value);
        }}
        isClearable={false}
        style={{ width: '100%', fontSize: '14px' }}
      />
    </div>
  );
};

export default EditButton;
