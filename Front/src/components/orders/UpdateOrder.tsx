import React, { useEffect, useState } from 'react'
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { userAccess } from '../login/loginSlice';
import { MY_SERVER, MaxDayOrderAdvance } from '../../env';
import CarModel from '../../models/Car';
import { ToastContainer, toast } from 'react-toastify';
import { addOrderAsync, availableCarsSelector, checkOrderDatesAsync, checkOrderUpdateDatesAsync, notAvilableSelector, orderDetailsSelector, updateOrderAsync } from './OrdersSlice';
import jwt_decode from "jwt-decode"
import { getNotificationAsync } from '../notifications/notificationsSlice';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const UpdateOrder = (props: any) => {
    const selectedOrder = props.selectedOrder
    const dispatch = useAppDispatch()
    const token = useAppSelector(userAccess)
    const availableCars = useAppSelector(availableCarsSelector)
    const notAvailableCars = useAppSelector(notAvilableSelector)
    const orderDetails = useAppSelector(orderDetailsSelector)
    const decoded: any = jwt_decode(token)
    const [selectedCar, setselectedCar] = useState<CarModel | null>(null)
    const [isAllDay, setisAllDay] = useState(false)
    const [selectedStartDate, setselectedStartDate] = useState<Dayjs | null>(null)
    const [selectedEndDate, setselectedEndDate] = useState<Dayjs | null>(null)
    const [formatedEndDate, setformatedEndDate] = useState("")
    const [moreThanDay, setmoreThanDay] = useState(false)
    const [formatedStartDate, setformatedStartDate] = useState("")
    const [startTime, setstartTime] = useState<string>("")
    const [endTime, setendTime] = useState<string>("")
    const [fromDate, setfromDate] = useState<Date>(new Date())
    const [toDate, settoDate] = useState<Date>(new Date())
    const [destination, setdestination] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setsearched] = useState(false)


    const resetFrom = () => {
        // setdestination("")
        // setstartTime("")
        // setendTime("")
        // setselectedStartDate(null)
        // setselectedEndDate(null)
        // setisAllDay(false)
        // setmoreThanDay(false)
        setsearched(false)
    }


    // This function handles the start date of the order.
    const handleStartDateChange = (date: Dayjs | null) => {
        setselectedStartDate(date)
        setformatedStartDate(date!.format('DD-MM-YYYY'))
    }
    // This function handles the end date of the order.
    const handleEndDateChange = (date: Dayjs | null) => {
        setselectedEndDate(date)
        setformatedEndDate(date!.format('DD-MM-YYYY'))
    }

    // This function hanldes the change if the order is all day long - or not.
    const handleIsAllDay = () => {
        setisAllDay(!isAllDay)
        console.log(isAllDay)
        if (!isAllDay) {
            setstartTime("")
            setendTime("")
        }
    }
    // This function hanldes the change if the order is more than one day long - or not.
    const handleMoreThanday = () => {
        setmoreThanDay(!moreThanDay)
        if (moreThanDay) {
            setformatedEndDate("")
            setselectedEndDate(null)
        }
    }
    // This funcition handles the form of the dates that are sent to the server
    // To check the avaliable cars.
    const checkOrders = () => {
        const [startday, startmonth, startyear] = formatedStartDate.split('-').map(Number);
        const [endday, endmonth, endyear] = formatedEndDate.split('-').map(Number);
        const [starthours, startminutes] = startTime.split(':').map(Number);
        const [endhours, endminutes] = endTime.split(':').map(Number);
        let start_date = new Date()
        let end_date = new Date()
        if (isAllDay) {
            moreThanDay ? end_date = new Date(endyear, endmonth - 1, endday) : end_date = new Date(startyear, startmonth - 1, startday)
            start_date = new Date(startyear, startmonth - 1, startday)
            start_date.setHours(0, 0, 0, 0)
            end_date.setHours(23, 59, 0, 0)
        }
        else {
            moreThanDay ? end_date = new Date(endyear, endmonth - 1, endday, endhours, endminutes) : end_date = new Date(startyear, startmonth - 1, startday, endhours, endminutes)
            start_date = new Date(startyear, startmonth - 1, startday, starthours, startminutes)
            if (new Date().getTime() > (start_date.getTime())) {
                messageError('יש להכניס זמנים מאוחרים יותר')
                return;
            }
            if (start_date.getTime() > end_date.getTime()) {
                messageError('שעת סיום מוקדמת משעת התחלה')
                return;
            }
        }

        setIsLoading(true);
        setfromDate(start_date);
        settoDate(end_date);
        dispatch(checkOrderUpdateDatesAsync({ token: token, dates: { fromDate: start_date, toDate: end_date, isAllDay: isAllDay }, id: selectedOrder.id })).then((res) => { setIsLoading(false); dispatch(getNotificationAsync(token)); });
        setsearched(true);
    }

    // This function is responsible for the validation of the inputs for the order
    const onSubmitValid = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formatedStartDate && !moreThanDay) {
            messageError('יש להכניס תאריך נסיעה')
            return;
        }
        if (moreThanDay && (!formatedStartDate || !formatedEndDate)) {
            messageError('יש להכניס תאריך התחלה וסיום')
            return;
        }
        if (!isAllDay && (!startTime || !endTime)) {
            messageError('יש להכניס שעת התחלה ושעת סיום')
            return;
        }
        if (!destination) {
            messageError('יש להכניס יעד נסיעה')
            return;
        }

        checkOrders()
    };

    // This function handles the 
    const handleUpdateOrder = () => {
        if (((!startTime || !endTime) && !isAllDay) || (!formatedEndDate && moreThanDay)) {
            messageError('יש לוודא שהפרטים שהוזנו נכונים')
            return;
        }
        // console.log({ orderDate: new Date(), fromDate: fromDate, toDate: toDate, isAllDay: isAllDay, user: decoded.user_id, car: selectedCar?.id!, destination, ended: false })
        dispatch(updateOrderAsync({
            token: token, id: selectedOrder.id,
            order: { orderDate: new Date(), fromDate: fromDate, toDate: toDate, isAllDay: isAllDay, user: decoded.user_id, car: selectedCar?.id!, destination, ended: false }
        })).then((res) => {
            setIsLoading(false); dispatch(getNotificationAsync(token));
            res.meta.requestStatus === "fulfilled" && message('ההזמנתך התקבלה בהצלחה!');
            res.meta.requestStatus === "rejected" && messageError('ארעה שגיאה בהזמנתך. יש לוודא שהפרטים שהוזנו נכונים. ');
        });
        setsearched(false)
        setTimeout(() => {
            props.setselectedOrder(null);
        }, 2000);
    }
    // This function handles the toastify error messages.
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

    // This function handles the toastify success messages.
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

    return (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100vh', backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'right' }}>
            <div style={{ position: 'relative', padding: '32px', marginTop: '10px', width: '90%', maxWidth: '90%', maxHeight: '90%', overflowY: 'auto', backgroundColor: 'white', border: '2px solid black', borderRadius: '5px', textAlign: 'right' }}>
                <ToastContainer position="top-left" newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
                <button style={{ position: "absolute", top: "0", right: "0" }} onClick={() => props.setselectedOrder(null)}>X</button>
                {!searched ?
                    <form onSubmit={onSubmitValid}>
                        <table align="center" bgcolor="fff" style={{ width: '100%', backgroundColor: '#fff' }} >
                            <tr>
                                <td style={{ display: 'inline-block', padding: '5px' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker', 'MobileTimePicker']}>
                                            {/* Date Picking Component */}
                                            <div style={{ marginRight: '10px', marginLeft: '10px' }}>
                                                <DemoItem>
                                                    מתאריך:
                                                    <DatePicker
                                                        minDate={dayjs()}
                                                        maxDate={dayjs().add(MaxDayOrderAdvance, 'day')}
                                                        format="DD-MM-YYYY"
                                                        value={selectedStartDate}
                                                        onChange={handleStartDateChange}
                                                    />
                                                </DemoItem>
                                            </div>

                                            {/* Time Picking Components */}
                                            {moreThanDay && (
                                                <div style={{ marginLeft: '10px' }}>
                                                    <DemoItem>
                                                        עד תאריך:
                                                        <DatePicker
                                                            minDate={selectedStartDate!}
                                                            maxDate={dayjs().add(MaxDayOrderAdvance, 'day')}
                                                            format="DD-MM-YYYY"
                                                            value={selectedEndDate}
                                                            onChange={handleEndDateChange}
                                                        />
                                                    </DemoItem>
                                                </div>
                                            )}
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </td>
                                <td style={{ display: 'inline-block', padding: '5px' }}>
                                    {!isAllDay &&
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ marginLeft: '10px' }}>
                                                משעה:<br />
                                                <input value={startTime} type='time' onChange={(e) => setstartTime(e.target.value)} style={{ height: '56px', borderRadius: '3px', borderWidth: '1px', fontSize: '17px' }} />
                                            </div>
                                            <div>
                                                עד שעה:<br />
                                                <input value={endTime} type='time' min={startTime} onChange={(e) => setendTime(e.target.value)} style={{ height: '56px', borderRadius: '3px', marginLeft: '10px', borderWidth: '1px', fontSize: '17px' }} />
                                            </div>
                                        </div>
                                    }
                                </td>
                                <td style={{ display: 'inline-block', padding: '5px' }}>
                                    <div>
                                        יעד:<br />
                                        <input value={destination} onChange={(e) => setdestination(e.target.value)} style={{ height: '56px', borderRadius: '3px', borderWidth: '1px', fontSize: '17px' }} />
                                    </div>
                                </td>
                                <td style={{ display: 'inline-block', padding: '5px', marginTop: '20px' }}>
                                    <div className="form-check">
                                        <input checked={isAllDay} onChange={() => handleIsAllDay()} className="form-check-input" style={{ direction: "rtl" }} type="checkbox" value="" id="flexCheckDisabled" />
                                        <label className="form-check-label" htmlFor="flexCheckDisabled">
                                            יום שלם                    </label>
                                    </div>
                                    <div className="form-check">
                                        <input checked={moreThanDay} onChange={() => handleMoreThanday()} className="form-check-input" type="checkbox" style={{ direction: "rtl" }} value="" id="flexCheckCheckedDisabled" />
                                        <label className="form-check-label" htmlFor="flexCheckCheckedDisabled">
                                            יותר מיום אחד
                                        </label>
                                    </div>
                                </td>

                                <td style={{ display: 'inline-block', padding: '5px' }}>
                                    <button type='submit' style={{ marginRight: "10px", marginTop: '33px' }} className="btn btn-primary btn-block mb-3">{isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'חפש מכוניות'}</button>
                                </td>
                            </tr>

                        </table>


                    </form> :
                    <div>
                        <table align="center" bgcolor="fff" style={{ width: '100%', backgroundColor: '#fff' }} >
                            <tr>
                                <td style={{ display: 'inline-block', padding: '5px' }}>
                                    {moreThanDay && formatedStartDate && (
                                        <div style={{ padding: '10px', flex: '1' }}>
                                            <b>מתאריך:</b> {formatedStartDate}
                                        </div>
                                    )}
                                </td>
                                <td style={{ display: 'inline-block', padding: '5px' }}>
                                    {moreThanDay && formatedEndDate && (
                                        <div style={{ padding: '10px', flex: '1' }}>
                                            <b>עד תאריך:</b> {formatedEndDate}
                                        </div>
                                    )}
                                </td>

                                <td style={{ display: 'inline-block', padding: '5px' }}>
                                    {!moreThanDay && formatedStartDate && (
                                        <div style={{ padding: '10px', flex: '1' }}>
                                            <b>בתאריך:</b> {formatedStartDate}
                                        </div>
                                    )}
                                </td>

                                <td style={{ display: 'inline-block', padding: '5px' }}>
                                    {!isAllDay ? (
                                        <div style={{ display: 'flex', flex: '2' }}>
                                            {startTime && (
                                                <div style={{ padding: '10px' }}>
                                                    <b>משעה:</b> {startTime}
                                                </div>
                                            )}
                                            {endTime && (
                                                <div style={{ padding: '10px' }}>
                                                    <b>עד שעה:</b> {endTime}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <b style={{ flex: '6', padding: '10px' }}>כל היום</b>
                                    )}
                                </td>
                                <td style={{ display: 'inline-block', padding: '5px' }}>
                                    <b>יעד:</b> {destination}
                                </td>
                                <td style={{ display: 'inline-block', padding: '5px' }}>
                                    <button
                                        onClick={() => resetFrom()}
                                        style={{ marginLeft: '2px', marginTop: '10px' }}
                                        className="btn btn-primary btn-block mb-3">
                                        שנה פרטי הזמנה
                                    </button>
                                </td>
                            </tr>
                        </table>
                        {/* Display The cars */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
                            {availableCars.map(car =>
                                <div key={car.id} style={{ borderRadius: '5px', border: '2px solid #dee2e6', padding: '.5rem' }} onClick={() => setselectedCar(car)}>
                                    <div style={{ textAlign: 'center' }}>
                                        <table style={{ width: '100%', fontSize: '1.25rem' }}>
                                            <tr>
                                                <td>
                                                    {car.nickName} <br /> {car.licenseNum}
                                                </td>

                                            </tr>
                                        </table>

                                        יצרן: {car.make}<br />
                                        דגם: {car.model}<br />
                                        צבע: {car.color}<br />
                                        שנה: {car.year}<br />
                                        {/* לוחית רישוי: {car.licenseNum}<br /> */}
                                        <img src={MY_SERVER + car.image} style={{ width: '150px', height: '100px' }} alt={car.model} /><br />
                                        {orderDetails && orderDetails.filter(order => order.car === car.id).map((order, i) => <div key={i}>
                                            <h5 style={{ color: "red" }}>
                                                {order.maintenance}
                                            </h5>
                                        </div>
                                        )}
                                        <button className="btn btn-primary" onClick={() => handleUpdateOrder()}>הזמן מכונית</button>
                                    </div>
                                </div>)}
                        </div>
                        {
                            notAvailableCars.length > 0 &&
                            <div>
                                <hr />
                                <h3 style={{ color: 'rgb(19, 125, 141)' }}>לא זמינות</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
                                    {notAvailableCars.map(car =>
                                        <div key={car.id} style={{ borderRadius: '5px', border: '2px solid rgb(222, 226, 230)', padding: '.5rem' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                יצרן: {car.make}<br />
                                                דגם: {car.model}<br />
                                                צבע: {car.color}<br />
                                                שנה: {car.year}<br />
                                                לוחית רישוי: {car.licenseNum}<br />
                                                <img src={MY_SERVER + car.image} style={{ width: '150px', height: '100px' }} alt={car.model} /><br />
                                                <div>
                                                    <hr />
                                                    {orderDetails && orderDetails.filter(order => order.car === car.id).map((order, i) => <div key={i}>
                                                        {order.maintenance ?
                                                            <div>
                                                                <h5>
                                                                    {order.maintenance}
                                                                </h5>
                                                            </div> :
                                                            <div>
                                                                <h5 style={{ color: 'red' }}>הזמנה תפוסה</h5>
                                                                {order.fromDate!.toString().slice(0, 10) !== order.toDate!.toString().slice(0, 10) ?
                                                                    <div style={{ textAlign: 'left' }}>
                                                                        מתאריך: {order.fromDate!.toString().slice(0, 10)}<br />
                                                                        עד תאריך: {order.toDate!.toString().slice(0, 10)}<br />
                                                                    </div> :
                                                                    <div>
                                                                        בתאריך: {order.fromDate!.toString().slice(0, 10)}<br />
                                                                    </div>
                                                                }

                                                                {!order.isAllDay ?
                                                                    <div> משעה: {order.fromDate!.toString().slice(11, 16)}<br />
                                                                        עד שעה: {order.toDate!.toString().slice(11, 16)}</div> :
                                                                    <div>כל היום</div>
                                                                }
                                                            </div>
                                                        }
                                                    </div>)}
                                                </div>
                                            </div>
                                        </div>)}
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default UpdateOrder