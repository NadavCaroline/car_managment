import React, { useEffect, useState } from 'react';
import './App.css';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { MyOrders } from './components/orders/MyOrders';
import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';
import Logo from './images/carLogo.png';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import fontawesome from '@fortawesome/fontawesome'
// import FontAwesomeIcon from '@fortawesome/react-fontawesome';
// import { faCheckSquare, faBell } from '@fortawesome/fontawesome-free-solid'
// import { library } from "@fortawesome/fontawesome-svg-core";
import jwt_decode from "jwt-decode"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from '@fortawesome/free-solid-svg-icons'
import Dropdown from 'react-bootstrap/Dropdown';
import { isLogged, logout, userToken } from './components/login/loginSlice';
import { Login } from './components/login/Login';

function App() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const dispatch = useAppDispatch()
  const logged = useAppSelector(isLogged)
  const token = useAppSelector(userToken)
  const [decoded, setdecoded] = useState<any>("")

  useEffect(() => {
    logged &&  setdecoded(jwt_decode(token))
  }, [,logged])
  
  return (
    logged ?
      <div>
        <div dir='rtl'>
          < header >
            <nav className="navbar navbar-expand-lg navbar-light " style={{ backgroundColor: '#42C1C5' }}>
              <a className="navbar-brand text-info font-weight-bolder" href="/">
                <img src={Logo} alt="Logo" width="36" height="36" className="vertical-align-middle" />
                <span className="navbar-brand"> {decoded.username} </span>
              </a>
              <div className="item justify-content-end">
                <a href="/Notifications" style={{ paddingRight: "1.5em" }}>
                  <span className="notify-badge">1</span>
                  <FontAwesomeIcon icon={faBell} style={{ fontSize: "1.5em", color: "white" }} />
                </a>
              </div>
              <button className="custom-toggler navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample09" aria-controls="navbarsExample09" aria-expanded={!isNavCollapsed ? true : false} aria-label="Toggle navigation" onClick={handleNavCollapse}>
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarsExample09">

                <button onClick={() => dispatch(logout())}>Logout</button>


                <a className="nav-link " href="/myOrders">הזמנות שלי</a>
                <a className="nav-link " href="/makeOrder">הזמנת רכב</a>
                <a className="nav-link " href="/maintenance">טיפולי רכב</a>
                <a className="nav-link " href="/drivings">ניהול נסיעות</a>
                {/* רק מנהל מחלקה יכול לראות את התפריטים הבאים */}
                <Dropdown >
                  <Dropdown.Toggle variant="transparent" style={{ color: "white !important" }} id="dropdown-basic">
                    פעולות מנהל     </Dropdown.Toggle>

                  <Dropdown.Menu >
                    <Dropdown.Item style={{ textAlign: "right" }} href="/departements">מחלקות</Dropdown.Item>
                    <Dropdown.Item style={{ textAlign: "right" }} href="/allUsers">משתמשים</Dropdown.Item>
                    <Dropdown.Item style={{ textAlign: "right" }} href="/Cars">רכבים</Dropdown.Item>
                    <Dropdown.Item style={{ textAlign: "right" }} href="/maintenanceTypes">סוגי טיפולי רכב</Dropdown.Item>
                    <Dropdown.Item style={{ textAlign: "right" }} href="/shifts">ניהול תורנויות</Dropdown.Item>
                    <Dropdown.Item style={{ textAlign: "right" }} href="/reports">דוחות</Dropdown.Item>
                    <Dropdown.Item style={{ textAlign: "right" }} href="/logs">מעקב פעולות</Dropdown.Item>

                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </nav>

            {/* <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor:'#42C1C5' }}>
          <a className="navbar-brand" href="#">CarMng</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link className="nav-link" to="/login">login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/MyOrders">MyOrders</Link>
              </li>
            </ul>
          </div>
        </nav> */}
            <Outlet></Outlet>
          </header >
        </div >
      </div> :
      <Login />


  );
}

export default App;
