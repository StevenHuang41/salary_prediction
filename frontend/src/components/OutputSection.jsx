import { useEffect, useState } from "react";
import { deleteBestDir } from "../api/deleteData";
import './OutputSection.css';
import { fetchSalaryPlot } from "../api/fetchData";

const OutputSection = ({
  dataFromForm,
  predictData,
  setErrFunc,
}) => {


  const [imgURL, setImgURL] = useState('');

  useEffect(() => {
    const abortController = new AbortController();
    const getPlot = async () => {
      try {
        const url = await fetchSalaryPlot(predictData.value);
        setImgURL(url);
      } catch (err) {console.log(err);
      }
    };
    getPlot();
    return () => abortController.abort();
  }, [predictData]);

  const [showDetail, setShowDetail] = useState(false);

  if (!predictData) return ;

  //   const [jobOptions, setJobOptions] = useState([]);
  // useEffect(() => {
  //   const abortController = new AbortController();
  //   const getData = async () => {
  //     try {
  //       const data = await getUniqJobTitle();
  //       const options = data.value.map((val) => (
  //         {value: val, text: val}
  //       ));
  //       setJobOptions(options);
  //     } catch (err) {console.log(err);}
  //   };
  //   getData();
  //   return () => abortController.abort()
  // }, []);Vk
  

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
      <div className="col d-flex justify-content-end">
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

    <div className="row">
      <div className="col d-flex justify-content-end">
        <div className="btn text-secondary" onClick={handleSeeDetailClick}>
          see detail
        </div>
      </div>
      {showDetail && 
      <>
        <div className="row">
          <div className="col-12">
            Model Name: {predictData.model_name}
          </div>
          <div className="col-12">
            MAE: {(predictData.params.mae).toFixed(2)}
          </div>
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
          <div className="col">
            <img
              className={`
                img-fluid  
              `}
              src={imgURL}
              alt="Salary Axvline Plot"/>
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