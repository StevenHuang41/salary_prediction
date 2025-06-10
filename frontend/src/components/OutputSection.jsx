import { useEffect, useState } from "react";
import './OutputSection.css';
import { deleteBestDir, fetchSalaryBoxPlot } from "../api/dataService";
import { fetchSalaryHistPlot } from "../api/dataService";

const OutputSection = ({
  dataFromForm,
  predictData,
  setErrFunc,
}) => {

  const [img1URL, setImg1URL] = useState('');
  const [img2URL, setImg2URL] = useState('');

  useEffect(() => {
    if (!predictData) return ;

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

  const [showDetail, setShowDetail] = useState(false);

  if (!predictData) return ;

  const handleRetrain = async () => {
    try {
      const res = await deleteBestDir();
      console.log(res);

      // then predict again
      const preBtn = document.getElementById('predictSalaryBtn');
      preBtn.click();
      
    } catch (err) {
      setErrFunc(err.message);
    } 
  };

  const handleSeeDetailClick = () => {
    setShowDetail(!showDetail);
  };
  
  
  return (<>
    <div className="row p-0 mt-1">
      <div className="col d-flex justify-content-md-end">
        <button
          className="btn btn-secondary"
          onClick={handleRetrain}
        >
          Retrain Model
        </button>
      </div>
    </div>

    <div
      className={`
        row
        d-flex justify-content-center
        align-items-center
      `}
    >
      <div
        id="predict-div1"
        className={`
          col-12 fw-bold text-center w-100
        `}
      >
        {(predictData.value).toLocaleString('en-US', {
          maximumFractionDigits: 2
        })}
      </div>
    </div>

    <div className="row align-items-center justify-content-between">
      <div className="col-auto">
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

      <div className="col-auto d-flex justify-content-end">
        <div className="btn text-secondary" onClick={handleSeeDetailClick}>
          see detail
        </div>
      </div>
      {showDetail && 
      <>
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
    </div>

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