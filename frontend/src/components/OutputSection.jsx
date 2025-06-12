import { useEffect, useState } from "react";
import './OutputSection.css';
import { retrainModel, fetchSalaryBoxPlot } from "../api/dataService";
import { fetchSalaryHistPlot } from "../api/dataService";

const OutputSection = ({
  dataFromForm,
  predictData,
  setRetrainResult,
  setErrFunc,
  setLoadingFunc,
        // dataFromForm={formData}
        // predictData={predictResult}
        // setRetrainResult={setPredictResult}
        // setErrFunc={setErrResult}
        // setLoadingFunc={setLoadingResult}
}) => {

  const [predictSalary, setPredictSalary] = useState('');

  const [img1URL, setImg1URL] = useState('');
  const [img2URL, setImg2URL] = useState('');

  const [showDetail, setShowDetail] = useState(false);

  const [isValidInput, setIsValidInput] = useState(true);

  useEffect(() => {
    if (!predictData) return ;

    // set predict salary value
    setPredictSalary(
      (predictData.value).toLocaleString('en-US', {
        maximumFractionDigits: 2
      })
    );

    // fetch images
    const abortController = new AbortController();
    const getPlot1 = async () => {
      try {
        const url = await fetchSalaryHistPlot(predictData.value);
        setImg1URL(url);
      } catch (err) {console.log(err)};
    };
    const getPlot2 = async () => {
      try {
        const url = await fetchSalaryBoxPlot(predictData.value);
        setImg2URL(url);
      } catch (err) {console.log(err)};
    };
    getPlot1();
    getPlot2();
    return () => abortController.abort();
  }, [predictData]);

  // check if input of predict salary is a number
  const isNumber = (value) => {
    if (value === "") return false;
    const v = +(value.replace(/(\d),(\d)/g, "$1$2"))
    return /^d+$/.test(value) || !isNaN(v);
  };

  // set btn disability, if predict salary input is valid
  useEffect(() => {
    setIsValidInput(isNumber(predictSalary))
  }, [predictSalary]);

  if (!predictData) return ; //////////////////////////////////////////

  // retrain if input predict salary is valid.
  const handleRetrain = async () => {
    if (!isValidInput) return ;
    
    const newData = {
      ...dataFromForm,
      salary: +(predictSalary.replace(/,/g, "")),
    }
    // console.log(newData);

    setLoadingFunc(true);
    setErrFunc(null);

    try {

      const res = await retrainModel(newData);
      setRetrainResult(res.result)
      console.log(res.message);
      // console.log(res.result);

    } catch (err) {
      setErrFunc(err.message);
    } finally {
      setLoadingFunc(false);
    }

  };

  // handle see detail btn click
  const handleSeeDetailClick = () => {
    setShowDetail(!showDetail);
  };

  // handle input of predict salary change
  const handlePredictChange = (e) => {
    setPredictSalary(e.target.value)
  };
  
  return (<>
    <div className="row p-0 mt-1">
      <div className="col d-flex justify-content-md-end">
        <button
          className="btn btn-secondary"
          onClick={handleRetrain}
          disabled={!isValidInput}
        >
          Retrain Model
        </button>
      </div>
    </div>

    <div
      className={`
        row mx-0
        d-flex justify-content-center
        align-items-center
      `}
    >
      <input
        id="predict-input"
        // type="text"
        // pattern="\d*"
        // inputMode="numeric"
        className={`
          form-control col-12 fw-bold text-center w-100
        `}
        value={predictSalary}
        onChange={handlePredictChange}
      >
      </input>
    </div>

    <div className="row mt-2 align-items-center justify-content-between">

      <div className="col-12 col-md-auto order-2 order-md-1">
      
        <div className="row">
          <div className="col">
            Model Name: {predictData.model_name}
          </div>
        </div>

        <div className="row">
          <div className="col">
            MAE: {(predictData.params.mae).toFixed(2)}
          </div>
        </div>

      </div>

      <div
        className={`
          col-12 col-md-auto d-flex justify-content-md-end
          order-1 order-md-2
        `}
      >
        <div className="btn text-secondary p-0" onClick={handleSeeDetailClick}>
          see detail
        </div>
      </div>

    </div>

    {showDetail && <>
    <div className="row">
      <div className="col-12">
        MSE: {(predictData.params.mse).toFixed(2)}
      </div>
      <div className="col-12">
        #Train dataset: {predictData.num_train_dataset}
      </div>
      <div className="col-12">
        #Test dataset: {predictData.num_test_dataset}
        {/* {predictData.params.alpha} */}
      </div>
      {predictData.use_polynomial && 
      <div className="col-12">
        use polynomial feature
      </div>
      }
    </div>

    <div className="row">
      <div className="col d-flex justify-content-center">
        <img
          className={`
            img-fluid  
          `}
          src={img1URL}
          alt="Salary Axvline Plot"/>
      </div>
    </div>
    <div className="row">
      <div className="col d-flex justify-content-center">
        <img
          className={`
            img-fluid  
          `}
          src={img2URL}
          alt="Salary Box Plot"/>
      </div>
    </div>
    </>}
    {/* </div> */}

      {/* <div className="col-12">Age:{dataFromForm.age}</div>
      <div className="col-12">Gender:{dataFromForm.gender}</div>
      <div className="col-12">
        Education Level:{dataFromForm.education_level}
      </div>
      <div className="col-12">Job Title:{dataFromForm.job_title}</div>
      <div className="col-12">
        Years of Experience:{dataFromForm.years_of_experience}
      </div> */}

  </>)

};

export default OutputSection;