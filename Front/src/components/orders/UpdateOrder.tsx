import React, { useState } from 'react'
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

const UpdateOrder = (props: any) => {
    const token = useAppSelector(userAccess);
    const dispatch = useAppDispatch();
    const selectedOrder = props.selectedOrder
    const [newStartDate, setnewStartDate] = useState<Dayjs | null>(null)
    const [StartDateChangeState, setStartDatechangeState] = useState(false)
    const [newEndDate, setnewEndDate] = useState<Dayjs | null>(null)
    const [EndDateChangeState, setEndDatechangeState] = useState(false)
    const [newStartTime, setnewStartTime] = useState("")
    const [StartTimeChangeState, setStartTimechangeState] = useState(false)
    const [newEndTime, setnewEndTime] = useState("")
    const [EndTimeChangeState, setEndTimechangeState] = useState(false)
    const [newDestination, setnewDestination] = useState("")
    const [DestinationChangeState, setDestinationchangeState] = useState(false)
    const [newCar, setnewCar] = useState<CarModel | null>(null)
    const [CarChangeState, setCarchangeState] = useState(false)

    // This function handles the start date of the order.
    const handleStartDateChange = (date: Dayjs | null) => {
        setnewStartDate(date)
        // setformatedStartDate(date!.format('DD-MM-YYYY'))
    }
    // This function handles the end date of the order.
    const handleEndDateChange = (date: Dayjs | null) => {
        setnewEndDate(date)
        // setformatedEndDate(date!.format('DD-MM-YYYY'))
    }


    const handleBothDates = () => {
        setStartDatechangeState(true)
        setEndDatechangeState(true)
    }
    return (
        <div style={{
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100vh', backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{ position: 'relative', padding: '32px', width: '420px', maxWidth: '90%', maxHeight: '90%', overflowY: 'auto', backgroundColor: 'white', border: '2px solid black', borderRadius: '5px', textAlign: 'center' }}>
                <button style={{ position: "absolute", top: "0", right: "0" }} onClick={() => props.setselectedOrder(null)}>X</button>
                <div>
                    {CarChangeState ?
                        <div>
                            <input />
                            <button onClick={() => setCarchangeState(false)}>שמור</button>
                        </div>
                        :
                        !newCar ?
                            <div onClick={() => setCarchangeState(true)}>
                                מכונית: {selectedOrder.car_name}<br />
                            </div> :
                            <div>

                            </div>
                    }

                </div>
                {selectedOrder.fromDate!.toString().slice(0, 10) !== selectedOrder.toDate!.toString().slice(0, 10) ?
                    <div>
                        {StartDateChangeState ?
                            <div>
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
                                                    value={newStartDate}
                                                    onChange={handleStartDateChange}
                                                />
                                            </DemoItem>
                                        </div>

                                        {/* Time Picking Components */}

                                        <div style={{ marginLeft: '10px' }}>
                                            <DemoItem>
                                                עד תאריך:
                                                <DatePicker
                                                    minDate={newStartDate!}
                                                    maxDate={dayjs().add(MaxDayOrderAdvance, 'day')}
                                                    format="DD-MM-YYYY"
                                                    value={newEndDate}
                                                    onChange={handleEndDateChange}
                                                />
                                            </DemoItem>
                                        </div>

                                    </DemoContainer>
                                </LocalizationProvider>
                            </div> :
                            <div onClick={() => handleBothDates()} style={{cursor: 'pointer'}}>
                                מתאריך: {selectedOrder.fromDate!.toString().slice(0, 10)}<br />
                                עד תאריך: {selectedOrder.toDate!.toString().slice(0, 10)}<br />
                            </div>
                        }
                    </div> :
                    <div>
                        בתאריך: {selectedOrder.fromDate!.toString().slice(0, 10)}<br />
                    </div>
                }
                {selectedOrder.isAllDay ? <div> כל היום</div> :
                    <div> משעה: {selectedOrder.fromDate!.toString().slice(11, 16)}<br />
                        עד שעה: {selectedOrder.toDate!.toString().slice(11, 16)}</div>
                }
                יעד: {selectedOrder.destination}<br />
                <img src={MY_SERVER + selectedOrder.car_image} style={{ width: '170px', height: '100px' }} alt={selectedOrder.car_name} /><br />
            </div>
        </div>
    )
}

export default UpdateOrder