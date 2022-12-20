import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const useAxios = (url, method, payload) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [errorAnimationTimer, setErrorAnimationTimer] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const controllerRef = useRef(new AbortController());
  const cancel = () => {
    controllerRef.current.abort();
  };

  useEffect(() => {
    let timeout;
    (async () => {
      setLoaded(false);
      try {
        const response = await axios.request({
          data: payload,
          signal: controllerRef.current.signal,
          method,
          url,
        });
        setData(response.data);
      } catch (error) {
        let id = uuidv4();
        let er = { ...error, id };
        setErrorAnimationTimer(true);
        timeout = setTimeout(() => {
          setErrorAnimationTimer(false);
        }, 1400);
        setError(er);
      } finally {
        //mock response delay
        timeout = setTimeout(() => {
          setLoaded(true);
        }, 100);
      }
    })();
    return () => clearTimeout(timeout);
  }, [method, payload, url]);
  return { cancel, data, error, loaded, errorAnimationTimer };
};

export { useAxios };
