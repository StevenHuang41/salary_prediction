import React, { useRef } from 'react'
import TermsModal from './TermsModal'

const TermsCheckbox = ({
  className,
  modalId,
  labelText,
  btnText,
  invalidFeedbackText,
  setPredictResult
}) => {
  const checkboxRef = useRef(null);

  return (<>
    <div className={`${className || ''}`}>
      <div
        className={`
          form-check
        `}
      >
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="invalidCheck"
          ref={checkboxRef}
          required
        />

        <label
          className={`
            form-check-label
            d-flex
            align-items-center
          `}
          htmlFor="invalidCheck"
        >
          {labelText}
          <button
            className={`
              btn btn-link
              col-auto
              p-0 ps-1
            `}
            data-bs-toggle="modal"
            data-bs-target={`#${modalId}`}
            onClick={(e) => {e.preventDefault()}}
          >
            {btnText}
          </button>
        </label>
        <div className="invalid-feedback m-0">
          {invalidFeedbackText}
        </div>

      </div>
    </div>

    <TermsModal
      id={modalId}
      handleModalSecondaryClick={() => {
        checkboxRef.current.checked = false;
        setPredictResult(false);
      }}
      handleModalPrimaryClick={() => (
        checkboxRef.current.checked = true
      )}
    />

           {/* row
           m-0 
           d-flex
           align-items-center */}
  </>)
}

export default TermsCheckbox;