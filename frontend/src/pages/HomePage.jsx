import { useEffect, useState } from 'react';
import { predictSalary } from '../api/dataService';
import InputForm from '../components/InputForm';
import OutputSection from '../components/OutputSection';
import ErrorPredict from '../components/ErrorPredict';
import LoadingResult from '../components/LoadingResult';

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
      console.log(dataFromForm);
      const data = await predictSalary(dataFromForm);
      console.log(data);
      
      setPredictResult(data);
    } catch (err) {
      setErrResult(err.message);
    } finally {
      setLoadingResult(false)
    }
  };

  useEffect(() => {
    // console.log(predictResult);
  }, [predictResult]);

  return (<>
    <div className="container">
      <InputForm
        getSubmitData={handleGetFormData}
        setPredictResult={setPredictResult}
      />

      {errResult ? 
      <ErrorPredict data={errResult}/>
      :
      loadingResult ?
      <div className="loading-container">
        <LoadingResult
          loadingText="Loading ..."
          setStyle={{fontSize: "5em"}}
          setClass="mt-5 mt-sm-3"
          setTextClass="d-none d-sm-flex"
        />
      </div>
      :
      predictResult &&
      <OutputSection
        dataFromForm={formData}
        predictData={predictResult}
        setPredictResult={setPredictResult}
        setErrFunc={setErrResult}
        setLoadingFunc={setLoadingResult}
      />}
    </div>
  </>)
};


// TODO: useQuery to get option from database, instead of hard code




export default HomePage;
