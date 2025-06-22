import { vi, describe, expect, it, beforeEach, afterEach } from 'vitest';

import api from '../axiosInstance';
import {
  getUniqJobTitle,
  predictSalary,
  fetchSalaryHistPlot,
  fetchSalaryBoxPlot,
  retrainModel,
  resetModel,
  addData,
} from '../dataService';

let logSpy;

beforeEach(() => {
  vi.resetAllMocks();
  logSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock');
});

afterEach(() => {
  vi.resetAllMocks();
})

vi.mock('../axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('getUniqJobTitle', () => {
  it('return data when success', async () => {
    api.get.mockResolvedValue({ data: { value: ['Data Scientist'] } });
    const data = await getUniqJobTitle();
    expect(api.get).toHaveBeenCalledWith('/get_uniq_job_title');
    expect(data).toStrictEqual({ value: ['Data Scientist'] });
  });

  it('console error message when api error', async () => {
    const err = new Error('test error');
    api.get.mockRejectedValue(err);
    await getUniqJobTitle();
    expect(logSpy)
    .toHaveBeenCalledWith("Error fetching data:", err.message);
  });
});

describe('predictSalary', () => {
  const formData = {
    age: 26,
    gender: 'male',
    education_level: 'master',
    job_title: 'Data Scientist',
    years_of_experience: 2,
  };

  it('return data when success', async () => {
    api.post.mockResolvedValue({ data: { value: 1234 } });
    const data = await predictSalary(formData);
    expect(api.post).toHaveBeenCalledWith('/predict', formData);
    expect(data).toEqual({ value: 1234 });
  });

  it('console error meddage when catch err', async () => {
    const err = new Error('test error');
    api.post.mockRejectedValue(err);
    await predictSalary(formData);
    expect(logSpy)
    .toHaveBeenCalledWith("Error predicting salary:", err.message);
  });
});
  
describe('fetchSalaryHistPlot', () => {
  const salary = 1234;
  const wrongSalary = '';
  const testBlob = new Blob(['test'], { type: 'hist/png' });

  it('return blob URL when success', async () => {
    api.post.mockResolvedValue({ data: testBlob });
    const url = await fetchSalaryHistPlot(salary);
    expect(api.post).toHaveBeenCalledWith(
      "/salary_avxline_plot",
      { salary },
      { responseType: "blob" },
    );
    expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(testBlob);
    expect(url).toBe('blob:mock');
  });

  it('return when receiving wrong salary', async () => {
    await fetchSalaryHistPlot(wrongSalary);
    expect(api.post).not.toHaveBeenCalled();
  });
});

describe('fetchSalaryBoxPlot', () => {
  const salary = 1234;
  const wrongSalary = '';
  const testBlob = new Blob(['test'], { type: 'box/png' });

  it('return blob URL when success', async () => {
    api.post.mockResolvedValue({ data: testBlob });
    const url = await fetchSalaryBoxPlot(salary);
    expect(api.post).toHaveBeenCalledWith(
      "/salary_boxplot",
      { salary },
      { responseType: "blob" },
    );
    expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(testBlob);
    expect(url).toBe('blob:mock');
  });

  it('return when receiving wrong salary', async () => {
    await fetchSalaryBoxPlot(wrongSalary);
    expect(api.post).not.toHaveBeenCalledWith(
      "/salary_boxplot",
      { salary },
      { responseType: "blob" },
    );
  });
});

describe('retrainModel', () => {
  const formData = {
    age: 39,
    gender: 'male',
    education_level: 'master',
    job_title: 'Data Scientist',
    years_of_experience: 5
  };

  it('return data when input valid', async () => {
    api.post.mockResolvedValue({ data: 'return data' });
    const data = await retrainModel(formData);
    expect(api.post).toHaveBeenCalledWith('/retrain_model', formData);
    expect(data).toBe('return data');
  });
});

describe('resetModel', () => {
  it('return data', async () => {
    api.post.mockResolvedValue({
      data: {
        status: 'success',
        message: 'successfully reset database',
      }
    });
    const data = await resetModel();
    expect(data).toStrictEqual({
      status: 'success',
      message: 'successfully reset database',
    });
    expect(api.post).toHaveBeenCalledWith('/reset_model');
  });
});

describe('addData', () => {
  const formData = {
    age: 39,
    gender: 'male',
    education_level: 'master',
    job_title: 'Data Scientist',
    years_of_experience: 5,
    salary: 130000,
  };

  it('return data when input valid', async () => {
    api.post.mockResolvedValue({ data: 'add data' });
    const data = await addData(formData);
    expect(data).toBe('add data');
    expect(api.post).toHaveBeenCalledWith('/add_data', formData);
  });
});