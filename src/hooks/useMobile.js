import React from "react";

const useMobile = () => {
  let [windowSize, setWindowSize] = React.useState(getSize());
  const getMobile = React.useCallback(() => {
    return windowSize.innerWidth <= 768;
  }, [windowSize]);
  const [isMobile, setMobile] = React.useState(getMobile());
  function getSize() {
    return {
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      outerHeight: window.outerHeight,
      outerWidth: window.outerWidth
    };
  }
  function handleResize() {
    setWindowSize(getSize());
  }
  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);
  React.useEffect(() => setMobile(getMobile()), [windowSize, getMobile]);
  return isMobile;
};
export default useMobile;
