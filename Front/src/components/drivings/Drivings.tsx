import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import OrderModel from '../../models/Order';
import { userAccess } from '../login/loginSlice';
import { getOrdersAsync, ordersSelector } from '../orders/OrdersSlice';
import { drivesSelector, getDrivesAsync } from './drivesSlicer';


export function Drivings() {
  // let isRunning = false;
  const [isRunning, setIsRunning] = useState(false);
  const dispatch = useAppDispatch()
  const drives = useAppSelector(drivesSelector)
  const token = useAppSelector(userAccess)
  const orders = useAppSelector(ordersSelector)
  const [activeOrder, setactiveOrder] = useState<OrderModel | null >(null)

  const handleCurrentOrder = ()=>{
    const today = new Date()
    console.log( orders.map(order => console.log(order.fromDate)))
  }

  useEffect(() => {
    dispatch(getDrivesAsync(token))
    dispatch(getOrdersAsync(token))
    orders && handleCurrentOrder()
    activeOrder && console.log(activeOrder)
  }, [])


  const handleButtonClick = () => {
    const startStopBtn = document.querySelector('.round') as HTMLButtonElement;
    setIsRunning(!isRunning);
    if (!isRunning) {
      startStopBtn.textContent = 'Stop';
      startStopBtn.className = "round redBtn";
    } else {
      startStopBtn.textContent = 'Start';
      startStopBtn.className = "round greenBtn";
    }
  };

  return (
    <div >
      <h1>נסיעות קודמות</h1><hr />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>

        {drives.map(drive => <div key={drive.id}>
          מכונית: {drive.car_name}<br />
          <img src={`http://127.0.0.1:8000${drive.car_image}`} style={{ width: '150px', height: '100px' }} alt={drive.car_name} /><br /><br />
          {drive.startDate!.toString().slice(0, 10) !== drive.endDate!.toString().slice(0, 10) ?
            <div>
              מתאריך: {drive.startDate!.toString().slice(0, 10)}<br />
              עד תאריך: {drive.endDate!.toString().slice(0, 10)}<br />
            </div> :
            <div>
              בתאריך: {drive.startDate!.toString().slice(0, 10)}<br />
            </div>
          }
          משעה: {drive.startDate!.toString().slice(11, 16)}<br />
          עד שעה: {drive.endDate!.toString().slice(11, 16)}<br />
        </div>)}
      </div>
      <h1>נסיעה פעילה</h1><hr />
      <div className="d-flex justify-content-center">
        <button className="round greenBtn" onClick={handleButtonClick}>Start</button>
      </div>


    </div>
  );
}
