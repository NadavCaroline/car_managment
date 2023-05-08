import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userToken } from '../login/loginSlice'
import { ToastContainer, toast } from 'react-toastify';
import { MaintenanceTypeModel } from '../../models/MaintenanceType'
import { getmaintenanceTypeAsync } from '../maintenanceType/maintenanceTypeSlice';
import { carsSelector, getAllCarsAsync, getCarsAsync } from '../cars/carsSlice';
import { addShiftAsync, shiftError, SetError, shiftMessage, SetMsg, getshiftsAsync, shiftSelector } from '../shifts/shiftsSlice';
import { getUsersOfDepByShiftsAsync, usersSelector } from '../users/userSlicer'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MY_SERVER } from '../../env';
import ShiftModel from '../../models/Shift';
import AvatarMan from '../../images/img_avatar-man.png';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Carousel, Card, Stack, Button } from "react-bootstrap";
import { adminSelector, getProfileAsync, profileSelector } from '../profile/profileSlicer';


const Shifts = () => {
    const dispatch = useAppDispatch()
    const [listMaintenanceType, setListMaintenanceTypes] = useState<MaintenanceTypeModel[]>([]);
    const cars = useAppSelector(carsSelector);
    const shifts = useAppSelector(shiftSelector);
    const token = useAppSelector(userToken)
    const users = useAppSelector(usersSelector)
    const [selectedCar, setSelectedCar] = useState<HTMLElement | null>(null);
    const [selectedUser, setSelectedUser] = useState<string[]>([]);
    const [maintenanceType, setMaintenanceType] = useState<HTMLElement | null>(null);
    const [selectedStartDate, setselectedStartDate] = useState<Dayjs | null>(null)
    const [comments, setComments] = useState("")
    const errorMessage = useAppSelector(shiftError)
    const successMessage = useAppSelector(shiftMessage)
    const [searchTerm, setsearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [numItems, setNumItems] = useState(2);
    const [showForm, setShowForm] = useState(false);
    const isAdmin = useAppSelector(adminSelector)


    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 576) {
                setNumItems(1);
            } else if (width < 768) {
                setNumItems(2);
            } else if (width < 992) {
                setNumItems(3);
            } else {
                setNumItems(4);
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);



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
        rtl: true,
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
        rtl: true,
    });
    const resetForm = () => {
        setselectedStartDate(null)
        setMaintenanceType(null)
        setSelectedUser([]);
        setSelectedCar(null)
        const elements = document.querySelectorAll('.selectedDiv');
        elements.forEach((el) => {
            el.classList.remove('selectedDiv');
        });

    };

    useEffect(() => {
        if (errorMessage && errorMessage !== "")
            messageError(errorMessage)
        dispatch(SetError(""))
    }, [errorMessage])

    useEffect(() => {
        if (successMessage && successMessage !== "") {
            message(successMessage)
            resetForm()
            setShowForm(false); 
        }
        dispatch(SetMsg())
    }, [successMessage])

    useEffect(() => {
        dispatch(getCarsAsync(token))
        dispatch(getmaintenanceTypeAsync(token)).then((res) => setListMaintenanceTypes(res.payload))
        dispatch(getUsersOfDepByShiftsAsync(token))
        dispatch(getshiftsAsync(token))
        // dispatch(getRolesAsync()).then((res) => setListRoles(res.payload))
    }, [])

    useEffect(() => {
        resetSelectedUser();
    }, [maintenanceType])

    // Gets the shifts from the server
    useEffect(() => {
        dispatch(getshiftsAsync(token))
        dispatch(getUsersOfDepByShiftsAsync(token))
    }, [shifts.length])

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
        setIsLoading(true);
        dispatch(addShiftAsync({ token: token, shift: shift })).then((res) => { setIsLoading(false); });
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
        setSelectedUser([]);
    }

    // function handleDivUserClick(event: React.MouseEvent<HTMLDivElement>, numOfClick: number) {
    function handleDivUserClick(event: React.MouseEvent<HTMLElement>, numOfClick: number) {
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
                {/* <div className="mx-auto col-10 col-md-8 col-lg-6"> */}
                {/* <div className="mx-auto col-10 col-md-8"> */}
                <div className="mx-auto col-10">
                {isAdmin && <button onClick={() => setShowForm(!showForm)} style={{ marginRight: "10px" }} className="btn btn-primary btn-block mb-3">הוספת תורנות</button>}
                    { showForm &&
                        <form dir="rtl" id="formAddShifts" onSubmit={onSubmitShifts} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
                            <h4 style={{ color: "rgb(19, 125, 141)", marginRight: "10px", marginBottom: "0px", marginTop: "10px" }} >תאריך תורנות</h4>
                            <div style={{ marginRight: "10px" }}>
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
                            <h4 style={{ color: "rgb(19, 125, 141)", marginRight: "10px", marginBottom: "0px", marginTop: "10px" }} >סוג תורנות</h4>

                            {/* <!-- maintenanceType select --> */}
                            <Carousel indicators={false} touch={true} interval={null}>
                                {[...Array(Math.ceil(listMaintenanceType.length / numItems))].map((_, i) => (
                                    <Carousel.Item key={i} className="px-3">
                                        <div className="row text-center">
                                            {listMaintenanceType
                                                .slice(i * numItems, i * numItems + numItems)
                                                .map((maintenanceType, j) => (
                                                    <div className="col-lg-3 col-md-4 col-sm-6">
                                                        <Card id={`divMaintenance-${maintenanceType.id}`} key={maintenanceType.id} onClick={(event) => handleMaintenanceDivClick(event.currentTarget)} className="notSelectedDiv" style={{ margin: '10px auto' }}>
                                                            <Card.Body>
                                                                <Card.Title> {maintenanceType.name}</Card.Title>
                                                                <img src={MY_SERVER + maintenanceType.imgLogo} style={{ width: '50px', height: '50px' }} alt={"imglogo"} />
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                ))}
                                        </div>
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                            <h4 style={{ color: "rgb(19, 125, 141)", marginRight: "10px", marginBottom: "0px", marginTop: "10px" }} >רכב </h4>
                            {/* <!-- car div --> */}
                            <Carousel indicators={false} touch={true} interval={null}>
                                {[...Array(Math.ceil(cars.length / numItems))].map((_, i) => (
                                    <Carousel.Item key={i} className="px-3">
                                        <div className="row text-center">
                                            {cars
                                                .slice(i * numItems, i * numItems + numItems)
                                                .map((car, j) => (
                                                    <div className="col-lg-3 col-md-4 col-sm-6">
                                                        <Card id={`divCar-${car.id}`} key={car.id} onClick={(event) => handleCarDivClick(event.currentTarget)} className="notSelectedDiv" style={{ margin: '10px auto' }}>
                                                            <Card.Body>
                                                                <Card.Title> {car.nickName} - {car.licenseNum}</Card.Title>
                                                                <Card.Text>
                                                                    מחלקה: {car.dep_name}<br />
                                                                    יצרן: {car.make}<br />
                                                                    דגם: {car.model}<br />
                                                                    צבע: {car.color}<br />
                                                                    שנה: {car.year}   <br />
                                                                </Card.Text>
                                                                <img src={MY_SERVER + car.image} style={{ width: '150px', height: '100px' }} alt={car.model} />
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                ))}
                                        </div>
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                            <h4 style={{ color: "rgb(19, 125, 141)", marginRight: "10px", marginBottom: "0px", marginTop: "10px" }} >משתמש </h4>
                            {/* <!-- users div --> */}
                            <Carousel indicators={false} touch={true} interval={null}>
                                {[...Array(Math.ceil(users.length / numItems))].map((_, i) => (
                                    <Carousel.Item key={i} className="px-3">
                                        <div className="row text-center">
                                            {users
                                                .slice(i * numItems, i * numItems + numItems)
                                                .map((user, j) => (
                                                    <div className="col-lg-3 col-md-4 col-sm-6" >
                                                        {/* <div id={`divUser-${user.id}`} key={user.id} onClick={(event) => { maintenanceType?.id === "divMaintenance-2" ? handleDivUserClick(event, 1) : handleDivUserClick(event, 2) }} className="notSelectedDiv" > */}
                                                        <Card id={`divUser-${user.id}`} key={user.id} onClick={(event) => { maintenanceType?.id === "divMaintenance-2" ? handleDivUserClick(event, 1) : handleDivUserClick(event, 2) }} className="notSelectedDiv" style={{ margin: '10px auto' }}>
                                                            <Card.Body>
                                                                <Card.Title> {user.first_name} {user.last_name}</Card.Title>
                                                                <Card.Text>
                                                                    תורנויות שבוצעו {user.count_shifts}
                                                                </Card.Text>
                                                                <img src={AvatarMan} alt="Avatar" className="avatar" />
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                ))}
                                        </div>
                                    </Carousel.Item>
                                ))}
                            </Carousel>

                            <h4 style={{ color: "rgb(19, 125, 141)", marginRight: "10px", marginBottom: "8px", marginTop: "10px" }} >הערות </h4>

                            {/* <!-- Comment input --> */}
                            <div className="form-floating mb-2">
                                <textarea style={{ width: '100%', marginRight: "10px" }} onChange={(e) => setComments(e.target.value)} id="shiftcomment" rows={3} placeholder="הערות"></textarea>
                            </div>
                            <button type='submit' style={{ marginRight: "10px" }} className="btn btn-primary btn-block mb-3">{isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'שמור תורנות'}</button>
                        </form>
                    }
                    <form dir="rtl" id="formShifts" style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
                        <div style={{ marginTop: '10px' }}>
                            <input placeholder='חיפוש לפי ' onChange={(e) => setsearchTerm(e.target.value)} style={{ width: '300px', left: '150px' }} />
                            <h1> תורנויות עתידיות </h1><hr />
                            <table style={{ marginLeft: "auto", marginRight: "auto", marginTop: '10px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black', padding: '5px' }}>סוג תורנות</th>
                                        <th style={{ border: '1px solid black', padding: '5px' }}>תאריך תורנות</th>
                                        <th style={{ border: '1px solid black', padding: '5px' }}>רכב</th>
                                        <th style={{ border: '1px solid black', padding: '5px' }}>עובד 1</th>
                                        <th style={{ border: '1px solid black', padding: '5px' }}>עובד 2</th>
                                        <th style={{ border: '1px solid black', padding: '5px' }}>הערות</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {shifts && shifts.filter(shift => (shift.maintenance_name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                                        shift.user_name1?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                                        shift.user_name2?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) && new Date(shift.shiftDate!).getDate() >= new Date().getDate()
                                    ).map(shift =>
                                        <tr key={shift.id} style={{ cursor: 'pointer' }}>
                                            <td style={{ border: '1px solid black', padding: '5px' }}>{shift.maintenance_name}</td>
                                            <td style={{ border: '1px solid black', padding: '5px' }}>{dayjs(shift.shiftDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}</td>
                                            <td style={{ border: '1px solid black', padding: '5px' }}>{shift.car_name}</td >
                                            <td style={{ border: '1px solid black', padding: '5px' }}>{shift.user_name1}</td>
                                            <td style={{ border: '1px solid black', padding: '5px' }}>{shift.user_name2}</td>
                                            <td style={{ border: '1px solid black', padding: '5px' }}>{shift.comments}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <h1> תורנויות קודמות </h1><hr />
                            <table style={{ marginLeft: "auto", marginRight: "auto", marginTop: '10px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black', padding: '5px' }}>סוג תורנות</th>
                                        <th style={{ border: '1px solid black', padding: '5px' }}>תאריך תורנות</th>
                                        <th style={{ border: '1px solid black', padding: '5px' }}>רכב</th>
                                        <th style={{ border: '1px solid black', padding: '5px' }}>עובד 1</th>
                                        <th style={{ border: '1px solid black', padding: '5px' }}>עובד 2</th>
                                        <th style={{ border: '1px solid black', padding: '5px' }}>הערות</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {shifts && shifts.filter(shift => (shift.maintenance_name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                                        shift.user_name1?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                                        shift.user_name2?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) && new Date(shift.shiftDate!).getDate() < new Date().getDate()
                                    ).map(shift =>
                                        <tr key={shift.id} style={{ cursor: 'pointer' }}>
                                            <td style={{ border: '1px solid black', padding: '5px' }}>{shift.maintenance_name}</td>
                                            <td style={{ border: '1px solid black', padding: '5px' }}>{dayjs(shift.shiftDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}</td>
                                            <td style={{ border: '1px solid black', padding: '5px' }}>{shift.car_name}</td >
                                            <td style={{ border: '1px solid black', padding: '5px' }}>{shift.user_name1}</td>
                                            <td style={{ border: '1px solid black', padding: '5px' }}>{shift.user_name2}</td>
                                            <td style={{ border: '1px solid black', padding: '5px' }}>{shift.comments}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div >

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Shifts