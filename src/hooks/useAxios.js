import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const useAxios = (url, method, payload) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const controllerRef = useRef(new AbortController());
  const cancel = () => {
    controllerRef.current.abort();
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.request({
          data: payload,
          signal: controllerRef.current.signal,
          method,
          url,
        });
        console.log("USE AXIOS", response.data)
        setError("")
        setData(response.data);
      } catch (error) {
        setError(error.message);
        console.log("USE AXIOS ERROR", error.request.statusText)
      } finally {
        setLoaded(true);
      }
    })();
  }, [method, payload, url]);
  return { cancel, data, error, loaded };
};

export {useAxios}