import './HomePage.css';
import InputForm from '../components/InputForm';
import OutputSection from '../components/OutputSection';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    console.log(predictResult);
  }, [predictResult]);

  return (<>
    <div className="container">
      <div className="row">
        <div className="col">

          <InputForm getSubmitData={handleGetFormData}/>

          {errResult ? 
          <div className="text-danger">{errResult}</div>
          :
          loadingResult ?
          <div
            className={`
              d-flex
              justify-content-center
              align-items-center
            `}
            style={{height: "30vh"}}
          >
            <div
              className={`
                spinner-border
                text-secondary
                predict-loading
                spinner-css
              `}
              style={{width: "1em", height: "1em"}}
              role='status'
            ></div>
            <span className="sr-only predict-loading">Loading ...</span>
          </div>
          :
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




export default HomePage;
