import './HomePage.css';
import InputForm from '../components/InputForm';
import OutputSection from '../components/OutputSection';
import { useState } from 'react';
import { predictSalary } from '../api/fetchData';

const HomePage = () => {
  const [formData, setFormData] = useState(null);
  const [predictResult, setPredictResult] = useState(null);
  const [loadingResult, setLoadingResult] = useState(false);
  const [errResult, setErrResult] = useState(null);

  const handleGetFormData = async (dataFromForm) => {
    setFormData(dataFromForm);
    setLoadingResult(true);
    setErrResult(null);

    try {
      const data = await predictSalary(dataFromForm);
      setPredictResult(data);
    } catch (err) {
      setErrResult(err.message);
    } finally {
      setLoadingResult(false)
    }

  };

  return (<>
    <div className="container">
      <div className="row">
        <div className="col">
          <InputForm getSubmitData={handleGetFormData}/>
          {errResult && <div className="text-danger">{errResult}</div>}
          {loadingResult ?
            <div>Loading ...</div> :
            <OutputSection
              dataFromForm={formData}
              predictData={predictResult}
            />}
        </div>
      </div>
    </div>
  </>)
};


// TODO: useQuery to get option from database, instead of hard code
// TODO: understand how to use className of bootstrap

// TODO: get prediction from backend



export default HomePage;
