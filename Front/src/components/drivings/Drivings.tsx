import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import jwt_decode from "jwt-decode";
import OrderModel from '../../models/Order';
import { userAccess, userToken } from '../login/loginSlice';
import { getOrdersAsync, orderEndedAsync, ordersSelector } from '../orders/OrdersSlice';
import { allDrivesSelector, drivesSelector, endDriveAsync, getAllDrivesAsync, getDrivesAsync, startDriveAsync } from './drivesSlicer';
import { DriveModel } from '../../models/Drive';
import PreviousDrives from './PreviousDrives';
import ActiveDrive from './ActiveDrive';


export function Drivings() {

  return (
    <div >
      <h1>נסיעות קודמות</h1>
      <PreviousDrives/>
      <div>
        <ActiveDrive/>
      </div>

    </div>
  );
}
