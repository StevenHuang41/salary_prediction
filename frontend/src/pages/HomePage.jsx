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

  const [toasts, setToasts] = useState([]);

  const [showDetail, setShowDetail] = useState(false);

  const [dataAdded, setDataAdded] = useState(false);

  const handleInputFormSubmit = async (e) => {
    setLoadingResult(true);
    setErrResult(null);

    try {
      // console.log(formData);
      const res = await predictSalary(formData);
      // console.log(res);
      setPredictResult(res);
    } catch (err) {
      setErrResult(err.message);
    } finally {
      setLoadingResult(false)
    }
  };

  useEffect(() => {
  //   console.log(predictResult);
  }, [predictResult]);

  const addToast = (message, color) => {
    const id = Date.now() + Math.random();
      // set toast to show model
      setToasts(prev => [
        ...prev,
        {id, message, showing: true, color}
      ]);

      setTimeout(() => {
        // set toast to hide mode, after 3000ms
        setToasts(prev => 
          prev.map(toast => 
            toast.id === id ? { ...toast, showing: false } : toast
          )
        );

        // delete toast from toasts, after 500ms
        setTimeout(() => {
          setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 500);
      }, 3000);
  };

  return (<>
    <div className="container">
      <InputForm
        getSubmitData={setFormData}
        handleInputFormSubmit={handleInputFormSubmit}
        setPredictResult={setPredictResult}
        showDetail={showDetail}
        addToast={addToast}
        loadingFunc={loadingResult}
        setLoadingFunc={setLoadingResult}
        setErrFunc={setErrResult}
        dataAdded={dataAdded}
        setDataAdded={setDataAdded}
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
        // setPredictResult={setPredictResult}
        setErrFunc={setErrResult}
        // setLoadingFunc={setLoadingResult}
        addToast={addToast}
        showDetail={showDetail}
        setShowDetail={setShowDetail}
        setDataAdded={setDataAdded}
      />}

      {/* toasts */}
      <div
        className={`
          toast-container position-fixed top-0 end-0 p-3
        `}
        style={{ zIndex: 9999 }}
      >
        {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            toast fade
            ${toast.showing ? 'slide-in' : 'slide-out'}
            text-bg-${toast.color}
            d-flex
            align-items-center
            border-0
          `}
          role="alert"
          aria-live="assertive"
          aria-atomic='true'
        >
          <div className="toast-body">
            {toast.message}
          </div>
          <button
            className="btn-close btn-close-white m-auto me-2"
            type="button"
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          ></button>
        </div>
        ))}
      </div>
    </div>
  </>)
};


// TODO: backend add a svm regressor
// TODO: make frontend test
// TODO: learn to use docker
// TODO: make github profolio
// TODO: make linkdin profolio

// TODO: show every select inputs analytical graph
// TODO: make code prettier



export default HomePage;
