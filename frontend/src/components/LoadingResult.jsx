
const LoadingResult = () => {
  return (<>
    <div
      className={`
        d-flex
        justify-content-center
        align-items-center
      `}
      style={{height: "20vh"}}
    >
      <div
        className={`
          spinner-border
          text-secondary
          predict-loading
          spinner-css
        `}
        style={{width: "1em", height: "1em"}}
        role='status'
      ></div>
      <span className="sr-only predict-loading">Loading ...</span>
    </div>
  </>)
};

export default LoadingResult;
