import React, { useState, CSSProperties } from 'react';
import { Badge, Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from '@fortawesome/free-solid-svg-icons'

type Notification = {
  id: number;
  message: string;
}

type NotificationListProps = {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  return (
    <div>
      {notifications.map(notification => (
        <div key={notification.id}>{notification.message}</div>
      ))}
    </div>
  );
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "Notification 1" },
    { id: 2, message: "Notification 2" },
    { id: 3, message: "Notification 3" },
  ]);

  const handleDismissAll = () => {
    setNotifications([]);
  }

  return (
    // <DropdownButton variant="link" title={<Badge bg="primary">{notifications.length}</Badge>}>
    //   <Dropdown.Header>Notifications</Dropdown.Header>
    //   <Dropdown.Divider />
    //   <Dropdown.ItemText>
    //     <NotificationList notifications={notifications} />
    //   </Dropdown.ItemText>
    //   <Dropdown.Divider />
    //   <Dropdown.Item onClick={handleDismissAll}>Dismiss all</Dropdown.Item>
    // </DropdownButton>

    <Dropdown align="end" className='dropdownNotification'>
      <Dropdown.Toggle variant="link" id="notification-badge" >
        {/* <span className="notify-badge">{notifications.length}</span> */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <FontAwesomeIcon icon={faBell} style={{ fontSize: '1.5em', color: 'white' }} />
          <Badge bg="danger" style={{ position: 'absolute', top: '-11px', right: '-16px' }}>
            {notifications.length}
          </Badge>
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu >
        <Dropdown.Header>Notifications</Dropdown.Header>
        <Dropdown.Item>New notification 1</Dropdown.Item>
        <Dropdown.Item>New notification 2</Dropdown.Item>
        <Dropdown.Item>New notification 3</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={handleDismissAll}>Dismiss all</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default Notifications