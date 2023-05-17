import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { userAccess } from '../login/loginSlice';
import { allDrivesSelector, drivesSelector, endDriveAsync, getAllDrivesAsync, getDrivesAsync, startDriveAsync } from './drivesSlicer';
import jwt_decode from "jwt-decode";
import OrderModel from '../../models/Order';
import { DriveModel } from '../../models/Drive';
import { getOrdersAsync, orderEndedAsync, ordersSelector } from '../orders/OrdersSlice';
import { MY_SERVER, NotificationKilomter } from '../../env';

const ActiveDrive = () => {
    const dispatch = useAppDispatch()
    const token = useAppSelector(userAccess)
    const decoded: any = jwt_decode(token)
    const [isRunning, setIsRunning] = useState(false);
    const drives = useAppSelector(drivesSelector)
    const allDrives = useAppSelector(allDrivesSelector)
    const orders = useAppSelector(ordersSelector)
    const [activeOrder, setactiveOrder] = useState<OrderModel | null>(null)
    const [refreshFlag, setrefreshFlag] = useState(false)
    const [noStartKilo, setnoStartKilo] = useState("")
    const [startKilometer, setstartKilometer] = useState("")
    const [endKilometer, setendKilometer] = useState("")
    const [changeKilometer, setchangeKilometer] = useState(false)
    const [startSelectedFile1, setstartSelectedFile1] = useState<File | null>(null)
    const [startSelectedFile2, setstartSelectedFile2] = useState<File | null>(null)
    const [startSelectedFile3, setstartSelectedFile3] = useState<File | null>(null)
    const [endSelectedFile1, setendSelectedFile1] = useState<File | null>(null)
    const [endSelectedFile2, setendSelectedFile2] = useState<File | null>(null)
    const [endSelectedFile3, setendSelectedFile3] = useState<File | null>(null)
    const [activeDrive, setactiveDrive] = useState<DriveModel | null>(null)
    const [comments, setcomments] = useState("")
    const [activeDriveFlag, setactiveDriveFlag] = useState(false)
    // Handles image 1 upload
    const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setstartSelectedFile1(e.target!.files![0])
    };

    // Handles image 2 upload
    const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setstartSelectedFile2(e.target!.files![0])
    };
    // Handles image 3 upload
    const handleFile3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setstartSelectedFile3(e.target!.files![0])
    };

    // Handles image 1 upload
    const handleendFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setendSelectedFile1(e.target!.files![0])
    };
    // Handles image 2 upload
    const handleendFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setendSelectedFile2(e.target!.files![0])
    };
    // Handles image 3 upload
    const handleendFile3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setendSelectedFile3(e.target!.files![0])
    };


    // Detects the active order by the date of today
    const handleCurrentOrder = () => {
        const today = new Date()
        const currentOrder = orders.find(order => new Date(order.fromDate).getTime() <= today.getTime() && new Date(order.toDate).getTime() >= today.getTime() && order.ended === false)
        setactiveOrder(currentOrder!)
        setrefreshFlag(!refreshFlag)
    }
    // Gets the end kilometer of the car of the active order, according to the report of the last drive
    const handleStartKilometer = () => {
        const lastDrive = allDrives.filter(drive => drive.car === activeOrder?.car).pop()
        lastDrive ? setstartKilometer(String(lastDrive?.endKilometer)) : setstartKilometer("")
    }

    // Calls the server with GET methods When the app goes live
    useEffect(() => {
        dispatch(getDrivesAsync(token))
        dispatch(getOrdersAsync(token))
        dispatch(getAllDrivesAsync(token))
    }, [token])

    // Checks if there is an active drive when app is loaded
    useEffect(() => {
        if (localStorage.hasOwnProperty('isRunning')) {
            setIsRunning(true)
        }
    }, [])

    // Checks if there is an active drive when app is loaded
    useEffect(() => {
        if (localStorage.hasOwnProperty('activeDrive')) {
            setactiveDrive(drives[drives.length - 1])
        }
    }, [])

    // Checks if there is an order today
    useEffect(() => {
        handleCurrentOrder()
    }, [orders.length, token])

    // Handles the active drive change
    useEffect(() => {
        dispatch(getDrivesAsync(token))
        setactiveDriveFlag(!activeDriveFlag)
    }, [drives.length])


    useEffect(() => {
        isRunning && setactiveDrive(drives[drives.length - 1])
    }, [activeDriveFlag])

    // Gets the kilometer of the active order, if exists.
    useEffect(() => {
        handleStartKilometer()
    }, [refreshFlag, allDrives.length, token])

    const handleButtonClick = () => {
        const startStopBtn = document.querySelector('.round') as HTMLButtonElement;
        setIsRunning(!isRunning);
        if (!isRunning) {
            localStorage.setItem('isRunning', "true")
            localStorage.setItem('activeDrive', "true")
            dispatch(startDriveAsync({
                token: token, drive: {
                    user: decoded.user_id,
                    order: activeOrder?.id,
                    startDate: new Date(),
                    startKilometer: startKilometer,
                    startImg1: startSelectedFile1,
                    startImg2: startSelectedFile2,
                    startImg3: startSelectedFile3,
                }, kilo: NotificationKilomter
                
            }))

            startStopBtn.textContent = 'Stop';
            startStopBtn.className = "round redBtn";
        } else {
            dispatch(endDriveAsync({
                token: token, drive: {
                    id: activeDrive?.id,
                    endDate: new Date(),
                    comments: comments,
                    endKilometer: endKilometer,
                    endImg1: endSelectedFile1,
                    endImg2: endSelectedFile2,
                    endImg3: endSelectedFile3,
                }
            }))
            dispatch(orderEndedAsync({
                token: token,
                id: activeOrder?.id!
            }))
            setactiveDrive(null)
            setactiveOrder(null)
            localStorage.removeItem('isRunning')
            localStorage.removeItem('activeDrive')
            startStopBtn.textContent = 'Start';
            startStopBtn.className = "round greenBtn";
        }
    };
    // Handles the auto fill of the start/end date of a drive
    // if the user didn't start/end the drive
    useEffect(() => {
        if (orders) {
            // const activeOrder = orders.find(o => o.id === drives[drives.length -1].order)
            // if ((activeOrder?.ended === false) && (new Date().getTime() > new Date(activeOrder?.toDate!).getTime())) {
            //     console.log("Entered First If")
            //     if (activeDrive) {
            //         dispatch(endDriveAsync({
            //             token: token, drive: drives[drives.length - 1]
            //         }))
            //         dispatch(orderEndedAsync({
            //             token: token,
            //             id: activeOrder?.id!
            //         }))
            //         localStorage.removeItem('isRunning')
            //         localStorage.removeItem('activeDrive')
            //         setactiveDrive(null)
            //         setIsRunning(false)
            //         dispatch(getDrivesAsync(token))
            //     }

            // }
            // else
            if (orders.find(order => new Date().getTime() > new Date(order.toDate).getTime() && order.ended === false)) {
                let active = orders.find(order => new Date().getTime() > new Date(order.toDate).getTime() && order.ended === false)
                let drive = drives.find(drive => drive.order === active?.id)
                if (drive) {
                    dispatch(endDriveAsync({
                        token: token, drive: drive
                    }))
                } else {
                    dispatch(startDriveAsync({
                        token: token, drive: {
                            user: decoded.user_id,
                            order: active?.id,
                        }
                    }))
                }
                dispatch(orderEndedAsync({
                    token: token,
                    id: active?.id!
                }))
                localStorage.removeItem('isRunning')
                localStorage.removeItem('activeDrive')
                setactiveDrive(null)
                setIsRunning(false)
                dispatch(getDrivesAsync(token))
                dispatch(getOrdersAsync(token))
            }
        }

    }, [orders.length])

    return (
        <div>
            {isRunning ?
                <div>
                    <h1>נסיעה פעילה</h1>
                    <hr />
                    <h3>הנסיעה התחילה</h3>

                    <img src={MY_SERVER + activeOrder?.car_image} style={{ width: '150px', height: '100px' }} alt={activeDrive?.car_name} /><br />
                    {/* בשעה: {activeDrive?.startDate!.toString().slice(11, 16)}<br /> */}
                    קילומטראז': <input onChange={(e) => setendKilometer(e.target.value)} value={endKilometer} /><br />

                    <input type='file' onChange={handleendFile1Change} /><br />

                    {endSelectedFile1 &&
                        <div>
                            <img src={URL.createObjectURL(endSelectedFile1)}
                                alt={endSelectedFile1.name}
                                style={{ width: '150px', height: '100px' }} /><br />
                            <input type='file' onChange={handleendFile2Change} />
                        </div>}
                    {endSelectedFile2 &&
                        <div>
                            <img src={URL.createObjectURL(endSelectedFile2)}
                                alt={endSelectedFile2.name}
                                style={{ width: '150px', height: '100px' }} /><br />
                            <input type='file' onChange={handleendFile3Change} />
                        </div>}
                    {endSelectedFile3 &&
                        <div>
                            <img src={URL.createObjectURL(endSelectedFile3)}
                                alt={endSelectedFile3.name}
                                style={{ width: '150px', height: '100px' }} /><br />
                        </div>
                    }
                    הערות: <input onChange={(e) => setcomments(e.target.value)} />
                    <div className="d-flex justify-content-center">
                        <button className="round redBtn" onClick={handleButtonClick}>Stop</button>
                    </div>
                </div> :
                <div>
                    {(activeOrder && !activeOrder?.ended) &&
                        <div>
                            <h3>הזמנה פעילה</h3>
                            <div> {activeOrder.car_name}</div><br />
                            <div>{activeOrder.ended}</div>
                            <img src={MY_SERVER + activeOrder.car_image} style={{ width: '150px', height: '100px' }} alt={activeOrder.car_name} /><br />
                            {activeOrder.isAllDay ?
                                <div>
                                    כל היום
                                </div> :
                                <div>
                                    משעה: {activeOrder.fromDate!.toString().slice(11, 16)}<br />
                                    עד שעה: {activeOrder.toDate!.toString().slice(11, 16)}<br />
                                </div>
                            }
                            {startKilometer ?
                                <div>
                                    קילומטראז': <input onChange={(e) => setstartKilometer(e.target.value)} value={startKilometer} disabled={!changeKilometer} />
                                    דרוש שינוי? <input type={'checkbox'} onChange={() => setchangeKilometer(!changeKilometer)} /><br />
                                </div> :
                                <div>
                                    קילומטראז': <input onChange={(e) => setnoStartKilo(e.target.value)} value={noStartKilo} />
                                </div>
                            }
                            <input type='file' onChange={handleFile1Change} />
                            {startSelectedFile1 &&
                                <div>
                                    <img src={URL.createObjectURL(startSelectedFile1)}
                                        alt={startSelectedFile1.name}
                                        style={{ width: '150px', height: '100px' }} /><br />
                                    <input type='file' onChange={handleFile2Change} />
                                </div>}
                            {startSelectedFile2 &&
                                <div>
                                    <img src={URL.createObjectURL(startSelectedFile2)}
                                        alt={startSelectedFile2.name}
                                        style={{ width: '150px', height: '100px' }} /><br />
                                    <input type='file' onChange={handleFile3Change} />
                                </div>}
                            {startSelectedFile3 &&
                                <div>
                                    <img src={URL.createObjectURL(startSelectedFile3)}
                                        alt={startSelectedFile3.name}
                                        style={{ width: '150px', height: '100px' }} /><br />
                                </div>}
                            <div className="d-flex justify-content-center">
                                <button className="round greenBtn" onClick={handleButtonClick}>Start</button>
                            </div>
                        </div>
                    }

                </div>
            }

        </div>
    )
}

export default ActiveDrive