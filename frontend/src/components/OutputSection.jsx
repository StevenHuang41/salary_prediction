import { useEffect, useState } from "react";
import './OutputSection.css';
import { retrainModel, fetchSalaryBoxPlot, addData } from "../api/dataService";
import { fetchSalaryHistPlot } from "../api/dataService";
import { resetModel } from "../api/dataService";

const OutputSection = ({
  dataFromForm,
  predictData,
  setPredictResult,
  setErrFunc,
  setLoadingFunc,
  // showDetail,
  // setShowDetail,
}) => {

  const [predictSalary, setPredictSalary] = useState('');

  const [img1URL, setImg1URL] = useState('');
  const [img2URL, setImg2URL] = useState('');

  const [showDetail, setShowDetail] = useState(false);

  const [isValidInput, setIsValidInput] = useState(true);

  const [salaryInputSame, setSalaryInputSame] = useState(true);

  const [rangeValue, setRangeValue] = useState(0);

  const [numAdd, setNumAdd] = useState(0);
  
  // TODO: does not work
  // const originForm = {...dataFromForm};

  // show predict salary, updates when predictData changes
  useEffect(() => {
    if (!predictData) return ;

    // set ',' in salary string
    setPredictSalary(
      (predictData.value).toLocaleString('en-US', {
        maximumFractionDigits: 2
      })
    );
    setRangeValue(predictData.value);
  }, [predictData]);

  // TODO: does not work
  // useEffect(() => {
  //   console.log(dataFromForm);
    
  //   setSalaryInputSame(
  //     Object.keys(originForm).every(
  //       key => originForm[key] === dataFromForm[key]
  //     )
  //   );
  // }, [dataFromForm]);

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
    setSalaryInputSame(previousSalary === changeSalary);
    
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

  // handle see detail btn click
  const handleSeeDetailClick = () => {
    setShowDetail(!showDetail);
  };

  // handle retrain btn click
  const handleRetrain = async () => {
    setLoadingFunc(true);
    setErrFunc(null);

    // const newData = {
    //   ...dataFromForm,
    //   salary: +(predictSalary.replace(/,/g, "")),
    // }
    try {
      const res = await retrainModel(dataFromForm);
      setPredictResult(res.result)
      console.log(res.message);
    } catch (err) {
      setErrFunc(err.message);
    } finally {
      setLoadingFunc(false);
    }
  };


  // handle input of predict salary change
  const handlePredictChange = (e) => {
    setPredictSalary(e.target.value);
    setRangeValue((e.target.value).replace(/,/g, ""))
  };

  // handle range input of predict salary change
  const handleRangeChange = (value) => {
    setRangeValue(value);
    
    setPredictSalary(
      Number(value).toLocaleString('en-US', {
        maximumFractionDigits: 2
      })
    );
  };

  // handle return btn click
  const handleReturn = () => {
    setRangeValue(predictData.value)
    setPredictSalary(
      (predictData.value).toLocaleString('en-US', {
        maximumFractionDigits: 2
      })
    );
  };
  
  // handle reset database
  const handleReset = async() => {
    // setLoadingFunc(true);
    setErrFunc(null);
    try {
      const res = await resetModel();
      setNumAdd(1)
      // setPredictResult(res.result);
      console.log(res.message);
    } catch (err) {
      setErrFunc(err.message);
    } finally {
      // setLoadingFunc(false);
    }
  };

  // handel add data btn click
  const handleAddData = async (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    setErrFunc(null);

    const newData = {
      ...dataFromForm,
      salary: +(predictSalary.replace(/,/g, ""))
    };
    // console.log(newData);

    try {
      const res = await addData(newData);
      setNumAdd(numAdd + 1)
      console.log(res.message);
    } catch (err) {
      setErrFunc(err.message);
    } finally {
      // setLoadingFunc(false);
    }
  };
  
  return (<>

    {/* predict salary value */}
    <div
      className={`
        row
        mx-0 my-2
        d-flex
        justify-content-center
        align-items-center
      `}
    >
      <input
        id="predict-input"
        className={`
          col-12
          form-control
          fw-bold text-center w-100
        `}
        value={predictSalary}
        onChange={handlePredictChange}
      />
    </div>

    {/* salary input range */}
    {showDetail &&
    <div className="row">
      <div className="col">
        <input
          type="range"
          className="form-range"
          min={(
            predictData.value - predictData.params.mae
          ).toFixed(2)}
          max={(
            predictData.value + predictData.params.mae
          ).toFixed(2)}
          step="0.01"
          value={rangeValue}
          onChange={e => handleRangeChange(e.target.value)}
        />
      </div>
    </div>
    }

    {/* see detial row */}
    <div
      className={`
        row
        mx-0 gap-1
        d-flex
        align-items-center
      `}
    >
      {showDetail && !salaryInputSame && 
      <div className="col-auto order-2 order-md-1 px-0">
        <div
          className={`
            btn btn-outline-success
            p-2 py-1
            text-nowrap
          `}
          onClick={handleReturn}
        >
          Return Input
        </div>
      </div>
      }
      {isValidInput && !salaryInputSame && showDetail && <>
      <div className="col-auto order-2 order-md-1 px-0">
        <div
          className={`
            btn btn-outline-info
            p-2 py-1 
            text-nowrap
          `}
          onClick={handleAddData}
        >
          Add Data
        </div>
      </div>
      </>}

      {(numAdd !== 0) && showDetail &&
      <div className="col order-2 order-md-1 px-0">
        <div
          className={`
            btn btn-outline-warning
            p-2 py-1
            text-nowrap
          `}
          onClick={handleRetrain}
        >
          Retrain Model
        </div>
      </div>
      }

      <div className="col order-2 order-md-1 px-0">
      {!showDetail &&
        <div className="row">
          <div className="col-12">
            Model: {predictData.model_name}
          </div>
          <div className="col-12">
            MAE: {(predictData.params.mae).toFixed(2)}
          </div>
        </div>
      }
      </div>


      {/* btn see detail */}
      <div
        className={`
          col-12 col-md-auto
          px-0
          d-flex
          justify-content-md-end
          order-1 order-md-2
        `}
      >
        <div
          className={`
            btn
            p-2 py-1
            text-nowrap
            ${showDetail ? `btn-secondary` :
              `btn-outline-secondary`}
          `}
          onClick={handleSeeDetailClick}
        >
          see detail
        </div>
      </div>

    </div>

    {showDetail && <>
    <div className="row row-cols-1 mt-3 px-0">
      <img
        className={`
          col
          img-fluid  
        `}
        src={img1URL}
        alt="Salary Axvline Plot"/>

      <img
        className={`
          col
          img-fluid  
        `}
        src={img2URL}
        alt="Salary Box Plot"/>
    </div>
    </>}
    <div className="row">
      <div className="col d-flex justify-content-center px-0">
        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
          <ol className="carousel-indicators">
            <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
            {/* <li data-target="#carouselExampleIndicators" data-slide-to="2"></li> */}
          </ol>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img className="d-block w-50" src={img1URL} alt="First slide"/>
            </div>
            <div className="carousel-item">
              <img className="d-block w-50" src={img2URL} alt="Second slide"/>
            </div>

          </div>
          <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </div>
    </div>

    {showDetail &&
    
    <div className={`row row-cols-1 mb-3`}
    >
      <div className="col-12">
        Model Name: {predictData.model_name}<br/>
        {predictData.use_polynomial && 
          ` (use polynomial feature)`
        }
      </div>

      <div className="col-">
        Mean Absolute Error: {
          (predictData.params.mae).toFixed(2)
        }
      </div>

      <div className="col">
        Mean Square Error: {(predictData.params.mse).toFixed(2)}
      </div>

      <div className="col">
        #Train dataset: {predictData.num_train_dataset}
      </div>

      <div className="col">
        #Test dataset: {predictData.num_test_dataset}
      </div>

      <div className="col">
        <div
          className={`
            btn btn-outline-danger
            p-2 py-1
            text-nowrap
          `}
          onClick={handleReset}
        >
          Reset Database
        </div>
      </div>

    </div>
    }



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