import React from 'react'

const SelectInput = ({
  id,
  labelText,
  options,
  invalidFeedbackText,
  c_name,
}) => {
  return (<>
    <div className={c_name}>

      <label htmlFor={id} className='form-label'>{labelText}</label>
      <select className='form-select' id={id} defaultValue='' required>
        <option value='' disabled>
          Choose {labelText.toLowerCase()} ...
        </option>
        {options.map(({ value, text }) => (
          <option key={value} value={value}>{text}</option>
        ))}
      </select>
      <div className='invalid-feedback'>
       {invalidFeedbackText} 
      </div>

    </div>
  </>)
};

export default SelectInput;