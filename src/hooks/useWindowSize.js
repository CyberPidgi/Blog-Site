import { useState, useEffect } from "react";


// custom hook
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    handleResize();
    window.addEventListener('resize', handleResize);


    // does cleanup when dependencies change
    const cleanUp = () => {
      window.removeEventListener('resize', handleResize);
    }

    return cleanUp;
  }, [])

  return windowSize;
}

export default useWindowSize
