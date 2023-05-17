import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess } from '../login/loginSlice'
import { getNotificationAsync, notificationIsReadAsync, notificationSelector,deleteNotificationAsync } from './notificationsSlice';
import dayjs from 'dayjs';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';


const Notifications = () => {
const dispatch = useAppDispatch()
const token = useAppSelector(userAccess);
const notifications = useAppSelector(notificationSelector);


useEffect(() => {
  dispatch(getNotificationAsync(token))
}, [])

const notificationClick = (id: number) => {
  dispatch(notificationIsReadAsync({
    token: token,
    id: id
  }))
}

const deleteNotification = (id: number) => {
  dispatch(deleteNotificationAsync({
    token: token,
    id: id
  }))
  // .then((res) =>  (notifications= notifications.filter((n) => n.id !== id)))


  // remove the item with the given id from the notifications array
  // const filteredNotifications = ;
  // setNotifications(filteredNotifications);
};

useEffect(() => {
  dispatch(getNotificationAsync(token))
}, [notifications.length, token])
return (
  <Dropdown align="end" className='dropdownNotification'>
    <Dropdown.Toggle   variant="link" id="notification-badge" >
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <FontAwesomeIcon icon={faBell} style={{ fontSize: '1.5em', color: 'white' }} />
        <Badge bg="danger" style={{ position: 'absolute', top: '-11px', right: '-16px' }}>
          {notifications.filter(notification => (notification.is_read==false)).length}
        </Badge>
      </div>
    </Dropdown.Toggle>

    <Dropdown.Menu className="dropdown-menu" style={{ position: 'fixed', height: 'auto',maxHeight: '400px',overflowX: 'hidden' }} >
      {/* <Dropdown.Header>התראות</Dropdown.Header> */}
      <Dropdown.Divider />
      {notifications.map((notification,index) =>[
        
      <Dropdown.Item className="notification-item" onClick={e => {  e.stopPropagation(); notification.id !== undefined && notificationClick(notification.id);}} style={{ backgroundColor: notification.is_read ? 'white' : 'lightblue' }}>
          <div className="d-flex flex-column">
            <div style={{ fontWeight: "bold" }}>{notification.title}</div>
            <div >{notification.message}</div>
            <small style={{ alignSelf: 'flex-end' }} className="text-muted mt-1">
                {dayjs(notification.created_at, 'YYYY-MM-DD').locale('he').format('DD/MM/YYYY')}
            
            <FontAwesomeIcon data-tip="Delete" style={{ alignSelf: 'flex-end',paddingRight:'10px' }} className="text-muted mt-1" icon={faTrashAlt} onClick={() =>notification.id !== undefined && deleteNotification(notification.id)}/>            
            </small>
          </div>
        </Dropdown.Item>,
        <Dropdown.Divider style={{display: (index == notifications.length - 1) ? 'none':'block'}} key={`divider-${notification.id}`} />
      ])}
    </Dropdown.Menu>
  </Dropdown>
);
}

export default Notifications