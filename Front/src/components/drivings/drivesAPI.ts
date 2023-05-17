import axios from 'axios';
// import jwt_decode from "jwt-decode";
import { DriveModel } from '../../models/Drive'
import { MY_SERVER } from '../../env';


// A mock function to mimic making an async request for data
export const getDrives = async (token: string) => {
    return axios.get(MY_SERVER + 'drives', 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then((res) => res.data);
  }


  // A mock function to mimic making an async request for data
export const getAllDrives = async (token: string) => {
  return axios.get(MY_SERVER + 'alldrives', 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => res.data);
}


export const startDrive = async ( token: string,drive: DriveModel, kilo?:number) => {
    return axios.post(MY_SERVER + 'drives', drive, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            'KilometerVariable': kilo
        }
    }).then((res) => res.data)
}

export const endDrive = async ( token: string,drive: DriveModel) => {
  console.log(drive)
    return axios.patch(MY_SERVER + 'drives/' + drive.id, drive, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => res.data)
}


export const updateDrive = async ( token: string,drive: DriveModel) => {
  return axios.put(MY_SERVER + 'updatedrive/' + drive.id, drive, {
      headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
      }
  }).then((res) => res.data)
}
