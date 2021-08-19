import { useEffect, useState } from "react";

export default function useWidth() {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth });

  function changeWindowSize() {
    setWindowSize({ width: window.innerWidth });
  }

  useEffect(() => {
    window.addEventListener("resize", changeWindowSize);
    return () => {
      window.removeEventListener("resize", changeWindowSize);
    };
  });
  return windowSize;
}
