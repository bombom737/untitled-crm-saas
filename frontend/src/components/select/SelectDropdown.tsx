import Select from 'react-select';
import { useEffect, useRef, forwardRef } from 'react';

interface Option {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  options: Array<Option>;
  value: Option | null;
}

const SelectDropdown = forwardRef<any, Props>(({ options, value }, ref) => {
  const isFirstRender = useRef(true);  // Track first render

  // Only trigger onChange after the first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;  // Skip on mount
      console.log(value)
    }
  }, []);

  // Custom Option Component for rendering icon and label in dropdown list
  const CustomOption = (props: any) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
        {data.icon && <span style={{ marginRight: 8 }}>{data.icon}</span>}  {/* Render icon if present */}
        <span>{data.label}</span>
      </div>
    );
  };

  const customComponents = {
    Option: CustomOption,  // Use only the custom Option component
  };

  return (
    <Select
      options={options}
      value={value}  // Ensure value is the entire object from options
      components={customComponents}  // Custom Option component only
      isSearchable={false}
      styles={{
        control: (provided) => ({
          ...provided,
          height: '34px',
          border: '1px solid',
          borderRadius: '5px',
          margin: '5px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }),
        valueContainer: (provided) => ({
          ...provided,
          height: '100%',
        }),
        indicatorsContainer: (provided) => ({
          ...provided,
          height: '100%',
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          padding: '0 8px',
          color: '#000',
        }),
        option: (provided) => ({
          ...provided,
          padding: '10px',
        }),
        menu: (provided) => ({
          ...provided,
          marginTop: '0',
        }),
      }}
      ref={ref}
    />
  );
});

export default SelectDropdown;
