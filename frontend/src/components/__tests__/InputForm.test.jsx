import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import InputForm from '../InputForm';
import { vi, describe, expect, it } from 'vitest';

vi.mock('../api/dataService', () => ({
  getUniqJobTitle: vi.fn()
  .mockResolvedValue({ value: ['Data Scientist', 'Data Engineer'] }),


}));



describe("InputForm test", () => {
  const defaultProps = {
    getSubmitData: vi.fn(),
    handleInputFormSubmit: vi.fn(),
    setPredictResult: vi.fn(),
    addToast: vi.fn(),
    loadingFunc: false,
    setLoadingFunc: vi.fn(),
    setErrFunc: vi.fn(),
    dataAdded: false,
    setDataAdded: vi.fn(),
  }
  it('randers the inputforms', async () => {
    render(<InputForm {...defaultProps}/>);

    expect(screen.getByText(/Salary Prediction/)).toBeInTheDocument();
    // expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    // expect(screen.getByLabelText(/Education level/i)).toBeInTheDocument();
    // expect(screen.getByLabelText(/Job title/i)).toBeInTheDocument();
    // expect(screen.getByLabelText(/Years of experience/i)).toBeInTheDocument();
  });
});
