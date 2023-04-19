import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';
import { Outlet, Link, BrowserRouter, Routes, Route } from "react-router-dom";
import { MyOrders } from './components/orders/MyOrders';

// import Test from './components/Test';
// import { Login } from './components/Login';
// import Profile from './components/Profile';
import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.rtl.min.css';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/js/bootstrap.bundle';
import { Login } from './components/login/Login';
import Profile from './components/profile/Profile';
import Logs from './components/logs/Logs';
import { Cars } from './components/cars/Cars';
import MakeOrder from './components/orders/MakeOrder';
import Maintenance from './components/maintenance/Maintenance';
import Departments from './components/deps/Departments';
import { Drivings } from './components/drivings/Drivings';
import Users from './components/users/Users';
import MaintenanceType from './components/maintenanceType/MaintenanceType';
import Notifications from './components/notifications/Notifications';
import { useAppSelector } from './app/hooks';
import { ordersSelector } from './components/orders/OrdersSlice';
import Forgot from './components/login/Forgot';
import Reset from './components/login/Reset';
import Shifts from './components/shifts/Shifts';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} >
                        <Route index element={<h1>ברוכים הבאים לאפליקצייה שלנו</h1>} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/myOrders" element={<MyOrders />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/logs" element={<Logs />} />
                        <Route path="/Cars" element={<Cars />} />
                        <Route path="/makeOrder" element={<MakeOrder />} />
                        <Route path="/maintenance" element={<Maintenance />} />
                        <Route path="/drivings" element={<Drivings />} />
                        <Route path="/departements" element={<Departments />} />
                        <Route path="/allUsers" element={<Users />} />
                        <Route path="/maintenanceTypes" element={<MaintenanceType />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/myOrders" element={<MyOrders/>} />
                        <Route path="/login" element={<Login/>} />
                        <Route path="/profile" element={<Profile/>} />
                        <Route path="/logs" element={<Logs/>} />
                        <Route path="/Cars" element={<Cars/>} />
                        <Route path="/makeOrder" element={<MakeOrder/>} />
                        <Route path="/maintenance" element={<Maintenance/>} />
                        <Route path="/drivings" element={<Drivings/>} />
                        <Route path="/departements" element={<Departments/>} />                        
                        <Route path="/allUsers" element={<Users/>} />
                        <Route path="/maintenanceTypes" element={<MaintenanceType/>} />
                        <Route path="/notifications" element={<Notifications/>} />
                        <Route path="/forgot" element={<Forgot/>} />
                        <Route path="/reset/:uidb64/:token" element={<Reset/>} />
                        <Route path="/shifts" element={<Shifts/>} />
                        {/* <Route path="/reset/:id" element={<Reset/>} /> */}
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
