import './HomePage.css';
import React, { useEffect, useRef, useState } from 'react';
import TermsCheckbox from '../components/TermsCheckbox';
import SelectInput from '../components/SelectInput';
import { fetchData, getUniqJobTitle } from '../api/fetchData';
import AgeYearsModal from '../components/AgeYearsModal';


const HomePage = () => {

  const formRef = useRef(null);

  const [dataInput, setDataInput] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const forms = formRef.current;
    const form_elements = formRef.current.elements;
    
    forms.classList.add('was-validated');
    
    if (!forms.checkValidity()) return;
    
    const ageYearModalTrigger = document.getElementById('ageYearModalTrigger');
    if ((form_elements.ageSelectInput.value - 
      form_elements.yearESelectInput.value) < 18) {
        form_elements.ageSelectInput.value = '';
        form_elements.yearESelectInput.value = '';
        ageYearModalTrigger.click()
      } else {
      const form_elements = formRef.current.elements;
      setDataInput(prev => ({
        ...prev,
        age: form_elements['ageSelectInput'].value,
        gender: form_elements['genderSelectInput'].value,
        education_level: form_elements['eduLevSelectInput'].value,
        job_title: form_elements['jobTitleSelectInput'].value,
        years_of_experience: form_elements['yearESelectInput'].value,
      }))
    }
  };

  useEffect(() => {
    console.log(dataInput)
  }, [dataInput])

  const ageOptions = Array.from({ length: 71 }, (_, i) => (
    {value: i + 18, text: i + 18}
  ));

  const yearEOptions = Array.from({ length: 71 }, (_, i) => (
    {value: i, text: i}
  ));


  // get job title options
  const [jobOptions, setJobOptions] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getUniqJobTitle();
        const options = data.value.map((val) => (
          {value: val, text: val}
        ));
        // console.log(options);
        setJobOptions(options);
      } catch (err) {console.log(err);}
    };
    getData();
  }, []);



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

          {/* <JobSelectInput /> */}
          <SelectInput
            id='jobTitleSelectInput'
            labelText='Job Title'
            options={jobOptions}
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
            modalId='termsModal'
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
          <button
            id='ageYearModalTrigger'
            data-bs-toggle="modal"
            data-bs-target={'#ageYearModal'}
            style={{display: 'none'}}
          />
          <AgeYearsModal
          // should close modal
            handlePrimaryClick={() => {}}
          />

        </form>

      </div>
    </>
  )
};

// TODO: useQuery to get option from database, instead of hard code
// TODO: understand how to use className of bootstrap
// TODO: test (age substract year of experience >= 18)
// TODO: modal show in center of view
// TODO: separate Homepage and Form


export default HomePage;
