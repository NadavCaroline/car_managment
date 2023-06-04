import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  getOrdersAsync,
  ordersSelector
} from './OrdersSlice';

import { userAccess } from '../login/loginSlice';
import { MY_SERVER } from '../../env';




export function MyOrders() {
  const orders = useAppSelector(ordersSelector);
  const token = useAppSelector(userAccess)
  // const cars = useAppSelector(carsSelector)
  const dispatch = useAppDispatch();
  const today = new Date()
  const oneDay = 1000 * 60 * 60 * 24; // milliseconds of a day


  useEffect(() => {
    dispatch(getOrdersAsync(token))
  }, [orders.length, token])


  return (
    <div style={{padding:'10px'}}>
      {/* <h1>ההזמנות שלי</h1><hr /> */}
      {orders.length > 0 ?
        <div>
          {/* Active Orders */}
          {orders.filter(order => new Date(order.toDate).getTime() >= today.getTime() && new Date(order.fromDate).getTime() <= today.getTime()).length > 0 &&
            <div>
              <h3 style={{  color:'white' ,backgroundColor:'rgb(19, 125, 141)' }}>הזמנות פעילות</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)',paddingBottom:'10px' }}>
                {orders.filter(order => new Date(order.toDate).getTime() >= today.getTime() && new Date(order.fromDate).getTime() <= today.getTime()).map(order =>
                  <div key={order.id} style={{ borderRadius: '5px', border: '2px solid #dee2e6', padding: '.5rem', textAlign: 'center' }}>
                    <table style={{ width: '100%', fontSize: '1.25rem' }}>
                      <tr>
                        <td>
                          {order.car_name}
                        </td>
                      </tr>
                    </table>
                    {/* מכונית: {order.car_name}<br /> */}
                    מתאריך: {order.fromDate!.toString().slice(0, 10)}<br />
                    {new Date(order.toDate).getTime() - new Date(order.fromDate).getTime() >= oneDay &&
                      <div>
                        עד תאריך: {order.toDate!.toString().slice(0, 10)}<br />
                      </div>}
                    {order.isAllDay ? <div> כל היום</div> :
                      <div> משעה: {order.fromDate!.toString().slice(11, 16)}<br />
                        עד שעה: {order.toDate!.toString().slice(11, 16)}</div>
                    }
                    יעד: {order.destination}<br />
                    <img src={MY_SERVER + order.car_image} style={{ width: '150px', height: '100px' }} alt={order.car_name} /><br />
                  </div>)}
              </div>
            </div>
          }
          {/* Future Orders */}
          <h3 style={{  color:'white' ,backgroundColor:'rgb(19, 125, 141)' }}>הזמנות עתידיות</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)',paddingBottom:'10px' }}>
            {orders.filter(order => new Date(order.fromDate).getTime() > today.getTime()).map(order =>
              <div key={order.id} style={{ borderRadius: '5px', border: '2px solid #dee2e6', padding: '.5rem', textAlign: 'center' }}>
                <table style={{ width: '100%', fontSize: '1.25rem' }}>
                  <tr>
                    <td>
                      {order.car_name}
                    </td>
                  </tr>
                </table>
                {/* מכונית: {order.car_name}<br /> */}
                {order.fromDate!.toString().slice(0, 10) !== order.toDate!.toString().slice(0, 10) ?
                  <div>
                    מתאריך: {order.fromDate!.toString().slice(0, 10)}<br />
                    עד תאריך: {order.toDate!.toString().slice(0, 10)}<br />
                  </div> :
                  <div>
                    בתאריך: {order.fromDate!.toString().slice(0, 10)}<br />
                  </div>
                }
                {order.isAllDay ? <div> כל היום</div> :
                  <div> משעה: {order.fromDate!.toString().slice(11, 16)}<br />
                    עד שעה: {order.toDate!.toString().slice(11, 16)}</div>
                }
                יעד: {order.destination}<br />
                <img src={MY_SERVER + order.car_image} style={{ width: '150px', height: '100px' }} alt={order.car_name} /><br />
              </div>)}
          </div>
          {/* Previous Orders */}
          <h3 style={{  color:'white' ,backgroundColor:'rgb(19, 125, 141)' }}>הזמנות קודמות</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
            {orders.filter(order => new Date(order.toDate).getTime() < today.getTime()).map(order =>
              <div key={order.id} style={{ borderRadius: '5px', border: '2px solid #dee2e6', padding: '.5rem', textAlign: 'center' }}>
                 <table style={{ width: '100%', fontSize: '1.25rem' }}>
                  <tr>
                    <td>
                      {order.car_name}
                    </td>
                  </tr>
                </table>
                {/* מכונית: {order.car_name}<br /> */}
                {order.fromDate!.toString().slice(0, 10) !== order.toDate!.toString().slice(0, 10) ?
                  <div>
                    מתאריך: {order.fromDate!.toString().slice(0, 10)}<br />
                    עד תאריך: {order.toDate!.toString().slice(0, 10)}<br />
                  </div> :
                  <div>
                    בתאריך: {order.fromDate!.toString().slice(0, 10)}<br />
                  </div>
                }
                {order.isAllDay ? <div> כל היום</div> :
                  <div> משעה: {order.fromDate!.toString().slice(11, 16)}<br />
                    עד שעה: {order.toDate!.toString().slice(11, 16)}</div>
                }
                יעד: {order.destination}<br />
                <img src={MY_SERVER + order.car_image} style={{ width: '150px', height: '100px' }} alt={order.car_name} /><br />
              </div>)}
          </div>
        </div> :
        <div>
          <h2>אין לך הזמנות במערכת</h2>
        </div>
      }
    </div>
  );
}