const ErrorMessage = ({ title, message }: { title: string; message: string }) => {
  return (
    <div className="error-message">
      <div className="error-icon">
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
            stroke="#ff5a5f" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M12 8V12" 
            stroke="#ff5a5f" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <circle 
            cx="12" 
            cy="16" 
            r="1" 
            fill="#ff5a5f"
          />
        </svg>
      </div>
      <h3 className="error-title">{title}</h3>
      <p className="error-text">{message}</p>
    </div>
  );
};

export default ErrorMessage
