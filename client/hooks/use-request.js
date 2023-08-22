import { useState } from "react";
import axios from "axios";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState([]);

  const doRequest = async (props = {}) => {
    try {
      setErrors([]);
      const response = await axios[method](url, { ...body, ...props });
      setData(response.data);
      onSuccess(response.data);
    } catch (err) {
      console.error(err);
      setErrors(err.response.data.errors);
    }
  };

  return { doRequest, data, errors };
};

export default useRequest;
