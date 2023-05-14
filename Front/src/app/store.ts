import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import carsReducer from '../components/cars/carsSlice';
import  depsReducer  from '../components/deps/depsSlicer';
import  driveReducer from '../components/drivings/drivesSlicer';
import loginReducer  from '../components/login/loginSlice';
import  logReducer  from '../components/logs/logsSlice';
import  myOrderReducer  from '../components/orders/OrdersSlice';
import  profileReducer  from '../components/profile/profileSlicer';
import  shiftReducer  from '../components/shifts/shiftsSlice';
import  userReducer  from '../components/users/userSlicer';
import notificationReducer from '../components/notifications/notificationsSlice'
import carMaintenanceReducer from '../components/carMaintenance/carMaintenanceSlice'

// import  notificationReducer  from '../components/Notifications/notificationsSlicer';

// import  maintena  from 'maintenanceTypesSlic' '../components/maintenanceTypes/maintenanceTypesSlice';
// import MaintenanceTypeReducer from '../components/maintenanceType/MaintenanceTypeSlice';
export const store = configureStore({
  reducer: {
    myOrder: myOrderReducer,
    myCars: carsReducer,
    login: loginReducer,
    drive: driveReducer,
    profile: profileReducer,
    dep: depsReducer,
    log: logReducer,
    users: userReducer,
    shifts: shiftReducer,
    notifications:notificationReducer,
    carMaintenance:carMaintenanceReducer
    // maintenanceTypes: maintenanceTypeReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
