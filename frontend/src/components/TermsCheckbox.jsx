import React, { useRef } from 'react'
import TermsModal from './TermsModal'

const TermsCheckbox = ({
  modalId,
  labelText,
  btnText,
  invalidFeedbackText,
}) => {
  const checkboxRef = useRef(null);

  return (<>
    <div className="col2">
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
        <div
          className='btn btn-link p-0 px-1 align-baseline'
          data-bs-toggle="modal"
          data-bs-target={`#${modalId}`}
        >
          {btnText}
        </div>

        <div className="invalid-feedback">
          {invalidFeedbackText}
        </div>

      </div>
    </div>

    <TermsModal
      id={modalId}
      // handleModalSecondaryClick={handleModalDisagree}
      handleModalSecondaryClick={() => checkboxRef.current.checked = false}
      handleModalPrimaryClick={() => checkboxRef.current.checked = true}
    />

  </>)
}

export default TermsCheckbox