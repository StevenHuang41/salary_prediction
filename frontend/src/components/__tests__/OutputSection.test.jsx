import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi, describe, expect, it, beforeEach, afterEach } from 'vitest';
import OutputSection from '../OutputSection';
// import {
//   fetchSalaryBoxPlot,
//   fetchSalaryHistPlot,
//   resetModel
// } from '../../api/dataService';

vi.mock('../../api/dataService', () => ({
  fetchSalaryHistPlot: vi.fn(),
  fetchSalaryBoxPlot: vi.fn(),
  resetModel: vi.fn(),
  addData: vi.fn(),
}));

const baseProps = {
  dataFromForm: {
    age: 27,
    gender: 'male',
    education_level: 'master',
    job_title: 'Data Scientist',
    years_of_experience: 2,
  },
  predictData: {
    value: 120000,
    model_name: 'randomForest',
    use_polynomial: true,
    params: {
      mae: 3000,
      mse: 8000000,
    },
    num_train_dataset: 4000,
    num_test_dataset: 1000
  },
  setErrFunc: vi.fn(),
  addToast: vi.fn(),
  showDetail: false,
  setShowDetail: vi.fn(),
  setDataAdded: vi.fn(),
};

it('pass', () => {
  render(<OutputSection {...baseProps} />);
  expect(screen.getByRole('textbox')).toBeInTheDocument();
});