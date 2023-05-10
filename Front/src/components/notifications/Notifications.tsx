import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess, userToken } from '../login/loginSlice'
import { getNotificationAsync, notificationIsReadAsync, notificationSelector } from './notificationsSlice';
import dayjs from 'dayjs';

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

      <Dropdown.Menu >
        <Dropdown.Header>התראות</Dropdown.Header>
        <Dropdown.Divider />
        {notifications.map((notification,index) =>[
          
        <Dropdown.Item onClick={e => {  e.stopPropagation(); notification.id !== undefined && notificationClick(notification.id);}} style={{ backgroundColor: notification.is_read ? 'white' : 'lightblue' }}>
            <div className="d-flex flex-column">
              <div style={{ fontWeight: "bold" }}>{notification.title}</div>
              <div>{notification.message}</div>
              <small style={{ alignSelf: 'flex-end' }} className="text-muted mt-1">
                {dayjs(notification.created_at, 'YYYY-MM-DD').format('DD/MM/YYYY')}
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