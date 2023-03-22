import axios from 'axios';
import jwt_decode from "jwt-decode";
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


export const startDrive = async ( token: string,drive: DriveModel) => {
  console.log(drive)
    return axios.post(MY_SERVER + 'drives', {
      user: drive.user,
      order: drive.order,
        startDate: drive.startDate,
        startKilometer: drive.startKilometer,
        startImg1: drive.startImg1,
        startImg2: drive.startImg2,
        startImg3: drive.startImg3
    }, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => res.data)
}

export const endDrive = async ( token: string,drive: DriveModel) => {
  console.log(drive)
    return axios.put(MY_SERVER + 'drives/' + drive.id, {
        endDate: drive.endDate,
        endKilometer: drive.endKilometer,
        endImg1: drive.endImg1,
        endImg2: drive.endImg2,
        endImg3: drive.endImg3,
        comments: drive.comments
    }, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => res.data)
}
