// import "./LoadingResult.css"

const LoadingResult = ({ loadingText, setStyle={}, ...props}) => {
  return (<>
    <div
      className={`
        d-flex justify-content-center align-items-center
        ${props.setClass}
      `}
      style={{color: "#A9A9A9", ...setStyle}}
    >
      <div
        id="loading-spinner"
        className={`spinner-border`}
        style={{
          height: "0.6em",
          width: "0.6em",
          borderWidth: "3px",
        }}
        role='status'
      ></div>

      <div id="loading-text" className={props.setTextClass}>
        {loadingText}
      </div>

    </div>
  </>)
};

export default LoadingResult;
