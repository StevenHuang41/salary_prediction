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
  try {
    const res = await api.post(
      "/salary_avxline_plot",
      { salary },
      { responseType: "blob" },
    );

    const imgURL = URL.createObjectURL(res.data);
    return imgURL;
  } catch (err) {
    throw err;
  }
};

const fetchSalaryBoxPlot = async (salary) => {
  if (salary === '') return ;
  try {
    const res = await api.post(
      "/salary_boxplot",
      { salary },
      { responseType: "blob" },
    );

    const imgURL = URL.createObjectURL(res.data);
    return imgURL;
  } catch (err) {
    throw err;
  }
};

const retrainModel = async (data) => {
  try {
    const res = await api.post('/retrain_model', data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

const resetModel = async () => {
  try {
    const res = await api.post('/reset_model');
    return res.data;
  } catch (err) {
    throw err;
  }
};

const addData = async (data) => {
  try {
    const res = await api.post('/add_data', data);
    return res.data;
  } catch (err) {
    throw err;
  }
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