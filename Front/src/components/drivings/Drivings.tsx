import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import jwt_decode from "jwt-decode";
import OrderModel from '../../models/Order';
import { userAccess } from '../login/loginSlice';
import { getOrdersAsync, ordersSelector } from '../orders/OrdersSlice';
import { allDrivesSelector, drivesSelector, endDriveAsync, getAllDrivesAsync, getDrivesAsync, startDriveAsync } from './drivesSlicer';
import { DriveModel } from '../../models/Drive';


export function Drivings() {
  const dispatch = useAppDispatch()
  const token = useAppSelector(userAccess)
  let decoded: any = jwt_decode(token)
  const [isRunning, setIsRunning] = useState(false);
  const drives = useAppSelector(drivesSelector)
  const allDrives = useAppSelector(allDrivesSelector)
  const orders = useAppSelector(ordersSelector)
  const [activeOrder, setactiveOrder] = useState<OrderModel | null>(null)
  const [refreshFlag, setrefreshFlag] = useState(false)
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
    const currentOrder = orders.find(order => new Date(order.fromDate).getTime() <= today.getTime() && new Date(order.toDate).getTime() >= today.getTime())
    setactiveOrder(currentOrder!)
    setrefreshFlag(!refreshFlag)
  }
  // Gets the end kilometer of the car of the active order, according to the report of the last drive
  const handleStartKilometer = () => {
    const lastDrive = allDrives.filter(drive => drive.endKilometer && drive.car_name === activeOrder?.car_name).pop()
    lastDrive && setstartKilometer(String(lastDrive?.endKilometer))
  }

  useEffect(() => {
    dispatch(getDrivesAsync(token))
    dispatch(getOrdersAsync(token))
    dispatch(getAllDrivesAsync(token))

  }, [])


  useEffect(() => {
    const startStopBtn = document.querySelector('.round') as HTMLButtonElement;
    if (localStorage.hasOwnProperty('isRunning')) {
      startStopBtn.textContent = 'Stop';
      startStopBtn.className = "round redBtn";
      setIsRunning(true)
    } 
  }, [])
  
  useEffect(() => {
    if (localStorage.hasOwnProperty('activeDrive')) {
      setactiveDrive(drives[drives.length - 1])
      console.log(activeDrive)
    } 
  }, [])
  


  useEffect(() => {
    handleCurrentOrder()
  }, [orders.length])

  useEffect(() => {
    dispatch(getDrivesAsync(token))
    isRunning && setactiveDrive(drives[drives.length - 1])
    isRunning && console.log(drives[drives.length - 1])
  }, [drives.length])

  useEffect(() => {
    handleStartKilometer()
  }, [refreshFlag, allDrives.length])

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
          car_image: activeOrder?.car_image,
          startDate: new Date(),
          startKilometer: startKilometer,
          startImg1: startSelectedFile1,
          startImg2: startSelectedFile2,
          startImg3: startSelectedFile3,
        }
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
      setactiveDrive(null)
      localStorage.removeItem('isRunning')
      localStorage.removeItem('activeDrive')
      startStopBtn.textContent = 'Start';
      startStopBtn.className = "round greenBtn";
    }
  };

  return (
    <div >
      <h1>נסיעות קודמות</h1><hr />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>

        {drives.filter(drive => drive.endDate).map(drive =>

          <div key={drive.id} style={{ borderRadius: '5px', border: '2px solid rgb(0, 0, 0)', padding: '.5rem', margin: "10px" }}>

            מכונית: {drive.car_name}<br />
            <img src={`http://127.0.0.1:8000${drive.car_image}`} style={{ width: '150px', height: '100px' }} alt={drive.car_name} /><br /><br />
            <div>
              מתאריך: {drive.startDate!.toString().slice(0, 10)}<br />
              עד תאריך: {drive.endDate!.toString().slice(0, 10)}<br />
            </div>
            <div>
              בתאריך: {drive.startDate!.toString().slice(0, 10)}<br />
            </div>

            משעה: {drive.startDate!.toString().slice(11, 16)}<br />
            עד שעה: {drive.endDate!.toString().slice(11, 16)}<br />
            קילומטראז' התחלתי: {Number(drive.startKilometer).toLocaleString()}<br />
            קילומטראז' סופי: {Number(drive.endKilometer).toLocaleString()}<br />
            הערות: {drive.comments ? drive.comments : 'אין הערות'}
            <button>עריכה</button>
          </div>)}
      </div>
      <div>
        {isRunning ?
          <div>
            <h1>נסיעה פעילה</h1><hr />
            הנסיעה התחילה
            <img src={`http://127.0.0.1:8000${activeDrive?.car_image}`} style={{ width: '150px', height: '100px' }} alt={activeDrive?.car_name} /><br />
            בשעה: {activeDrive?.startDate!.toString().slice(11, 16)}<br />
            קילומטראז': <input onChange={(e) => setendKilometer(e.target.value)} value={endKilometer} />

            <input type='file' onChange={handleendFile1Change} /><br />
            {startSelectedFile1 &&
              <div>
                <input type='file' onChange={handleendFile2Change} /><br />
              </div>}
            {startSelectedFile2 &&
              <div>
                <input type='file' onChange={handleendFile3Change} /><br />
              </div>}
            הערות: <input onChange={(e) => setcomments(e.target.value)} />

          </div> :
          <div>
            {activeOrder &&
              <div>
                <div> {activeOrder.car_name}</div>
                <img src={`http://127.0.0.1:8000${activeOrder.car_image}`} style={{ width: '150px', height: '100px' }} alt={activeOrder.car_name} /><br />
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
                    קילומטראז': <input onChange={(e) => setstartKilometer(e.target.value)} value={startKilometer} />
                  </div>
                }
                <input type='file' onChange={handleFile1Change} /><br />
                {startSelectedFile1 &&
                  <div>
                    <input type='file' onChange={handleFile2Change} /><br />
                  </div>}
                {startSelectedFile2 &&
                  <div>
                    <input type='file' onChange={handleFile3Change} /><br />
                  </div>}



              </div>
            }

          </div>
        }

        <div className="d-flex justify-content-center">
          <button className="round greenBtn" onClick={handleButtonClick}>Start</button>
        </div>
      </div>


    </div>
  );
}
