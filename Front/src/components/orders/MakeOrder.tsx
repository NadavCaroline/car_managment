import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess, userToken } from '../login/loginSlice';
import { addOrderAsync, availableCarsSelector, checkOrderDatesAsync, getOrdersAsync, notAvilableSelector, orderDetailsSelector, ordersSelector } from './OrdersSlice';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import jwt_decode from "jwt-decode"
import CarModel from '../../models/Car';
import { MY_SERVER } from '../../env';

const MakeOrder = () => {
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
  const [startTime, setstartTime] = useState<Dayjs | null>(null)
  const [formatedStartTime, setformatedStartTime] = useState("")
  const [endTime, setendTime] = useState<Dayjs | null>(null)
  const [formatedEndTime, setformatedEndTime] = useState("")
  const [fromDate, setfromDate] = useState<Date>(new Date())
  const [toDate, settoDate] = useState<Date>(new Date())
  const [refreshFlag, setrefreshFlag] = useState(false)
  const [datesFlag, setdatesFlag] = useState(false)
  const [destination, setdestination] = useState("")

  // This function handles the date of the car rent
  const handleStartDateChange = (date: Dayjs | null) => {
    setselectedStartDate(date)
    setformatedStartDate(date!.format('DD-MM-YYYY'))
    setselectedEndDate(date)
    setformatedEndDate(date!.format('DD-MM-YYYY'))
    setrefreshFlag(!refreshFlag)
  }

  const handleEndDateChange = (date: Dayjs | null) => {
    setselectedEndDate(date)
    setformatedEndDate(date!.format('DD-MM-YYYY'))
    setrefreshFlag(!refreshFlag)
  }

  // This functions handles the start time of the order
  const handleStartTimeChange = (time: Dayjs | null) => {
    if (endTime) {
      setendTime(time)
    }
    setstartTime(time)
    setformatedStartTime(time!.format('HH:mm:ss'))
    setrefreshFlag(!refreshFlag)
  }
  // This functions handles the retrun time of the car
  const handleEndTimeChange = (time: Dayjs | null) => {
    if (!(time!.format('HH:mm:ss') < formatedStartTime)) {
      setendTime(time)
      setformatedEndTime(time!.format('HH:mm:ss'))
      setrefreshFlag(!refreshFlag)
    }
  }
  const handleIsAllDay = () => {
    setisAllDay(!isAllDay)
    setrefreshFlag(!refreshFlag)
  }
  const handleMoreThanday = () => {
    setmoreThanDay(!moreThanDay)
    setrefreshFlag(!refreshFlag)
  }

  // useEffect(() => {
  //  console.log(orderDetails)
  // }, [])
  
  // Keep in mind, the timezone in israel is 2 hours ahead.
  const handleDateTimeVar = () => {
    const [startday, startmonth, startyear] = formatedStartDate.split('-').map(Number);
    const [endday, endmonth, endyear] = formatedEndDate.split('-').map(Number);
    const [starthours, startminutes, startseconds] = formatedStartTime.split(':').map(Number);
    const [endhours, endminutes, endseconds] = formatedEndTime.split(':').map(Number);

    if (!isAllDay) {
      const start_date = new Date(startyear, startmonth - 1, startday, starthours, startminutes, startseconds)
      const end_date = new Date(endyear, endmonth - 1, endday, endhours, endminutes, endseconds)
      setfromDate(start_date)
      settoDate(end_date)
      setdatesFlag(!datesFlag)
    }
    if (isAllDay) {
      const start_date = new Date(startyear, startmonth - 1, startday)
      start_date.setHours(0, 0, 0, 0)
      const end_date = new Date(endyear, endmonth - 1, endday)
      end_date.setHours(23, 59, 0, 0)
      setfromDate(start_date)
      settoDate(end_date)
      setdatesFlag(!datesFlag)
    }
  }
  useEffect(() => {
    if ((formatedStartDate && formatedStartTime && formatedEndTime) ||
      (formatedStartDate && isAllDay)) {
      handleDateTimeVar()
    }
  }, [refreshFlag])


  useEffect(() => {
    if ((formatedStartDate && formatedEndDate && formatedStartTime && formatedEndTime) ||
      (formatedStartDate && formatedEndDate && isAllDay)) {
      dispatch(checkOrderDatesAsync({ token: token, dates: { fromDate: fromDate, toDate: toDate, isAllDay: isAllDay } }))
    }
  }, [datesFlag, formatedStartTime, formatedEndTime])

  const handleOrder = () => {
    // console.log({ orderDate: new Date(), fromDate: fromDate, toDate: toDate, isAllDay: isAllDay, user: decoded.user_id, car: selectedCar?.id!, destination, ended: false })
    dispatch(addOrderAsync({ token: token, order: { orderDate: new Date(), fromDate: fromDate, toDate: toDate, isAllDay: isAllDay, user: decoded.user_id, car: selectedCar?.id!, destination, ended: false } }))
    setselectedCar(null)
  }

  return (
    <div style={{ margin: '10px' }}>
      יום שלם: <input defaultChecked={false} type={'checkbox'} onChange={() => handleIsAllDay()} />
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
            </DemoItem><br /><br />
            {/* Time Picking Components */}
            יותר מיום אחד?<input defaultChecked={false} type={'checkbox'} onChange={() => handleMoreThanday()} /><br />
            {moreThanDay &&
              <div>
                <DemoItem >
                  <DatePicker
                    minDate={dayjs()}
                    format='DD-MM-YYYY'
                    value={selectedEndDate}
                    onChange={handleEndDateChange} />
                </DemoItem><br /><br />
              </div>

            }
            <DemoItem >
              {!isAllDay &&
                <div>
                  <div> משעה:</div>
                  <div style={{ direction: "ltr" }}>
                    <MobileTimePicker value={startTime} ampm={false} onChange={handleStartTimeChange} />
                  </div>
                  <div>עד שעה:</div>
                  <div style={{ direction: "ltr" }}>
                    <MobileTimePicker value={endTime} ampm={false} onChange={handleEndTimeChange} />
                  </div>
                </div>}
            </DemoItem>
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <div style={{ marginBottom: '10px' }}>
        {formatedStartDate &&
          <div>
            <b>מתאריך:</b>
            {formatedStartDate}
          </div>}<br />
        {formatedEndDate &&
          <div>
            <b>עד תאריך: </b>
            {formatedEndDate}
          </div>}<br />
        {formatedStartTime &&
          <div>
            <b>משעה:</b>
            {formatedStartTime.slice(0, -3)}
          </div>}
        {formatedEndTime &&
          <div>
            <b>עד שעה:</b>
            {formatedEndTime.slice(0, -3)}
          </div>}
        {isAllDay &&
          <div>
            <b>כל היום</b>
          </div>}
      </div>
      {/* Display The cars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
        {availableCars.map(car =>
          <div key={car.id} style={{ borderRadius: '5px', border: '2px solid rgb(0, 0, 0)', padding: '.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              מחלקה: {car.dep_name}<br />
              יצרן: {car.make}<br />
              דגם: {car.model}<br />
              צבע: {car.color}<br />
              שנה: {car.year}   <br />
              <img src={MY_SERVER + car.image} style={{ width: '150px', height: '100px' }} alt={car.model} /><br />
              <button onClick={() => setselectedCar(car)}>הזמן מכונית</button>
            </div>
          </div>)}
      </div>
      {notAvailableCars.length > 0 &&
        <div>
          <hr />
          <h3>לא זמינות</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
            {notAvailableCars.map(car =>
              <div key={car.id} style={{ borderRadius: '5px', border: '2px solid rgb(0, 0, 0)', padding: '.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  מחלקה: {car.dep_name}<br />
                  יצרן: {car.make}<br />
                  דגם: {car.model}<br />
                  צבע: {car.color}<br />
                  שנה: {car.year}   <br />
                  <img src={MY_SERVER + car.image} style={{ width: '150px', height: '100px' }} alt={car.model} /><br />
                  <h4>פרטי הזמנה</h4>
                  <div>
                    <hr />
                    {orderDetails && orderDetails.filter(order => order.car === car.id).map((order, i) => <div key={i}>
                      מתאריך: {order.fromDate!.toString().slice(0, 10)}<br />
                      {order.fromDate!.toString().slice(0, 10) !== order.toDate!.toString().slice(0, 10) &&
                        <div>
                          עד תאריך: {order.toDate!.toString().slice(0, 10)}<br />
                        </div>
                      }
                      <div> משעה: {order.fromDate!.toString().slice(11, 16)}<br />
                        עד שעה: {order.toDate!.toString().slice(11, 16)}</div>
                    </div>)}
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      }
      {selectedCar &&
        <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100vh", backgroundColor: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "relative", padding: "32px", width: "400px", height: "300px", maxWidth: "640px", backgroundColor: "white", border: "2px solid black", borderRadius: "5px" }}>
            <img src={MY_SERVER + selectedCar.image} style={{ width: '150px', height: '100px' }} alt={selectedCar.model} /><br /><br />
            <form>
            יעד נסיעה: <input onChange={(e) => setdestination(e.target.value)} />
            <button type={'submit'} onClick={() => handleOrder()}>הזמן</button>
            </form>
          </div>
        </div>
      }
    </div >
  )
}

export default MakeOrder