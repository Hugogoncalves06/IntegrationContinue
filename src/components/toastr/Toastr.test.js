import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Toastr from './Toastr';

describe('Toastr Component', () => {
  const mockSetSuccessful = jest.fn();
  
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders success message', () => {
    render(<Toastr setSuccessful={mockSetSuccessful} />);
    expect(screen.getByTestId('toast-success')).toBeInTheDocument();
  });


  it('can be closed manually', () => {
    render(<Toastr setSuccessful={mockSetSuccessful} />);
    const closeButton = screen.getByTestId('toast-close-btn');
    
    fireEvent.click(closeButton);
    expect(mockSetSuccessful).toHaveBeenCalledWith(false);
  });

  it('clears timeout on unmount', () => {
    const { unmount } = render(<Toastr setSuccessful={mockSetSuccessful} />);
    
    unmount();
    
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(mockSetSuccessful).not.toHaveBeenCalled();
  });
});