import React from 'react'

const SelectInput = ({
  id,
  labelText,
  options,
  invalidFeedbackText,
  className,
  children,
  ...props
}) => {
  return (<>
    <div className={`form-floating ${className || ''}`}>

      <select
        className='form-select'
        id={id}
        defaultValue=''
        required
      >
        <option value='' disabled>
          {children}
        </option>
        {options.map(({ value, text }) => (
          <option key={value} value={value}>{text}</option>
        ))}
      </select>
      <label htmlFor={id} className='mx-2'>{labelText}</label>
      <div className='invalid-feedback'>
       {invalidFeedbackText} 
      </div>

    </div>
  </>)
};

export default SelectInput;