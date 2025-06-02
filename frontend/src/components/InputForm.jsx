import { useEffect, useRef, useState } from "react";
import { getUniqJobTitle } from "../api/fetchData";
import SelectInput from "./SelectInput";
import TermsCheckbox from "./TermsCheckbox";
import AgeYearsModal from "./AgeYearsModal";

const InputForm = ({ getSubmitData }) => {
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const forms = formRef.current;
    
    forms.classList.add('was-validated');
    
    if (!forms.checkValidity()) return;
    
    const form_elements = formRef.current.elements;
    
    const ageYearModalTrigger = 
      document.getElementById('ageYearModalTrigger');

    if ((form_elements.ageSelectInput.value - 
      form_elements.yearESelectInput.value) < 18) {
      form_elements.yearESelectInput.value = '';
      ageYearModalTrigger.click()
      return 
    }

    const data = {
      age: form_elements['ageSelectInput'].value,
      gender: form_elements['genderSelectInput'].value,
      education_level: form_elements['eduLevSelectInput'].value,
      job_title: form_elements['jobTitleSelectInput'].value,
      years_of_experience: form_elements['yearESelectInput'].value,
    } 
    
    getSubmitData(data);
  };

  const ageOptions = Array.from({ length: 71 }, (_, i) => (
    {value: i + 18, text: i + 18}
  ));

  const yearEOptions = Array.from({ length: 71 }, (_, i) => (
    {value: i, text: i}
  ));

  // get job title options
  const [jobOptions, setJobOptions] = useState([]);
  useEffect(() => {
    const abortController = new AbortController();
    const getData = async () => {
      try {
        const data = await getUniqJobTitle();
        const options = data.value.map((val) => (
          {value: val, text: val}
        ));
        setJobOptions(options);
      } catch (err) {console.log(err);}
    };
    getData();
    return () => abortController.abort()
  }, []);

  return (<>
    <div className="row"><div className="col">
      <div className="text-primary fs-1">
        Salary Prediction
      </div>
    </div></div>

    <form
      id="InputForm"
      className={`
        needs-validation
      `}
      noValidate
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <div
        className={`
          row row-cols-1 row-cols-md-2 row-cols-l
          g-2 
        `}
      >

        <SelectInput
          className="col col-xl-2"
          selectId='ageSelectInput'
          options={ageOptions}
          invalidFeedbackText='Please select a valid age.'
          defaultValue=''
        >
          Age
        </SelectInput>


        <SelectInput
          className="col col-xl-2"
          selectId='genderSelectInput'
          options={[
            {value: 'male', text: 'Male'},
            {value: 'female', text: 'Female'},
            {value: 'other', text: 'Other'},
          ]}
          invalidFeedbackText='Please select a gender.'
          defaultValue=''
        >
          Gender
        </SelectInput>


        <SelectInput
          selectId='eduLevSelectInput'
          options={[
            {value: 'No specified', text: 'No specified'},
            {value: 'High School', text: 'High School'},
            {value: 'Bachelor', text: 'Bachelor'},
            {value: 'Master', text: 'Master'},
            {value: 'PhD', text: 'PhD'},
          ]}
          invalidFeedbackText='Please select an education level.'
          className="col col-xl-3"
          defaultValue=''
        >
          Education level
        </SelectInput>

        <SelectInput
          selectId='jobTitleSelectInput'
          options={jobOptions}
          invalidFeedbackText='Please select a job title.'
          className="col col-xl-3"
          defaultValue=''
        >
          Job title
        </SelectInput>

        <SelectInput
          selectId='yearESelectInput'
          options={yearEOptions}
          invalidFeedbackText='Please select a valid number'
          className="col col-xl-2"
          defaultValue=''
        >
          Years of experience
        </SelectInput>
      </div>

      <div
        className={`
          row row-cols-1 row-cols-md-2
          mt- m-0 g-2
          align-items-center
        `}
      >
        <TermsCheckbox 
          className="col-12 col-md-6 p-0"
          modalId='termsModal'
          labelText='Agree to'
          btnText='terms and conditions'
          invalidFeedbackText='You must agree before submitting.'
        />

        <div
          className={`
            col-12 col-md-6 p-0 
            d-flex justify-content-md-end
          `}
        >
          <button
            className={`
              btn btn-primary
            `}
            type="submit"
            id="predictSalaryBtn"
          >
            Predict Salary
          </button>
        </div>

      </div>
    </form>


    <button
      id='ageYearModalTrigger'
      data-bs-toggle="modal"
      data-bs-target={'#ageYearModal'}
      style={{display: 'none'}}
    />

    <AgeYearsModal
      id="ageYearModal"
    />



  </>)
};

export default InputForm;