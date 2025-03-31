export default function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle 
          cx="20" 
          cy="20" 
          r="18" 
          fill="none" 
          strokeWidth="4" 
          stroke="#ff5a5f" 
          strokeDasharray="60 30" 
          strokeLinecap="round"
        >
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            from="0 20 20" 
            to="360 20 20" 
            dur="1s" 
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}