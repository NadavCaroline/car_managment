import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess } from '../login/loginSlice'
import { drivesSelector, getDrivesAsync, updateDriveAsync } from './drivesSlicer'
import { DriveModel } from '../../models/Drive';
import { MY_SERVER } from '../../env';


const UpdateDrive = (props: any) => {
    const dispatch = useAppDispatch()
    const token = useAppSelector(userAccess)
    const updateDriveModel: DriveModel = {}
    const [startDate, setstartDate] = useState("")
    const [endDate, setendDate] = useState("")
    const [startDateTime, setstartDateTime] = useState<Date | null>(null)
    const [endDateTime, setendDateTime] = useState<Date | null>(null)
    const [startTime, setstartTime] = useState("")
    const [endTime, setendTime] = useState("")
    const [startKilo, setstartKilo] = useState("")
    const [endKilo, setendKilo] = useState("")
    const [comments, setcomments] = useState("")
    const [startSelectedFile1, setstartSelectedFile1] = useState<File | null>(null)
    const [startSelectedFile2, setstartSelectedFile2] = useState<File | null>(null)
    const [startSelectedFile3, setstartSelectedFile3] = useState<File | null>(null)
    const [endSelectedFile1, setendSelectedFile1] = useState<File | null>(null)
    const [endSelectedFile2, setendSelectedFile2] = useState<File | null>(null)
    const [endSelectedFile3, setendSelectedFile3] = useState<File | null>(null)
    // const [selectedcarstartday, selectedcarstartmonth, selectedcarstartyear] = props.selectedDrive?.startDate.slice(0, 10).split('-').map(Number)
    // const [selectedcarstarthours, selectedcarstartminutes, selectedcarstartseconds] = props.selectedDrive?.startDate.slice(11, 16).split(':').map(Number)
    // const [selectedcarendday, selectedcarendmonth, selectedcarendyear] = props.selectedDrive?.endDate.slice(0, 10).split('-').map(Number)
    // const [selectedcarendhours, selectedcarendminutes, selectedcarendseconds] = props.selectedDrive?.endDate.slice(11, 16).split(':').map(Number)
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
        const [endday, endmonth, endyear] = endDate.split('-').map(Number);
        const [endhours, endminutes, endseconds] = endTime.split(':').map(Number);


        // Handles the start DateTime
        if (props.selectedDrive?.startDate && props.selectedDrive?.endDate) {
            const [selectedcarstartday, selectedcarstartmonth, selectedcarstartyear] = props.selectedDrive?.startDate.slice(0, 10).split('-').map(Number)
            const [selectedcarstarthours, selectedcarstartminutes, selectedcarstartseconds] = props.selectedDrive?.startDate.slice(11, 16).split(':').map(Number)
            const [selectedcarendday, selectedcarendmonth, selectedcarendyear] = props.selectedDrive?.endDate.slice(0, 10).split('-').map(Number)
            const [selectedcarendhours, selectedcarendminutes, selectedcarendseconds] = props.selectedDrive?.endDate.slice(11, 16).split(':').map(Number)
            // Handles image 1 upload
            if (startDate && startTime) { updateDriveModel.startDate = new Date(startyear, startmonth - 1, startday, starthours, startminutes) }
            else if (startDate) { updateDriveModel.startDate = new Date(startyear, startmonth - 1, startday, selectedcarstarthours, selectedcarstartminutes) }
            else if (startTime) { updateDriveModel.startDate = new Date(selectedcarstartday, selectedcarstartmonth - 1, selectedcarstartyear, starthours, startminutes) }

            // Handles the end DateTime
            if (endDate && endTime) { updateDriveModel.endDate = new Date(endyear, endmonth - 1, endday, endhours, endminutes) }
            else if (endDate) { updateDriveModel.endDate = new Date(endyear, endmonth - 1, endday, selectedcarendhours, selectedcarendminutes) }
            else if (endTime) { updateDriveModel.endDate = new Date(selectedcarendday, selectedcarendmonth - 1, selectedcarendyear, endhours, endminutes) }

        }
        // Handles the update for the cars without start and end date - Auto start/end drive 
        else {
            console.log("No selected Drive")
            updateDriveModel.startDate = new Date(startyear, startmonth - 1, startday, starthours, startminutes)
            updateDriveModel.endDate = new Date(endyear, endmonth - 1, endday, endhours, endminutes)
        }
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
        updateDriveModel && (updateDriveModel.id = props.selectedDrive?.id)

    }
    const handleDriveUpdate = () => {
        formDriveDate()
        updateDriveModel &&
            dispatch(updateDriveAsync({
                token: token,
                drive: updateDriveModel
            }))
        dispatch(getDrivesAsync(token))
        props.setselectedDrive(null)
    }

    return (
        // We Check if the drive has fields to update, or maybe it is empty, and the user needs to send new data
        <div >
                // The second case, in which the user need to fill the fields, because they don't exist.
            <div>
                <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100vh", backgroundColor: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ position: "relative", padding: "32px", width: "420px", height: "400px", maxWidth: "640px", backgroundColor: "white", border: "2px solid black", borderRadius: "5px", textAlign: "left" }}>
                        <button style={{ position: "absolute", top: "0", right: "0" }} onClick={() => props.setselectedDrive(null)}>X</button>
                        <form onSubmit={() => handleDriveUpdate()}>
                            <button type='submit'>שמור</button>
                            <img src={MY_SERVER + props.selectedDrive?.car_image} style={{ width: '150px', height: '100px' }} alt={props.selectedDrive?.car_name} /><br /><br />
                            <div>
                                מתאריך: <input type='date' onChange={(e) => setstartDate(e.target.value)} /> <br />
                                עד תאריך:<input type='date' onChange={(e) => setendDate(e.target.value)} /><br />
                            </div>

                            משעה:<input type='time' required={true} onChange={(e) => setstartTime(e.target.value)} /> <br />
                            עד שעה:<input type='time' required={true} onChange={(e) => setendTime(e.target.value)} /> <br />
                            קילומטראז' התחלתי:<input required={true} onChange={(e) => setstartKilo(e.target.value)} /><br />
                            קילומטראז' סופי: <input required={true} onChange={(e) => setendKilo(e.target.value)} /><br />
                            הערות:<input onChange={(e) => setcomments(e.target.value)} /> <br />

                            {props.selectedDrive.startImg1 &&
                                <div>
                                    <hr />
                                    <h6>תמונת תחילת נסיעה ראשונה</h6>
                                    <img src={MY_SERVER + props.selectedDrive.startImg1} style={{ width: '150px', height: '100px' }} />
                                    <input type='file' onChange={handleFile1Change} />
                                    {startSelectedFile1 &&
                                        <div>
                                            <img src={URL.createObjectURL(startSelectedFile1)}
                                                alt={startSelectedFile1.name}
                                                style={{ width: '150px', height: '100px' }} /><br />
                                        </div>}
                                </div>}
                            {props.selectedDrive.startImg2 &&
                                <div>
                                    <hr />
                                    <h6>תמונת תחילת נסיעה שניה</h6>
                                    <img src={MY_SERVER + props.selectedDrive.startImg2} style={{ width: '150px', height: '100px' }} />
                                    <input type='file' onChange={handleFile2Change} />
                                    {startSelectedFile2 &&
                                        <div>
                                            <img src={URL.createObjectURL(startSelectedFile2)}
                                                alt={startSelectedFile2.name}
                                                style={{ width: '150px', height: '100px' }} /><br />
                                        </div>}
                                </div>}
                            {props.selectedDrive.startImg3 &&
                                <div>
                                    <hr />
                                    <h6>תמונת תחילת נסיעה שלישית</h6>
                                    <img src={MY_SERVER + props.selectedDrive.startImg3} style={{ width: '150px', height: '100px' }} />
                                    <input type='file' onChange={handleFile3Change} />
                                    {startSelectedFile3 &&
                                        <div>
                                            <img src={URL.createObjectURL(startSelectedFile3)}
                                                alt={startSelectedFile3.name}
                                                style={{ width: '150px', height: '100px' }} /><br />
                                        </div>}
                                </div>}
                            {props.selectedDrive.endImg1 &&
                                <div>
                                    <hr />
                                    <h6>תמונת סוף נסיעה ראשונה</h6>
                                    <img src={MY_SERVER + props.selectedDrive.endImg1} style={{ width: '150px', height: '100px' }} />
                                    <input type='file' onChange={handleendFile1Change} />
                                    {endSelectedFile1 &&
                                        <div>
                                            <img src={URL.createObjectURL(endSelectedFile1)}
                                                alt={endSelectedFile1.name}
                                                style={{ width: '150px', height: '100px' }} /><br />
                                        </div>}

                                </div>}
                            {props.selectedDrive.endImg2 &&
                                <div>
                                    <hr />
                                    <h6>תמונת סוף נסיעה שניה</h6>
                                    <img src={MY_SERVER + props.selectedDrive.endImg2} style={{ width: '150px', height: '100px' }} />
                                    <input type='file' onChange={handleendFile2Change} />
                                    {endSelectedFile2 &&
                                        <div>
                                            <img src={URL.createObjectURL(endSelectedFile2)}
                                                alt={endSelectedFile2.name}
                                                style={{ width: '150px', height: '100px' }} /><br />
                                        </div>}
                                </div>}
                            {props.selectedDrive.endImg3 &&
                                <div>
                                    <hr />
                                    <h6>תמונת סוף נסיעה שלישית</h6>
                                    <img src={MY_SERVER + props.selectedDrive.endImg3} style={{ width: '150px', height: '100px' }} />
                                    <input type='file' onChange={handleendFile3Change} />
                                    {endSelectedFile3 &&
                                        <div>
                                            <img src={URL.createObjectURL(endSelectedFile3)}
                                                alt={endSelectedFile3.name}
                                                style={{ width: '150px', height: '100px' }} /><br />
                                        </div>}
                                </div>}
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default UpdateDrive