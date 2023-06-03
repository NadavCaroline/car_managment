import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess } from '../login/loginSlice'
import { drivesSelector, getDrivesAsync, updateDriveAsync } from './drivesSlicer'
import { DriveModel } from '../../models/Drive';
import { MY_SERVER } from '../../env';
import { ToastContainer, toast } from 'react-toastify';

const UpdateDrive = (props: any) => {
    const selectedDrive = props.selectedDrive
    const dispatch = useAppDispatch()
    const token = useAppSelector(userAccess)
    const updateDriveModel: DriveModel = {}
    const [startDate, setstartDate] = useState(selectedDrive?.startDate.slice(0, 10)!)
    const [endDate, setendDate] = useState(selectedDrive?.endDate.slice(0, 10)!)
    const [startTime, setstartTime] = useState(selectedDrive?.startDate.slice(11, 16)!)
    const [endTime, setendTime] = useState(selectedDrive?.endDate.slice(11, 16)!)
    const [startKilo, setstartKilo] = useState(selectedDrive?.startKilometer!)
    const [endKilo, setendKilo] = useState(selectedDrive?.endKilometer!)
    const [comments, setcomments] = useState(selectedDrive?.comments!)
    const [startSelectedFile1, setstartSelectedFile1] = useState<File | null>(null)
    const [startSelectedFile2, setstartSelectedFile2] = useState<File | null>(null)
    const [startSelectedFile3, setstartSelectedFile3] = useState<File | null>(null)
    const [endSelectedFile1, setendSelectedFile1] = useState<File | null>(null)
    const [endSelectedFile2, setendSelectedFile2] = useState<File | null>(null)
    const [endSelectedFile3, setendSelectedFile3] = useState<File | null>(null)

    // Handles image 1 upload
    const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setstartSelectedFile1(e.target!.files![0])
    };

    // Handles image 2 upload
    const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setstartSelectedFile2(e.target!.files![0])
    };
    // Handles image 3 upload
    const handleFile3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setstartSelectedFile3(e.target!.files![0])
    };

    // Handles image 1 upload
    const handleendFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setendSelectedFile1(e.target!.files![0])
    };
    // Handles image 2 upload
    const handleendFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setendSelectedFile2(e.target!.files![0])
    };
    // Handles image 3 upload
    const handleendFile3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setendSelectedFile3(e.target!.files![0])
    };

    const handleDateTimeVar = () => {

        const [startyear, startmonth, startday] = startDate.split('-').map(Number);
        const [starthours, startminutes, startseconds] = startTime.split(':').map(Number);
        const [endyear, endmonth, endday] = endDate.split('-').map(Number);
        const [endhours, endminutes, endseconds] = endTime.split(':').map(Number);
        // Handles the start DateTime

        updateDriveModel.startDate = new Date(startyear, startmonth - 1, startday, starthours, startminutes)
        updateDriveModel.endDate = new Date(endyear, endmonth - 1, endday, endhours, endminutes)

    }
    // Forms the data to prepare the request to the server
    const formDriveDate = () => {
        handleDateTimeVar()
        startKilo && (updateDriveModel.startKilometer = startKilo)
        endKilo && (updateDriveModel.endKilometer = endKilo)
        comments && (updateDriveModel.comments = comments)
        startSelectedFile1 && (updateDriveModel.startImg1 = startSelectedFile1)
        startSelectedFile2 && (updateDriveModel.startImg2 = startSelectedFile2)
        startSelectedFile3 && (updateDriveModel.startImg3 = startSelectedFile3)
        endSelectedFile1 && (updateDriveModel.endImg1 = endSelectedFile1)
        endSelectedFile2 && (updateDriveModel.endImg1 = endSelectedFile2)
        endSelectedFile3 && (updateDriveModel.endImg1 = endSelectedFile3)
        updateDriveModel && (updateDriveModel.id = selectedDrive?.id)

    }
    const handleDriveUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (endKilo <= startKilo) {
            messageError("יש להכיס ערכי קילומטראז' תקינים")
            return;
        }
        formDriveDate()
        if ( new Date(updateDriveModel.startDate!).getTime() > new Date(updateDriveModel.endDate!).getTime()) {
            messageError("יש להכניס שעת סיום מאוחרת משעת התחלה")
            return;
        }
        dispatch(updateDriveAsync({
            token: token,
            drive: updateDriveModel
        }))
        message('העדכון התבצע בהצלחה')

        dispatch(getDrivesAsync(token))
        props.setselectedDrive(null)
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
        // We Check if the drive has fields to update, or maybe it is empty, and the user needs to send new data
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

            {/* The second case, in which the user need to fill the fields, because they don't exist. */}
            <div>
                <div style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{
                        position: 'relative',
                        padding: '32px',
                        width: '420px',
                        maxWidth: '90%',
                        maxHeight: '90%',
                        overflowY: 'auto',
                        backgroundColor: 'white',
                        border: '2px solid black',
                        borderRadius: '5px',
                        textAlign: 'left'
                    }}>
                        <button style={{ position: "absolute", top: "0", right: "0" }} onClick={() => props.setselectedDrive(null)}>X</button>
                        <form onSubmit={handleDriveUpdate}>
                            <button type='submit' className="btn btn-primary btn-block mb-3">שמור</button>
                            <img src={MY_SERVER + selectedDrive?.car_image} style={{ width: '150px', height: '100px' }} alt={selectedDrive?.car_name} /><br /><br />
                            <div>
                                מתאריך: <input type='date' onChange={(e) => setstartDate(e.target.value)} value={startDate} /> <br />
                                עד תאריך:<input type='date' min={startDate} onChange={(e) => setendDate(e.target.value)} value={endDate} /><br />
                            </div>

                            משעה:<input type='time' onChange={(e) => setstartTime(e.target.value)} value={startTime} /> <br />
                            עד שעה:<input type='time' onChange={(e) => setendTime(e.target.value)} value={endTime} /> <br />
                            קילומטראז' התחלתי:<input onChange={(e) => setstartKilo(e.target.value)} value={startKilo} /><br />
                            קילומטראז' סופי: <input onChange={(e) => setendKilo(e.target.value)} value={endKilo} /><br />
                            הערות:<input onChange={(e) => setcomments(e.target.value)} value={comments} /> <br />

                            <div>
                                <hr />
                                <h6>תמונת תחילת נסיעה ראשונה</h6>
                                {selectedDrive.startImg1 &&
                                    <img src={MY_SERVER + selectedDrive.startImg1} style={{ width: '150px', height: '100px' }} alt={'תמונה לא נמצאה'} />
                                }
                                <input type='file' onChange={handleFile1Change} />
                                {startSelectedFile1 &&
                                    <div>
                                        <img src={URL.createObjectURL(startSelectedFile1)}
                                            alt={startSelectedFile1.name}
                                            style={{ width: '150px', height: '100px' }} /><br />
                                    </div>}
                            </div>

                            <div>
                                <hr />
                                <h6>תמונת תחילת נסיעה שניה</h6>
                                {selectedDrive.startImg2 &&
                                    <img src={MY_SERVER + selectedDrive.startImg2} style={{ width: '150px', height: '100px' }} alt={'תמונה לא נמצאה'} />
                                }
                                <input type='file' onChange={handleFile2Change} />
                                {startSelectedFile2 &&
                                    <div>
                                        <img src={URL.createObjectURL(startSelectedFile2)}
                                            alt={startSelectedFile2.name}
                                            style={{ width: '150px', height: '100px' }} /><br />
                                    </div>}
                            </div>
                            <div>
                                <hr />
                                <h6>תמונת תחילת נסיעה שלישית</h6>
                                {selectedDrive.startImg3 &&
                                    <img src={MY_SERVER + selectedDrive.startImg3} style={{ width: '150px', height: '100px' }} alt={'תמונה לא נמצאה'} />
                                }
                                <input type='file' onChange={handleFile3Change} />
                                {startSelectedFile3 &&
                                    <div>
                                        <img src={URL.createObjectURL(startSelectedFile3)}
                                            alt={startSelectedFile3.name}
                                            style={{ width: '150px', height: '100px' }} /><br />
                                    </div>}
                            </div>

                            <div>
                                <hr />
                                <h6>תמונת סוף נסיעה ראשונה</h6>
                                {selectedDrive.endImg1 &&
                                    <img src={MY_SERVER + selectedDrive.endImg1} style={{ width: '150px', height: '100px' }} alt={'תמונה לא נמצאה'} />
                                }
                                <input type='file' onChange={handleendFile1Change} />
                                {endSelectedFile1 &&
                                    <div>
                                        <img src={URL.createObjectURL(endSelectedFile1)}
                                            alt={endSelectedFile1.name}
                                            style={{ width: '150px', height: '100px' }} /><br />
                                    </div>}

                            </div>

                            <div>
                                <hr />
                                <h6>תמונת סוף נסיעה שניה</h6>
                                {selectedDrive.endImg2 &&
                                    <img src={MY_SERVER + selectedDrive.endImg2} style={{ width: '150px', height: '100px' }} alt={'תמונה לא נמצאה'} />
                                }
                                <input type='file' onChange={handleendFile2Change} />
                                {endSelectedFile2 &&
                                    <div>
                                        <img src={URL.createObjectURL(endSelectedFile2)}
                                            alt={endSelectedFile2.name}
                                            style={{ width: '150px', height: '100px' }} /><br />
                                    </div>}
                            </div>

                                <div>
                                    <hr />
                                    <h6>תמונת סוף נסיעה שלישית</h6>
                                    {selectedDrive.endImg3 &&
                                        <img src={MY_SERVER + selectedDrive.endImg3} style={{ width: '150px', height: '100px' }} alt={'תמונה לא נמצאה'} />
                                    }
                                    <input type='file' onChange={handleendFile3Change} />
                                    {endSelectedFile3 &&
                                        <div>
                                            <img src={URL.createObjectURL(endSelectedFile3)}
                                                alt={endSelectedFile3.name}
                                                style={{ width: '150px', height: '100px' }} /><br />
                                        </div>}
                                </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default UpdateDrive