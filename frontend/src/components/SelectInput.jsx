import React, { useState } from 'react'

const SelectInput = ({
  selectId,
  options,
  invalidFeedbackText,
  className,
  defaultValue,
  children,
  ...props
}) => {
  const [selectValue, setSelectValue] = useState('');

  const handleChange = (e) => {
    setSelectValue(e.target.value);
    console.log(selectValue);
  };

  return (<>
    <div className={`form-floating ${className || ''}`}>

      <select
        className={`
          form-select fs-6
          ${selectValue === '' ? 'text-secondary' : 'fw-bold'}
        `}
        id={selectId}
        defaultValue={`${defaultValue || ''}`}
        onChange={handleChange}
        required
      >
        <option value='' disabled>
          {`Choose ${children.toLowerCase()}`}
        </option>
        {options.map(({ value, text }) => (
          <option key={value} value={value}>{text}</option>
        ))}
      </select>
      <label htmlFor={selectId}>{children}</label>
      <div className='invalid-feedback'>
        {invalidFeedbackText} 
      </div>

    </div>
  </>)
};

export default SelectInput;