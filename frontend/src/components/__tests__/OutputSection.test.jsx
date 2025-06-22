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

vi.mock('../MyCarousel', () => ({
  default: () => (
    <div data-testid="MyCarousel">
      <img alt='carouselImg1' />
      <img alt='carouselImg2' />
    </div>
  )
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
    model_name: 'randomForestRegressor',
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

beforeEach(() => {
  vi.clearAllMocks();
});

describe('OutputSection', () => {
  it('render output components when see detail is false', async () => {
    render(<OutputSection {...baseProps} />);
    expect(document.querySelector('input#predict-input')).toBeInTheDocument();
    expect(screen.getByText(/Model/)).toBeInTheDocument();
    expect(screen.getByText(/MAE/)).toBeInTheDocument();

    const seeDetailBtn = screen.getByText('see detail');
    expect(seeDetailBtn).toBeInTheDocument();
    expect(seeDetailBtn).toHaveClass('btn-outline-secondary');

    expect(await screen.findByTestId('MyCarousel')).toBeInTheDocument();
    expect(await screen.findByAltText('carouselImg1')).toBeInTheDocument();
    expect(await screen.findByAltText('carouselImg2')).toBeInTheDocument();

    // should not show when see detail is false
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    expect(seeDetailBtn).not.toHaveClass('btn-secondary');
    expect(screen.queryByText(/Model Name/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mean Absolute Error/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mean Square Error/)).not.toBeInTheDocument();
    expect(screen.queryByText(/#Train dataset/)).not.toBeInTheDocument();
    expect(screen.queryByText(/#Test dataset/)).not.toBeInTheDocument();
    expect(screen.queryByText('Reset Database')).not.toBeInTheDocument();
    expect(screen.queryByAltText('Salary Histogram Plot')).not.toBeInTheDocument();
    expect(screen.queryByAltText('Salary Box Plot')).not.toBeInTheDocument();
  });

  it('render output components when see detail is true', async () => {
    render(<OutputSection {...baseProps} showDetail={true} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();

    const seeDetailBtn = screen.getByText('see detail');
    expect(seeDetailBtn).toBeInTheDocument();
    expect(seeDetailBtn).toHaveClass('btn-secondary');

    expect(screen.getByText(/Model Name/)).toBeInTheDocument();
    expect(screen.getByText(/Mean Absolute Error/)).toBeInTheDocument();
    expect(screen.getByText(/Mean Square Error/)).toBeInTheDocument();
    expect(screen.getByText(/#Train dataset/)).toBeInTheDocument();
    expect(screen.getByText(/#Test dataset/)).toBeInTheDocument();
    expect(screen.getByText('Reset Database')).toBeInTheDocument();
    expect(await screen.findByAltText('Salary Histogram Plot')).toBeInTheDocument();
    expect(await screen.findByAltText('Salary Box Plot')).toBeInTheDocument();
  });
  // it('return if predictData is null', () => {
  //   render(<OutputSection {...baseProps} predictData={null} />);
  
  // });
});