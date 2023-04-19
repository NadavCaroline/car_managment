import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userToken } from '../login/loginSlice'
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { MaintenanceTypeModel } from '../../models/MaintenanceType'
import { getmaintenanceTypeAsync } from '../maintenanceType/maintenanceTypeSlice';
import { carsSelector, getAllCarsAsync, getCarsAsync } from '../cars/carsSlice';
import { getProfileAsync, profileSelector } from '../profile/profileSlicer'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MY_SERVER } from '../../env';
import CarModel from '../../models/Car';
import AvatarMan from '../../images/img_avatar-man.png';
import AvatarGirl from '../../images/img_avatar-girl.png';

const Shifts = () => {
    const dispatch = useAppDispatch()
    const [listMaintenanceType, setListMaintenanceTypes] = useState<MaintenanceTypeModel[]>([]);
    const [selectedCar, setselectedCar] = useState<CarModel | null>(null)

    // const profile = useAppSelector(profileSelector)
    const cars = useAppSelector(carsSelector);
    const token = useAppSelector(userToken)
    const profile = useAppSelector(profileSelector)
    const [selected, setSelected] = useState<HTMLElement | null>(null);
    const [selectedUser, setSelectedUser] = useState<string[]>([]);
    const [maintenanceType, setMaintenanceType] = useState("")




    type ShiftsForm = {
        user1: string;
        user_name1: string;
        user2: string;
        user_name2: string;
        car: string;
        car_name: string;
        shiftDate: string;
        maintenanceType: string;
        maintenance_name: string;
        comments: string;
    };
    const validationSchema = Yup.object().shape({
        user1: Yup.string()
            .required('נא לבחור עובד'),
        car: Yup.string()
            .required('נא לבחור רכב'),
        shiftDate: Yup.string()
            .required('נא להכניס תאריך תורנות'),
        maintenanceType: Yup.string()
            .required('נא לבחור סוג תורנות '),
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ShiftsForm>({
        resolver: yupResolver(validationSchema)
    });
    useEffect(() => {
        dispatch(getCarsAsync(token))
        dispatch(getmaintenanceTypeAsync(token)).then((res) => setListMaintenanceTypes(res.payload))
        // dispatch(getProfileAsync(token))
        // dispatch(getRolesAsync()).then((res) => setListRoles(res.payload))

    }, [])
    const onSubmitShifts = (data: ShiftsForm) => {
        console.log(JSON.stringify(data, null, 2));
        // dispatch(regAsync({ user: { first_name: data.firstName, last_name: data.lastName, password: data.password, username: data.userName, email: data.email }, profile: { jobTitle: data.jobTitle, roleLevel: data.role, department: data.department, realID: data.id } }));
    };

    function handleOneDivClick(element: HTMLElement): void {
        // element.classList.toggle('selectedDiv');
        //enabled to select only one div
        if (selected === element) {
            setSelected(null);
        } else {
            if (selected) {
                selected.classList.remove('selectedDiv');
            }
            element.classList.add('selectedDiv');
            setSelected(element);
        }
    }
    function handleTwoDivClick(event: React.MouseEvent<HTMLDivElement>) {
        const element = event.currentTarget;
        const id = element.id;
        if (selectedUser.includes(id)) {
            setSelectedUser(selectedUser.filter((item) => item !== id));
            element.classList.remove('selectedDiv');
        } else if (selectedUser.length < 2) {
            setSelectedUser([...selectedUser, id]);
            element.classList.add('selectedDiv');
        }
    }

    return (
        <div>
            <ToastContainer
                position="top-left"
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <div className="row mt-3" style={{ direction: "ltr" }}>
                <div className="mx-auto col-10 col-md-8 col-lg-6">

                    <form dir="rtl" id="formShifts" onSubmit={handleSubmit(onSubmitShifts)} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
                        <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >תורנויות</h1>
                        {/* <!-- maintenanceType select --> */}
                        <div className="form-floating mb-2">
                            <select id="selectMaintenanceType" onChange={(e) => { setMaintenanceType(e.target.value); }} className={`form-select ${errors.maintenanceType ? 'is-invalid' : ''}`} defaultValue={''} >
                                <option value="" disabled  >בחר סוג תורנות...</option>
                                {listMaintenanceType.map(item => (
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback"> {errors.maintenanceType?.message}</div>
                            <label className="form-label" htmlFor="selectMaintenanceType" style={{ marginLeft: "0px" }}>סוג תורנות</label>
                        </div>
                        {/* <!-- car div --> */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
                            {cars.map(car =>
                                <div key={car.id} onClick={(event) => handleOneDivClick(event.currentTarget)}  className="notSelectedDiv" >
                                 {/* <div id={`myDivCar-${car.id}`}  key={car.id} onClick={(event) =>{maintenanceType=="2"? handleOneDivClick(event.currentTarget):handleTwoDivClick(event)}} className="notSelectedDiv" > */}

                                    <div style={{ textAlign: 'center' }}>
                                        <h3>  {car.nickName} - {car.licenseNum}</h3>
                                        מחלקה: {car.dep_name}<br />
                                        יצרן: {car.make}<br />
                                        דגם: {car.model}<br />
                                        צבע: {car.color}<br />
                                        שנה: {car.year}   <br />
                                        <img src={MY_SERVER + car.image} style={{ width: '150px', height: '100px' }} alt={car.model} /><br />
                                    </div>
                                </div>)}
                        </div>
                        {/* <!-- car select --> */}
                        {/* <div className="form-floating mb-2">
                            <select id="selectCars"  {...register('car')} className={`form-select ${errors.car ? 'is-invalid' : ''}`} defaultValue={''} >
                                <option value="" disabled>בחר רכב...</option>
                                {cars.map(item => (
                                    <option value={item.id} key={item.id}>{item.nickName + " " + item.licenseNum}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback"> {errors.car?.message}</div>
                            <label className="form-label" htmlFor="selectCars" style={{ marginLeft: "0px" }}>רכב</label>
                        </div> */}
                        {/* <!-- user1 select --> */}
                         {/* <!-- car div --> */}
                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
                            {cars.map(car =>
                            // אם נבחר מוסך לאפשר לבחור שתי עובדים
                                 <div id={`myDivUser-${car.id}`}  key={car.id} onClick={(event) =>{maintenanceType=="2"? handleOneDivClick(event.currentTarget):handleTwoDivClick(event)}} className="notSelectedDiv" >
                                    <div style={{ textAlign: 'center' }}>
                                    <h3> עובד {car.id} </h3>
                                    <img src={AvatarMan} alt="Avatar" className="avatar" />
                                        {/* <h3>  {car.nickName} - {car.licenseNum}</h3>
                                        מחלקה: {car.dep_name}<br />
                                        יצרן: {car.make}<br />
                                        דגם: {car.model}<br />
                                        צבע: {car.color}<br />
                                        שנה: {car.year}   <br /> */}
                                        {/* <img src={MY_SERVER + car.image} style={{ width: '150px', height: '100px' }} alt={car.model} /><br /> */}
                                    </div>
                                </div>)}
                        </div>
                        <div className="form-floating mb-2">
                            <select id="selectUser1"  {...register('user1')} className={`form-select ${errors.user1 ? 'is-invalid' : ''}`} defaultValue={''} >
                                <option value="" disabled>בחר עובד...</option>
                                {/* {profile.map(item => (
                                    <option value={item.id} key={item.id}>{item.user_name+" "+item.realID}</option>
                                ))} */}
                            </select>
                            <div className="invalid-feedback"> {errors.user1?.message}</div>
                            <label className="form-label" htmlFor="selectUser1" style={{ marginLeft: "0px" }}>עובד</label>
                        </div>
                        {/* <!-- user2 select --> */}
                        <div className="form-floating mb-2">
                            <select id="selectUser2"  {...register('user2')} className={`form-select ${errors.user2 ? 'is-invalid' : ''}`} defaultValue={''} >
                                <option value="" disabled>בחר עובד נוסף...</option>
                                {/* {profile.map(item => (
                                    <option value={item.id} key={item.id}>{item.user_name+" "+item.realID}</option>
                                ))} */}
                            </select>
                            <div className="invalid-feedback"> {errors.user2?.message}</div>
                            <label className="form-label" htmlFor="selectUser2" style={{ marginLeft: "0px" }}>עובד נוסף</label>
                        </div>
                        {/* Date Picking Component */}
                        <div className="form-floating mb-2">
                            {/* <DemoItem >
                                <DatePicker
                                    // minDate={dayjs()}
                                    format='DD-MM-YYYY'
                                    {...register('shiftDate')} className={`form-select ${errors.shiftDate ? 'is-invalid' : ''}`}
                                // value={selectedStartDate}
                                // onChange={handleStartDateChange}
                                />
                            </DemoItem> */}
                            <div className="invalid-feedback"> {errors.shiftDate?.message}</div>
                            <label className="form-label" htmlFor="selectShiftDate" style={{ marginLeft: "0px" }}>תאריך תורנות</label>
                        </div>

                        {/* <!-- Comment input --> */}
                        <div className="form-floating mb-2">
                            <textarea className={`form-control ${errors.comments ? 'is-invalid' : ''}`} {...register('comments')} id="shiftcomment" rows={3} placeholder="הערות"></textarea>
                            <div className="invalid-feedback">{errors.comments?.message}</div>
                            <label className="form-label" htmlFor="shiftcomment" style={{ marginLeft: "0px" }}>הערות</label>
                        </div>


                        <button type='submit' className="btn btn-primary btn-block mb-3">שמור תורנות</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Shifts