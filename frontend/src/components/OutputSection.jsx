// import { useRef } from "react";

// import { useEffect, useState } from "react";

const OutputSection = ({
  dataFromForm,
  predictData,
}) => {
  if (!predictData) return ;

  return (<>
    <div className="row">
      <div className="col-12">Age:{dataFromForm.age}</div>
      <div className="col-12">Gender:{dataFromForm.gender}</div>
      <div className="col-12">
        Education Level:{dataFromForm.education_level}
      </div>
      <div className="col-12">Job Title:{dataFromForm.job_title}</div>
      <div className="col-12">
        Years of Experience:{dataFromForm.years_of_experience}
      </div>
      <div className="col-12">
        Predict:{predictData.value}
      </div>
      <div className="col-12">Model Name: {predictData.model_name}</div>
      <div className="col-12">MAE: {predictData.mae}</div>
      <div className="col-12">MSE: {predictData.mse}</div>
      <div className="col-12">#Train dataset: {predictData.num_train_dataset}</div>
      <div className="col-12">#Test dataset: {predictData.num_test_dataset}</div>
    </div>
  </>)

};

export default OutputSection;