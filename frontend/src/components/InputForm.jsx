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
    <div className="row text-bg-secondary">Salary Prediction</div>
    <form
      id="InputForm"
      className={`
        row bg-danger needs-validation form-floating
      `}
        // d-flex justify-content-between
      noValidate
      ref={formRef}
      onSubmit={handleSubmit}
    >

      <SelectInput
        id='ageSelectInput'
        labelText='Age'
        options={ageOptions}
        invalidFeedbackText='Please select a valid age.'
        className="p-0 col-xxl-2 col-md-6"
      >
        Choose age ...
      </SelectInput>

      <SelectInput
        id='genderSelectInput'
        labelText='Gender'
        options={[
          {value: 'male', text: 'Male'},
          {value: 'female', text: 'Female'},
          {value: 'other', text: 'Other'},
        ]}
        invalidFeedbackText='Please select a gender.'
        className="col-xxl-2 col-md-6"
        defaultValue={''}
      >
        Choose gender ...
      </SelectInput>


      <SelectInput
        id='eduLevSelectInput'
        labelText='Education Level'
        options={[
          {value: 'No specified', text: 'No specified'},
          {value: 'High School', text: 'High School'},
          {value: 'Bachelor', text: 'Bachelor'},
          {value: 'Master', text: 'Master'},
          {value: 'PhD', text: 'PhD'},
        ]}
        invalidFeedbackText='Please select an education level.'
        className="col-xxl-2 col-md-6"
        defaultValue={''}
      />

      <SelectInput
        id='jobTitleSelectInput'
        labelText='Job Title'
        options={jobOptions}
        invalidFeedbackText='Please select a job title.'
        className="col-xxl-auto col-md-6"
        // defaultValue={'Data Scientist'}
      />

      <SelectInput
        id='yearESelectInput'
        labelText='Years of Experience'
        options={yearEOptions}
        invalidFeedbackText='Please select a valid number'
        className="col-xxl-auto col-md-6"
        defaultValue={''}
      />

      <TermsCheckbox 
        modalId='termsModal'
        labelText='Agree to'
        btnText='terms and conditions'
        invalidFeedbackText='You must agree before submitting.'
        c_name="col-12 col-md-8"
      />

      <div className="col-12 col-md-4 d-flex justify-content-md-end align-items-start">
        <button
          className="btn btn-primary "
          type="submit"
          id="predictSalaryBtn"
        >
          Predict Salary
        </button>
      </div>

      <button
        id='ageYearModalTrigger'
        data-bs-toggle="modal"
        data-bs-target={'#ageYearModal'}
        style={{display: 'none'}}
      />

      <AgeYearsModal
        id="ageYearModal"
      />

    </form>


  </>)
};

export default InputForm;