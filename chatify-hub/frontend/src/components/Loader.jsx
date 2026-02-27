
const Loader = () => {
  return (
    <div className="loading-container flex items-center justify-center min-h-screen max-w-full">
      <ThreeDots
        height="80"
        width="80"
        color="#ffffff"
        ariaLabel="tail-spin-loading"
      />
    </div>
  );
};

export default Loader;
