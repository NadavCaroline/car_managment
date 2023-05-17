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
  

