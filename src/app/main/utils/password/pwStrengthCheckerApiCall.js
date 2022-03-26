/* eslint-disable import/prefer-default-export */
import axios from 'axios';

export const postPassword = (data) => {
  const passwordApi = process.env.REACT_APP_PASSWORD_STRENGTH_CHECKER_URL;
  return new Promise((resolve, reject) => {
    axios.post(passwordApi, data).then((response) => {
      resolve(response.data);
    }).catch((error) => {
      reject(error);
    });
  });
};
