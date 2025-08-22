import axios from 'axios';

export default (baseUrl) => {
  return axios.create({
    baseURL: baseUrl,
  });
};
