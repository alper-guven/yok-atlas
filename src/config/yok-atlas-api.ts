import axios from 'axios';

export const YokAtlasAPI = axios.create({
  baseURL: 'https://yokatlas.yok.gov.tr',
  timeout: 10000,
});
