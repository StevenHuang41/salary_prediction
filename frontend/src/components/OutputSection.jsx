import { deleteBestDir } from "../api/deleteData";
import './OutputSection.css';

const OutputSection = ({
  dataFromForm,
  predictData,
}) => {
  if (!predictData) return ;


  const handleRefresh = async () => {
    try {
      const res = await deleteBestDir();
      console.log(res);
      // then predict again
      const preBtn = document.getElementById('predictSalaryBtn');
      preBtn.click();
      
    } catch (err) {
      alert(err.message);
    }
    
  };


  return (<>

      {/* <div className="container">
        <div
          className={`
            row
            d-flex
          `}
          style={{height: "200px", fontSize: "200px"}}
        >
          <div className="col-12">
            {(predictData.value).toFixed(2)}
          </div>
        </div>
      </div> */}
      <div className="container p-0">
        <div
          className={`
            row d-flex justify-content-center
            align-items-center
          `}
        >
          <div
            id="predict-div1"
            className={`
              col-12 fw-bold text-center w-100
            `}
          >
            {(predictData.value).toFixed(2)}
          </div>
        </div>
        <div className="row">

          <div className="col-12">
            Model Name: {predictData.model_name}
          </div>
          <div className="col-12">MAE: {(predictData.mae).toFixed(2)}</div>
          <div className="col-12">MSE: {predictData.mse.toFixed(2)}</div>
          <div className="col-12">
            #Train dataset: {predictData.num_train_dataset}
          </div>
          <div className="col-12">
            #Test dataset: {predictData.num_test_dataset}
          </div>

          <div className="col">
            <button
              className="btn btn-secondary"
              onClick={handleRefresh}
            >
              refresh model
            </button>
          </div>

        </div>
      </div>

      {/* <div className="col-12"> </div> */}

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