import './HomePage.css';
import React, { useRef } from 'react';
import TermsCheckbox from '../components/TermsCheckbox';
import SelectInput from '../components/SelectInput';


const HomePage = () => {

  const formRef = useRef(null);

  const handleSubmit = (e) => {
    const forms = formRef.current;
    if (!forms.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    }
    forms.classList.add('was-validated');

    console.log(forms)
    console.log(forms.elements['genderSelectInput'])
  };

  const ageOptions = Array.from({ length: 71 }, (_, i) => (
    {value: i + 18, text: i + 18}
  ));

  const yearEOptions = Array.from({ length: 71 }, (_, i) => (
    {value: i, text: i}
  ));

  return (
    <>
      <div className='m-3' id='body'>

        <div>Salary Prediction</div>

        <form
          className='row g-3 needs-validation'
          noValidate
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <SelectInput
            id='ageSelectInput'
            labelText='Age'
            options={ageOptions}
            invalidFeedbackText='Please select a valid age.'
            c_name={'col-auto'}
          />

          <SelectInput
            id='genderSelectInput'
            labelText='Gender'
            options={[
              {value: 'male', text: 'Male'},
              {value: 'female', text: 'Female'},
              {value: 'other', text: 'Other'},
            ]}
            invalidFeedbackText='Please select a gender.'
            c_name={'col-auto'}
          />

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
            c_name={'col-auto'}
          />

          <SelectInput
            id='jobTitleSelectInput'
            labelText='Job Title'
            options={[
              {value: 'Data Scientist', text: 'Data Scientist'},
              {value: 'Data Engineer', text: 'Data Engineer'},
              {value: 'Data Analyst', text: 'Data Analyst'},
              {value: 'Software Engineer', text: 'Software Engineer'},
              {value: 'Sales Manager', text: 'Sales Manager'},
            ]}
            invalidFeedbackText='Please select a job title.'
            c_name={'col-auto'}
          />

          <SelectInput
            id='yearESelectInput'
            labelText='Years of Experience'
            options={yearEOptions}
            invalidFeedbackText='Please select a valid number'
            c_name={'col-auto'}
          />

          <TermsCheckbox 
            modalId='exampleModal'
            labelText='Agree to'
            btnText='terms and conditions'
            invalidFeedbackText='You must agree before submitting.'
          />

          <div className="col2">
            <button
              className="btn btn-primary"
              type="submit"
            >
              Submit form
            </button>
          </div>

        </form>

      </div>
    </>
  )
};

// TODO: get option from database, instead of hard code
// TODO: test (age substract year of experience >= 18)
// TODO: get the submit value
// TODO: 
// TODO: 


export default HomePage;
