import { useEffect } from 'react';

/**
 * Toastr component displays a success toast notification.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.setSuccessful - Function to update the success state.
 * @param {number} props.progress - The progress value (not currently used in the component).
 * @returns {JSX.Element} The rendered Toastr component.
 */
export default function Toastr({ setSuccessful, duration = 5000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccessful(false);
        }, duration);
        
        return () => clearTimeout(timer);
    }, [setSuccessful, duration]);

    return (
        <div id="toast-success"
             data-testid="toast-success"
             className="toastr-container"
             role="alert">
            <div className="toastr-icon">
                <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                     viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
            </div>
            <div className="toastr-message">You have been registered.</div>
            <button type="button"
                    className="toastr-close-btn"
                    onClick={() => setSuccessful(false)}
                    aria-label="Close">
                <svg className="icon-close" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>
    );
}
