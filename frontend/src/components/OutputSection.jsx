import { useEffect, useState } from "react";
import './OutputSection.css';
import { retrainModel, fetchSalaryBoxPlot } from "../api/dataService";
import { fetchSalaryHistPlot } from "../api/dataService";
import { resetModel } from "../api/dataService";

const OutputSection = ({
  dataFromForm,
  predictData,
  setPredictResult,
  setErrFunc,
  setLoadingFunc,
}) => {

  const [predictSalary, setPredictSalary] = useState('');

  const [img1URL, setImg1URL] = useState('');
  const [img2URL, setImg2URL] = useState('');

  const [showDetail, setShowDetail] = useState(false);

  const [isValidInput, setIsValidInput] = useState(true);

  // show predict salary, updates when predictData changes
  useEffect(() => {
    if (!predictData) return ;

    // set ',' in salary string
    setPredictSalary(
      (predictData.value).toLocaleString('en-US', {
        maximumFractionDigits: 2
      })
    );

  }, [predictData]);

  // check if value is a valid number
  const isNumber = (value) => {
    if (value === "") return false;
    const v = +(value.replace(/,(\d)(\d)(\d)/g, "$1$2$3"))
    return /^d+$/.test(value) || !isNaN(v);
  };

  // updates when predictSalary changes
  useEffect(() => {
    // set retrain btn disability: if predictSalary is valid
    const valid = isNumber(predictSalary);
    const previousSalary = predictData.value.toFixed(2);
    const changeSalary = (+(predictSalary.replace(/,/g, ""))).toFixed(2);
    
    // Input is valid when it is a number and previous != changed value
    setIsValidInput(valid && (previousSalary !== changeSalary));
    
    // if input is valid, fetch plots
    if (!valid) return ;

    const numSalary = +(predictSalary.replace(/,/g, ""));

    const timeout = setTimeout(() => {
      // fetch images
      const abortController = new AbortController();
      const getPlot1 = async () => {
        try {
          const url = await fetchSalaryHistPlot(numSalary);
          setImg1URL(url);
        } catch (err) {console.log(err)};
      };
      const getPlot2 = async () => {
        try {
          const url = await fetchSalaryBoxPlot(numSalary);
          setImg2URL(url);
        } catch (err) {console.log(err)};
      };
      getPlot1();
      getPlot2();
      return () => abortController.abort();

    }, 100);
    return () => clearTimeout(timeout);
  }, [predictSalary]);

  if (!predictData) return ; //////////////////////////////////////////

  // handle retrain btn click
  const handleRetrain = async () => {
    setLoadingFunc(true);
    setErrFunc(null);

    const newData = {
      ...dataFromForm,
      salary: +(predictSalary.replace(/,/g, "")),
    }

    try {
      const res = await retrainModel(newData);
      setPredictResult(res.result)
      console.log(res.message);
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
    setPredictSalary(e.target.value);
  };

  // handle range input of predict salary change
  const handleRangeChange = (e) => {
    setPredictSalary(
      Number(e.target.value).toLocaleString('en-US', {
        maximumFractionDigits: 2
      })
    );
  };
  
  // handle reset database
  const handleReset = async() => {
    setLoadingFunc(true);
    setErrFunc(null);
    try {
      const res = await resetModel(dataFromForm);
      setPredictResult(res.re)

    }
    console.log(dataFromForm);
    
// TODO: finish this part
    
  };
  
  // TODO: a btn that can reload model with original dataset
  return (<>

    <div
      className={`
        row mx-0 mt-2
        d-flex justify-content-center
        align-items-center
      `}
    >
      <input
        id="predict-input"
        className={`
          form-control col-12 fw-bold text-center w-100
        `}
        value={predictSalary}
        onChange={handlePredictChange}
      >
      </input>
    </div>

    {showDetail &&
    <div className="row">
      <div className="col my-2">
        <input
          type="range"
          className="form-range"
          min={(predictData.value - predictData.params.mae).toFixed(2)}
          max={(predictData.value + predictData.params.mae).toFixed(2)}
          step="0.01"
          onChange={handleRangeChange}
        />
      </div>
    </div>
    }


    <div className="row mt-0 align-items-center justify-content-between">

      <div className="col-12 col-md-auto order-2 order-md-1">
      
        <div className="row">
          <div className="col">
            Model {showDetail && `Name`}: {predictData.model_name}
          </div>
        </div>

        <div className="row">
          <div className="col">
            {showDetail ? `Mean Absolute Error` : `MAE`}
            : {(predictData.params.mae).toFixed(2)}
          </div>
        </div>

      </div>

      <div
        className={`
          col-12 col-md-auto
          d-flex justify-content-md-end
          align_items-center
          order-1 order-md-2
        `}
      >

        <div className="row p-0">

          <div className="col d-flex justify-content-md-end gap-2">
          {showDetail && <>
            <div
              className="btn btn-outline-danger"
              onClick={handleReset}
            >
              Reset Database
            </div>

            <div
              className={`
                btn btn-warning 
                ${!isValidInput && 'disabled'}
              `}
              onClick={handleRetrain}
            >
              Retrain Model
            </div>
          </> }
            <div
              className={`
                btn 
                ${showDetail ? `btn-secondary` : `text-secondary`}
              `}
              onClick={handleSeeDetailClick}
            >
              see detail
            </div>
          </div>
        </div>

      </div>
    </div>

    {showDetail && <>
    <div className="row collapse-show" id="detail-part">
      <div className="col-12">
        Mean Square Error: {(predictData.params.mse).toFixed(2)}
      </div>
      <div className="col-12">
        #Train dataset: {predictData.num_train_dataset}
      </div>
      <div className="col-12">
        #Test dataset: {predictData.num_test_dataset}
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