import { useEffect, useRef, useState } from "react";
import { getUniqJobTitle } from "../api/dataService";
import SelectInput from "./SelectInput";
import TermsCheckbox from "./TermsCheckbox";
import AgeYearsModal from "./AgeYearsModal";

const InputForm = ({ getSubmitData, setPredictResult }) => {
  const formRef = useRef(null);

  const [yearValid, setYearValid] = useState(true);
  // const [age, setAge] = useState('');
  // const [gender, setGender] = useState('');
  // const [educationLevel, setEducationLevel] = useState('');
  // const [jobTitle, setJobTitle] = useState('');
  // const [yearE, setYearE] = useState('');
  const [age, setAge] = useState('26');
  const [gender, setGender] = useState('female');
  const [educationLevel, setEducationLevel] = useState('Master');
  const [jobTitle, setJobTitle] = useState('Data Scientist');
  const [yearE, setYearE] = useState('8');
  const [jobOptionsLoading, setJobOptionsLoading] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const forms = formRef.current;
    forms.classList.add('was-validated');
    
    // check form has select value
    if (!forms.checkValidity()) {
      setPredictResult(false);
      return;
    }
    
    const ageYearModalTrigger = 
      document.getElementById('ageYearModalTrigger');

    // check age - year is not lower than 18
    if ((age - yearE) < 18) {
      setYearE('');
      ageYearModalTrigger.click();
      setYearValid(false);
      setPredictResult(false);
      return 
    }

    // set data
    const data = {
      age: age,
      gender: gender,
      education_level: educationLevel,
      job_title: jobTitle,
      years_of_experience: yearE,
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
        setJobOptionsLoading(false);
      } catch (err) {console.log(err);}
    };
    getData();
    return () => abortController.abort()
  }, []);


  return (<>
    <div className="row">
      <div className="col">
        <div className="text-primary fs-1">
          Salary Prediction
        </div>
      </div>
    </div>

    <form
      id="InputForm"
      className={`needs-validation`}
      noValidate
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <div className={`row row-cols-1 row-cols-md-2 row-cols-l g-2`} >

        <SelectInput
          className="col col-xl-2"
          selectId='ageSelectInput'
          options={ageOptions}
          invalidFeedbackText='Please select a valid age.'
          // defaultValue=''
          value={age}
          onChange={e => setAge(e.target.value)}
          isLoadingOptions={false}
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
          // defaultValue=''
          value={gender}
          onChange={e => setGender(e.target.value)}
          isLoadingOptions={false}
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
          // defaultValue=''
          value={educationLevel}
          onChange={e => setEducationLevel(e.target.value)}
          isLoadingOptions={false}
        >
          Education level
        </SelectInput>

        <SelectInput
          selectId='jobTitleSelectInput'
          options={jobOptions}
          invalidFeedbackText='Please select a job title.'
          className="col col-xl-3"
          // defaultValue=''
          value={jobTitle}
          onChange={e => setJobTitle(e.target.value)}
          isLoadingOptions={jobOptionsLoading}
        >
          Job title
        </SelectInput>

        <SelectInput
          selectId='yearESelectInput'
          options={yearEOptions}
          invalidFeedbackText={
            yearValid ? 'Please select a valid number.' :
            `The years of experience should not exceed ${age - 18}.`
          }
          className="col col-xl-2"
          // defaultValue=''
          value={yearE}
          onChange={e => setYearE(e.target.value)}
          isLoadingOptions={false}
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