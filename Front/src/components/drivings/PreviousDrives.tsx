import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess } from '../login/loginSlice'
import { drivesSelector, getDrivesAsync, updateDriveAsync } from './drivesSlicer'
import { DriveModel } from '../../models/Drive';
import { MY_SERVER } from '../../env';
import UpdateDrive from './UpdateDrive';
import { getOrdersAsync, ordersSelector } from '../orders/OrdersSlice';


const PreviousDrives = () => {
    const dispatch = useAppDispatch()
    const drives = useAppSelector(drivesSelector)
    const orders = useAppSelector(ordersSelector)
    const token = useAppSelector(userAccess)
    const [selectedDrive, setselectedDrive] = useState<DriveModel | null>(null)
    const [endedDrives, setendedDrives] = useState<DriveModel[]>([])
    const [autoEnded, setautoEnded] = useState<DriveModel[]>([])

    const checkEndedDrives = () => {
        let endedOrders = orders.filter(order => order.ended)
        let tempDrives: DriveModel[] = []
        let tempAuto: DriveModel[] = []
        endedOrders && endedOrders.forEach(order =>
            drives.forEach(drive => {
                if (drive.order === order.id) {
                    drive.endDate !== null ? tempDrives.push(drive) : tempAuto.push(drive)
                }
            }
            ))
        setendedDrives(tempDrives)
        setautoEnded(tempAuto)
    }

    useEffect(() => {
        dispatch(getOrdersAsync(token))
        dispatch(getDrivesAsync(token))
    }, [])

    useEffect(() => {
        checkEndedDrives()
    }, [orders.length, drives.length, drives[drives.length - 1]])


    return (
        <div >
            {drives && orders ?
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)'}}>
                    {autoEnded.map(drive =>
                        <div onClick={() => setselectedDrive(drive)} key={drive.id} style={{ borderRadius: '5px', border: '2px solid red', padding: '.5rem', margin: "10px",cursor: 'pointer' }}>
                            <div>
                                מכונית: {drive.car_name}<br />
                                <img src={MY_SERVER + drive.car_image} style={{ width: '150px', height: '100px' }} alt={drive.car_name} /><br /><br />
                                יעד: {orders.filter(order => order.id === drive.order)[0]?.destination}<br/>
                                <button className="btn btn-primary"  onClick={() => setselectedDrive(drive)}>עריכה</button>
                            </div>
                        </div>
                    )}

                    {endedDrives.map(drive =>
                        <div onClick={() => setselectedDrive(drive)} key={drive.id} style={{ borderRadius: '5px', border: '2px solid rgb(0, 0, 0)', padding: '.5rem', margin: "10px",cursor: 'pointer' }}>
                            <div>
                                מכונית: {drive.car_name}<br />
                                <img src={MY_SERVER + drive.car_image} style={{ width: '150px', height: '100px' }} alt={drive.car_name} /><br /><br />
                                יעד: {orders.filter(order => order.id === drive.order)[0]?.destination}
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

                                <button className="btn btn-primary btn-block mb-3" onClick={() => setselectedDrive(drive)}>עריכה</button>
                            </div>
                        </div>

                    )}
                    {selectedDrive &&
                        <UpdateDrive setselectedDrive={setselectedDrive} selectedDrive={selectedDrive} />
                    }
                </div> :
                <h3 style={{  color:'white' ,backgroundColor:'rgb(19, 125, 141)' }}>אין לך נסיעות קודמות</h3>
            }
        </div>
    )
}

export default PreviousDrives