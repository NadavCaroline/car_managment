import axios from  'axios';
import { MY_SERVER } from '../../env';
import FileTypesModel from '../../models/FileTypes';

// A mock function to mimic making an async request for data
export const getFileTypes = async (token: string) => {
    return axios.get(MY_SERVER + 'fileTypes', 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then((res) => res.data);
  }
  export const addFileTypes = async (token: string, fileTypes: FileTypesModel) => {
    return axios.post(MY_SERVER + 'fileTypes', fileTypes,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      }).then((res) => res);
  }
  
  export const updateFileTypes = async (token: string, fileTypes: FileTypesModel) => {
    return axios.patch(MY_SERVER + 'fileTypes/' + fileTypes.id, fileTypes,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      }).then((res) => res);
  }
  

