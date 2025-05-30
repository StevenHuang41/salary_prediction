import React, { useRef } from 'react'
import TermsModal from './TermsModal'

const TermsCheckbox = ({
  modalId,
  labelText,
  btnText,
  invalidFeedbackText,
  c_name,
}) => {
  const checkboxRef = useRef(null);

  return (<>
    <div className={c_name}>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="invalidCheck"
          ref={checkboxRef}
          required
        />
        <label className="form-check-label" htmlFor="invalidCheck">
          {labelText}
        </label>
        <button
          className='btn btn-link p-0 px-1 align-baseline'
          data-bs-toggle="modal"
          data-bs-target={`#${modalId}`}
          onClick={(e) => {e.preventDefault()}}
        >
          {btnText}
        </button>

        <div className="invalid-feedback">
          {invalidFeedbackText}
        </div>

      </div>
    </div>

    <TermsModal
      id={modalId}
      handleModalSecondaryClick={() => (
        checkboxRef.current.checked = false
      )}
      handleModalPrimaryClick={() => (
        checkboxRef.current.checked = true
      )}
    />

  </>)
}

export default TermsCheckbox;