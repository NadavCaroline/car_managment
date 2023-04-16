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
import jwtDecode from 'jwt-decode';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from '@fortawesome/free-solid-svg-icons'
import Dropdown from 'react-bootstrap/Dropdown';
import { isLogged, loginWithRefreshAsync, logout, userAccess, userRefresh } from './components/login/loginSlice';

import { Login } from './components/login/Login';
import { getOrdersAsync } from './components/orders/OrdersSlice';
import { adminSelector, getProfileAsync, profileSelector } from './components/profile/profileSlicer';

function App() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const dispatch = useAppDispatch()
  const logged = useAppSelector(isLogged)
  const access = useAppSelector(userAccess)
  const refresh = useAppSelector(userRefresh)
  const profile = useAppSelector(profileSelector)
  const [decoded, setdecoded] = useState<any>("")
  const isAdmin = useAppSelector(adminSelector)
  
  // Checks if the tokens are not expired
  useEffect(() => {
    if (localStorage.hasOwnProperty('access')) {
      const decodedToken: any = jwtDecode(localStorage.getItem('access')!);
      if (decodedToken.exp < Date.now() / 1000) {
        localStorage.removeItem('access')
        dispatch(loginWithRefreshAsync(refresh))
      }
    }
    else {
      if (refresh) {
        dispatch(loginWithRefreshAsync(refresh))
      }
      else {
        dispatch(logout())
      }
    }
  }, [])

  // Decode the access token
  useEffect(() => {
    access && setdecoded(jwt_decode(access))
  }, [access])
  
  // Checks if the user has access to admin features
  useEffect(() => {
    dispatch(getProfileAsync(access))
  }, [])

  return (
    logged ?
      <div>
        <div dir='rtl'>
          < header >
            <nav className="navbar navbar-expand-lg navbar-light " style={{ backgroundColor: 'rgb(19, 125, 141)' }}>
              <div className="navbar-brand text-info font-weight-bolder">
                <a href='/'>
                  <img src={Logo} alt="Logo" width="36" height="36" className="vertical-align-middle" />
                </a>
                {/* <a href={'/profile'} className="navbar-brand" > {decoded.username}</a> */}
                <a href='/profile' className="navbar-brand" > {decoded.username} </a>
              </div>
              <button className="custom-toggler navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample09" aria-controls="navbarsExample09" aria-expanded={!isNavCollapsed ? true : false} aria-label="Toggle navigation" onClick={handleNavCollapse}>
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarsExample09">
                <a className="nav-link " href="/myOrders">הזמנות שלי</a>
                <a className="nav-link " href="/makeOrder">הזמנת רכב</a>
                <a className="nav-link " href="/maintenance">טיפולי רכב</a>
                <a className="nav-link " href="/drivings">ניהול נסיעות</a>
                {/* רק מנהל מחלקה יכול לראות את התפריטים הבאים */}
                {
                  isAdmin && 
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
                }
              </div>
              <div className="item justify-content-end">
                <a href="/Notifications" style={{ paddingRight: "1.5em", paddingLeft: "1em" }}>
                  <span className="notify-badge">1</span>
                  <FontAwesomeIcon icon={faBell} style={{ fontSize: "1.5em", color: "white" }} />
                </a>
              </div>
              <div className=" justify-content-end">
                <button className="btn btn-primary btn-block" style={{ marginLeft: "1em" }} onClick={() => dispatch(logout())}>Logout</button>
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
