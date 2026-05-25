import Spinner from 'react-bootstrap/Spinner';
import './loadingSpinner.css'

interface LoadingSpinnerProps {
  fullPage?: boolean; // Optional boolean flag
  className?: string; // Still allows custom overrides if needed
}

function LoadingSpinner({ fullPage = false, className = '' }: LoadingSpinnerProps) {
  let wrapperClasses = `d-flex justify-content-center align-items-center ${className}`;

  if (fullPage) {
    wrapperClasses += ' w-100';
  }

  const wrapperStyle = fullPage
    ? { paddingTop: '12vh' } // Push it down
    : {};

  return (
    <div className={wrapperClasses} style={wrapperStyle}>
      <Spinner animation="border" role="status" className="custom-spinner" />
    </div>
  );
}

export default LoadingSpinner;