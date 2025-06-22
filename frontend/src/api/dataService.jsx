import api from "./axiosInstance";


const getUniqJobTitle = async () => {
  try {
    const res = await api.get('/get_uniq_job_title');
    return res.data;
  } catch (err) {
    console.error("Error fetching data:", err.message);
  }
};

const predictSalary = async (formData) => {
  try {
    const res = await api.post('/predict', formData);
    return res.data;
  } catch (err) {
    console.error("Error predicting salary:", err.message);
  }
};

const fetchSalaryHistPlot = async (salary) => {
  if (salary === '') return ;

  const res = await api.post(
    "/salary_avxline_plot",
    { salary },
    { responseType: "blob" },
  );

  return URL.createObjectURL(res.data);
};

const fetchSalaryBoxPlot = async (salary) => {
  if (salary === '') return ;
  
  const res = await api.post(
    "/salary_boxplot",
    { salary },
    { responseType: "blob" },
  );

  return URL.createObjectURL(res.data);
};

const retrainModel = async (data) => {
  const res = await api.post('/retrain_model', data);
  return res.data;
};

const resetModel = async () => {
  const res = await api.post('/reset_model');
  return res.data;
};

const addData = async (data) => {
  const res = await api.post('/add_data', data);
  return res.data;
}

export {
  getUniqJobTitle,
  predictSalary,
  fetchSalaryHistPlot,
  fetchSalaryBoxPlot,
  retrainModel,
  resetModel,
  addData,
};