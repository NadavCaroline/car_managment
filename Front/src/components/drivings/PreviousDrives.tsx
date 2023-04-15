import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess } from '../login/loginSlice'
import { drivesSelector, getDrivesAsync, updateDriveAsync } from './drivesSlicer'
import { DriveModel } from '../../models/Drive';
import { MY_SERVER } from '../../env';
import UpdateDrive from './UpdateDrive';


const PreviousDrives = () => {
    const drives = useAppSelector(drivesSelector)
    const dispatch = useAppDispatch()
    const token = useAppSelector(userAccess)
    const [selectedDrive, setselectedDrive] = useState<DriveModel | null>(null)

    useEffect(() => {
        dispatch(getDrivesAsync(token))
    }, [])

    return (
        <div >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
                {drives.filter(drive => !drive.endDate && drive.startDate).map(drive => <div onClick={() => setselectedDrive(drive)} key={drive.id} style={{ borderRadius: '5px', border: '2px solid red', padding: '.5rem', margin: "10px" }}>
                    מכונית: {drive.car_name}<br />
                    <img src={MY_SERVER + drive.car_image} style={{ width: '150px', height: '100px' }} alt={drive.car_name} /><br /><br />
                    <button onClick={() => setselectedDrive(drive)}>עריכה</button>
                </div>)}
                {drives.filter(drive => drive.endDate).map(drive =>
                    <div onClick={() => setselectedDrive(drive)} key={drive.id} style={{ borderRadius: '5px', border: '2px solid rgb(0, 0, 0)', padding: '.5rem', margin: "10px" }} >
                        מכונית: {drive.car_name}<br />
                        <img src={MY_SERVER + drive.car_image} style={{ width: '150px', height: '100px' }} alt={drive.car_name} /><br /><br />
                        {drive.startDate!.toString().slice(0, 10) === drive.endDate!.toString().slice(0, 10) ?
                            <div>
                                בתאריך: {drive.startDate!.toString().slice(0, 10)}<br />
                            </div> :
                            <div>
                                מתאריך: {drive.startDate!.toString().slice(0, 10)}<br />
                                עד תאריך: {drive.endDate!.toString().slice(0, 10)}<br />
                            </div>
                        }

                        משעה: {drive.startDate!.toString().slice(11, 16)}<br />
                        עד שעה: {drive.endDate!.toString().slice(11, 16)}<br />
                        קילומטראז' התחלתי: {Number(drive.startKilometer).toLocaleString()}<br />
                        קילומטראז' סופי: {Number(drive.endKilometer).toLocaleString()}<br />
                        הערות: {drive.comments ? drive.comments : 'אין הערות'}<br />
                        <button onClick={() => setselectedDrive(drive)}>עריכה</button>
                    </div>)}
                {selectedDrive &&
                    <UpdateDrive setselectedDrive={setselectedDrive} selectedDrive={selectedDrive} />
                }
            </div>

        </div>
    )
}

export default PreviousDrives