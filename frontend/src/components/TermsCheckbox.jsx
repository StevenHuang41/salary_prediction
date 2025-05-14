import React, { useRef } from 'react'
import TermsModal from './TermsModal'

const TermsCheckbox = ({
  modalId,
  labelText,
  btnText,
  invalidFeedbackText,
  // checkboxRef,
}) => {
  const checkboxRef = useRef(null);

  const handleModelAgree = () => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = true;
    }
  }

  const handleModelDisagree = () => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = false;
    }
  }

  const modelBodyText = ('If you agree with these terms and conditions,' +
    ' you authorize our team to collect your data for future improvement.' +
    ' Your data will be used to train backend machine learning models,' + 
    ' and only for training purpose.')

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
      modalHeaderText='Terms and Conditions'
      modalBodyText={modelBodyText}
      handleModelDisagree={handleModelDisagree}
      handleModelAgree={handleModelAgree}
    />

  </>)
}

export default TermsCheckbox