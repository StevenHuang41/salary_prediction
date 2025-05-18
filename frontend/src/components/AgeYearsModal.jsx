import ModalTemplate from "./ModalTemplate";

const AgeYearsModal = ({
  handlePrimaryClick,
}) => {
  return (
    <ModalTemplate
      id={'ageYearModal'}
      modalHeaderText={'Invalid Age and Years of Experience'}
      modalBodyText={'The result of Age - Years of experience must not less than 18.'}
      hasSecondaryBtn={false}
      handleModalPrimaryClick={handlePrimaryClick}
      primaryText={'Ok'}


    />
  )
}

export default AgeYearsModal;