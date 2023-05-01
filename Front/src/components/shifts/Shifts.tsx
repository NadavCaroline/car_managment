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
import { addShiftAsync, shiftError, SetError, shiftMessage, SetMsg } from '../shifts/shiftsSlice';
import { getUsersOfDepAsync, usersSelector } from '../users/userSlicer'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MY_SERVER } from '../../env';
import CarModel from '../../models/Car';
import ShiftModel from '../../models/Shift';
import AvatarMan from '../../images/img_avatar-man.png';
import AvatarGirl from '../../images/img_avatar-girl.png';


const Shifts = () => {
    const dispatch = useAppDispatch()
    const [listMaintenanceType, setListMaintenanceTypes] = useState<MaintenanceTypeModel[]>([]);
    const cars = useAppSelector(carsSelector);
    const token = useAppSelector(userToken)
    const users = useAppSelector(usersSelector)
    const [selectedCar, setSelectedCar] = useState<HTMLElement | null>(null);
    const [selectedUser, setSelectedUser] = useState<string[]>([]);
    const [maintenanceType, setMaintenanceType] = useState<HTMLElement | null>(null);
    const [selectedStartDate, setselectedStartDate] = useState<Dayjs | null>(null)
    const [comments, setComments] = useState("")
    const errorMessage = useAppSelector(shiftError)
    const successMessage = useAppSelector(shiftMessage)

    const messageError = (value: string) => toast.error(value, {
        position: "top-left",
        //autoClose: 5000,
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        rtl:true,
    });

    const message = (value: string) => toast.success(value, {
        position: "top-left",
        //autoClose: 5000,
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        rtl:true,
    });

    useEffect(() => {
        if (errorMessage && errorMessage !== "")
            messageError(errorMessage)
        dispatch(SetError(""))
    }, [errorMessage])

    useEffect(() => {
        if (successMessage && successMessage !== "")
            message(successMessage)
        dispatch(SetMsg())
    }, [successMessage])
    // type ShiftsForm = {
    //     user1: string;
    //     user_name1: string;
    //     user2: string;
    //     user_name2: string;
    //     car: string;
    //     car_name: string;
    //     shiftDate: string;
    //     maintenanceType: string;
    //     maintenance_name: string;
    //     comments: string;
    // };
    // const validationSchema = Yup.object().shape({
    //     user1: Yup.string()
    //         .required('נא לבחור עובד'),
    //     car: Yup.string()
    //         .required('נא לבחור רכב'),
    //     shiftDate: Yup.string()
    //         .required('נא להכניס תאריך תורנות'),
    //     maintenanceType: Yup.string()
    //         .required('נא לבחור סוג תורנות '),
    // });

    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors }
    // } = useForm<ShiftsForm>({
    //     resolver: yupResolver(validationSchema)
    // });
    useEffect(() => {
        dispatch(getCarsAsync(token))
        dispatch(getmaintenanceTypeAsync(token)).then((res) => setListMaintenanceTypes(res.payload))
        dispatch(getUsersOfDepAsync(token))
        // dispatch(getRolesAsync()).then((res) => setListRoles(res.payload))

    }, [])

    useEffect(() => {
        resetSelectedUser();
    }, [maintenanceType])

    // const onSubmitShifts = (data: ShiftsForm) => {
    //     console.log(JSON.stringify(data, null, 2));
    //     // dispatch(regAsync({ user: { first_name: data.firstName, last_name: data.lastName, password: data.password, username: data.userName, email: data.email }, profile: { jobTitle: data.jobTitle, roleLevel: data.role, department: data.department, realID: data.id } }));
    // };

    const onSubmitShifts = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let msgError = "";
        let mt = (maintenanceType && maintenanceType!.id.replaceAll("divMaintenance-", '')) ?? '';
        if (!selectedStartDate) {
            msgError = "נא להכניס תאריך תורנות"
        }
        else if (!mt) {
            msgError = "אנא בחר סוג התורנות"
        }
        else if (!selectedCar) {
            msgError = "אנא בחר רכב "
        }
        else if (selectedUser.length <= 0) {
            msgError = "אנא בחר עובד לשיבוץ התורנות"
        }
        else if (mt == "1" && selectedUser.length <= 1) {
            msgError = "אנא בחר 2 עובדים עבור תורנות מסוג מוסך"
        }
        if (msgError) {
            dispatch(SetError(msgError))
            return;
        }
        const shift: ShiftModel = {
            user1: selectedUser && selectedUser[0] && selectedUser[0].replaceAll("divUser-", ''),
            user2: (selectedUser && selectedUser[1]) ? selectedUser[1].replaceAll("divUser-", '') : "",
            car: (selectedCar && selectedCar!.id.replaceAll("divCar-", '')) ?? '',
            shiftDate: selectedStartDate!.format('YYYY-MM-DD'),
            maintenanceType: mt,
            comments: comments

        }
        dispatch(addShiftAsync({ token: token, shift: shift }))


    };

    function handleCarDivClick(element: HTMLElement): void {
        //enabled to select only one div
        if (selectedCar === element) {
            setSelectedCar(null);
            selectedCar.classList.remove('selectedDiv');
        } else {
            if (selectedCar) {
                selectedCar.classList.remove('selectedDiv');
            }
            element.classList.add('selectedDiv');
            setSelectedCar(element);
        }
    }
    function handleMaintenanceDivClick(element: HTMLElement): void {
        // element.classList.toggle('selectedDiv');
        //enabled to select only one div
        if (maintenanceType === element) {
            setMaintenanceType(null);
            maintenanceType.classList.remove('selectedDiv');
        } else {
            if (maintenanceType) {
                maintenanceType.classList.remove('selectedDiv');
            }
            element.classList.add('selectedDiv');
            setMaintenanceType(element);
        }
    }
    function resetSelectedUser() {

        selectedUser.forEach((selectedUserDiv) => {
            const div = document.getElementById(selectedUserDiv);
            div?.classList.remove('selectedDiv');
        });
        // let test  = getElementById(elementId: string): HTMLElement | null;
        setSelectedUser([]);



    }
    function handleDivUserClick(event: React.MouseEvent<HTMLDivElement>, numOfClick: number) {
        const element = event.currentTarget;
        const id = element.id;
        if (selectedUser.includes(id)) {
            setSelectedUser(selectedUser.filter((item) => item !== id));
            element.classList.remove('selectedDiv');
            //enable to select multiple div according to param numOfClick
        } else if (selectedUser.length < numOfClick) {
            setSelectedUser([...selectedUser, id]);
            element.classList.add('selectedDiv');
        }
        else if (selectedUser.length === numOfClick && numOfClick === 1) {
            setSelectedUser([id]);
            const elDiv = document.getElementById(selectedUser[0]) as HTMLInputElement | null;
            elDiv?.classList.remove('selectedDiv');
            element.classList.add('selectedDiv');
        }
    }
    const handleStartDateChange = (date: Dayjs | null) => {
        setselectedStartDate(date)
        // setformatedStartDate(date!.format('DD-MM-YYYY'))
        // setselectedEndDate(date)
        // setformatedEndDate(date!.format('DD-MM-YYYY'))
        // setrefreshFlag(!refreshFlag)
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

                    <form dir="rtl" id="formShifts" onSubmit={onSubmitShifts} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
                        <div style={{ width: '400px', marginRight: '5px' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker', 'MobileTimePicker']}>
                                    {/* Date Picking Component */}
                                    <DemoItem >
                                        <DatePicker
                                            minDate={dayjs()}
                                            format='DD-MM-YYYY'
                                            value={selectedStartDate}
                                            onChange={handleStartDateChange} />
                                    </DemoItem>
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                        <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >סוג תורנות</h1>
                        {/* <!-- maintenanceType select --> */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
                            {listMaintenanceType.map(maintenanceType =>
                                <div id={`divMaintenance-${maintenanceType.id}`} key={maintenanceType.id} onClick={(event) => handleMaintenanceDivClick(event.currentTarget)} className="notSelectedDiv" >
                                    <div style={{ textAlign: 'center' }}>
                                        <img src={MY_SERVER + maintenanceType.imgLogo} style={{ width: '50px', height: '50px' }} alt={"imglogo"} /><br />
                                        <h6>  {maintenanceType.name} </h6>
                                    </div>
                                </div>)}
                        </div>
                        {/* <div className="form-floating mb-2">
                            <select id="selectMaintenanceType" onChange={(e) => { setMaintenanceType(e.target.value); }} className={`form-select ${errors.maintenanceType ? 'is-invalid' : ''}`} defaultValue={''} >
                                <option value="" disabled  >בחר סוג תורנות...</option>
                                {listMaintenanceType.map(item => (
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback"> {errors.maintenanceType?.message}</div>
                            <label className="form-label" htmlFor="selectMaintenanceType" style={{ marginLeft: "0px" }}>סוג תורנות</label>
                        </div> */}
                        <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >רכב</h1>
                        {/* <!-- car div --> */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
                            {cars.map(car =>
                                <div id={`divCar-${car.id}`} key={car.id} onClick={(event) => handleCarDivClick(event.currentTarget)} className="notSelectedDiv" >
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
                        <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >משתמש</h1>
                        {/* <!-- users div --> */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
                            {users.map(user =>
                                // אם נבחר מוסך לאפשר לבחור שתי עובדים
                                <div id={`divUser-${user.id}`} key={user.id} onClick={(event) => { maintenanceType?.id === "divMaintenance-2" ? handleDivUserClick(event, 1) : handleDivUserClick(event, 2) }} className="notSelectedDiv" >
                                    <div style={{ textAlign: 'center' }}>
                                        <h3> {user.first_name} {user.last_name} </h3>
                                        <img src={AvatarMan} alt="Avatar" className="avatar" />
                                    </div>
                                </div>)}
                        </div>


                        <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >הערות</h1>
                        {/* <!-- Comment input --> */}
                        <div className="form-floating mb-2">
                            <textarea onChange={(e) => setComments(e.target.value)} id="shiftcomment" rows={3} placeholder="הערות"></textarea>
                            {/* <div className="invalid-feedback">{errors.comments?.message}</div> */}
                            {/* <label className="form-label" htmlFor="shiftcomment" style={{ marginLeft: "0px" }}>הערות</label> */}
                        </div>


                        <button type='submit' className="btn btn-primary btn-block mb-3">שמור תורנות</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Shifts