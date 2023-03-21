import axios from 'axios';
import jwt_decode from "jwt-decode";
import { DriveModel } from '../../models/Drive'


export const DRIVES_SERVER = 'http://127.0.0.1:8000/drives'

export const addDrive = async ( token: string,drive: DriveModel) => {
    let decoded: any = jwt_decode(token)
    return axios.post(DRIVES_SERVER, {
        user: decoded.user_id,
        startDate: drive.startDate,
        endDate: drive.endDate,
        fromTime: drive.fromTime,
        toTime: drive.toTime,
        startKilometer: drive.startKilometer,
        endKilometer: drive.endKilometer,
        commmets: drive.comments,
        startImg1: drive.startImg1,
        startImg2: drive.startImg2,
        startImg3: drive.startImg3,
        endImg1: drive.startImg1,
        endImg2: drive.startImg2,
        endImg3: drive.startImg3,
    }, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => res.data)
}
