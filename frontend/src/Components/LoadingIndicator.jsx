// LoadingIndicator.js
const LoadingIndicator = () => {
    return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-spin rounded-full h-30 w-30 border-t-4 border-purple-500">
            {/* Placeholder for spinner */}
          </div>
        </div>
      </div>
    );
  };
  
  export default LoadingIndicator;
  