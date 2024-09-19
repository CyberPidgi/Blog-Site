import { useState, useEffect } from "react";
import axios from 'axios';

const useAxiosFetch = (dataURL) => {
  const [data, setData] = useState([]); 
  const [fetchError, setFetchError] = useState(false);
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // this is used to cancel a previous request we made
    // something about promises and stuff 
    const source = axios.CancelToken.source();

    const fetchData = async (url) => {
      setIsLoading(true);
      try {
        const response = await axios.get(url, {
          cancelToken: source.token
        });

        if (isMounted){
          setData(response.data);
          setFetchError(null);
        }
      } catch (err) {
        if (isMounted){
          setFetchError(err);
          setData([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData(dataURL);

    const cleanUp = () => {
      isMounted = false;
      source.cancel();
    }

    return cleanUp;
  }, [dataURL]);

  return { data, fetchError, isLoading }
}

export default useAxiosFetch;