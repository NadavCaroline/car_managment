import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess } from '../login/loginSlice'
import { drivesSelector, getDrivesAsync } from './drivesSlicer'
import { DriveModel } from '../../models/Drive';
import { MY_SERVER } from '../../env';

const selectedDriveContext = React.createContext<DriveModel | null>(null);



const UpdateDrive = () => {
    const selectedDrive = useContext(selectedDriveContext)
    return (
        <div>
            {selectedDrive &&
                <div>
                    <img src={MY_SERVER + selectedDrive?.car_image} style={{ width: '150px', height: '100px' }} alt={selectedDrive?.car_name} /><br /><br />
                    {selectedDrive.startDate!.toString().slice(0, 10) === selectedDrive.endDate!.toString().slice(0, 10) ?
                        <div>
                            בתאריך: {selectedDrive.startDate!.toString().slice(0, 10)}<br />
                        </div> :
                        <div>
                            מתאריך: {selectedDrive.startDate!.toString().slice(0, 10)}<br />
                            עד תאריך: {selectedDrive.endDate!.toString().slice(0, 10)}<br />
                        </div>
                    }
                    משעה: {selectedDrive.startDate!.toString().slice(11, 16)}<br />
                    עד שעה: {selectedDrive.endDate!.toString().slice(11, 16)}<br />
                    קילומטראז' התחלתי: {Number(selectedDrive.startKilometer).toLocaleString()}<br />
                    קילומטראז' סופי: {Number(selectedDrive.endKilometer).toLocaleString()}<br />

                </div>
            }
        </div>
    )
}




const PreviousDrives = () => {
    const drives = useAppSelector(drivesSelector)
    const dispatch = useAppDispatch()
    const token = useAppSelector(userAccess)
    const [selectedDrive, setselectedDrive] = useState<DriveModel | null>(null)
    const contextValue = useContext(selectedDriveContext)

    useEffect(() => {
        dispatch(getDrivesAsync(token))
    }, [])

    return (
        <div >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
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
                        <button onClick={() => setselectedDrive(drive)}>Click</button>
                    </div>)}
            </div>
            <selectedDriveContext.Provider value={selectedDrive}>
                {selectedDrive &&
                    <button onClick={() => setselectedDrive(null)}>X</button>
                }
                <UpdateDrive />
            </selectedDriveContext.Provider>

        </div>
    )
}

export default PreviousDrives