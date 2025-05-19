// import { useRef } from "react";

import { useEffect, useState } from "react";

const OutputSection = ({
  dataFromForm,
}) => {
  if (!dataFromForm) return ;

  return (<>
    <div>hi{dataFromForm.value}</div>
    {/* {Object.entries(dataFromForm).map(([key, val], _) => (
      <div key={key}>
        {key}: {val}
      </div>
    ))} */}
  </>)

};

export default OutputSection;