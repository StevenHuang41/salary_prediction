import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { vi, describe, expect, it, beforeEach } from 'vitest';
import TermsCheckbox from '../TermsCheckbox';

vi.mock('../TermsModal', () => ({
  default: ({
    id,
    handleModalPrimaryClick,
    handleModalSecondaryClick,
  }) => (
    <div data-testid="TermsModal">
      <button onClick={handleModalPrimaryClick}>Agree</button>
      <button onClick={handleModalSecondaryClick}>Disagree</button>
      <div>{id}</div>
    </div>
  )
}));

describe('TermsCheckbox', () => {
  const baseProps = {
    className: 'container-class',
    modalId: 'modal-id',
    labelText: 'label-text',
    btnText: 'button-text',
    invalidFeedbackText: 'Invalid feedback',
    setPredictResult: vi.fn(),
  };

  beforeEach(() => {
    baseProps.setPredictResult.mockClear();
  });

  it('render checkbox, text, modal button and feedback', () => {
    render(<TermsCheckbox {...baseProps} />);
    expect(document.querySelector('input#invalidCheck')).toBeInTheDocument();
    expect(screen.getByText(baseProps.labelText)).toBeInTheDocument();
    expect(screen.getByText(baseProps.btnText)).toBeInTheDocument();
    expect(screen.getByText(baseProps.invalidFeedbackText)).toBeInTheDocument();
  });

  // check checkbox clickable

  // check modal button click to pop up modal

  // check in modal click agree -> checkbox checked,
  // and vice versa

  // if click disagree, setPredictResult called

  // label is associated with checkbox

});