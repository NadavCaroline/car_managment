import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess } from '../login/loginSlice'
import { drivesSelector, getDrivesAsync } from './drivesSlicer'
import { DriveModel } from '../../models/Drive';
import { MY_SERVER } from '../../env';

const selectedDriveContext = React.createContext<DriveModel | null>(null);


const UpdateDrive = () => {
    const selectedDrive = useContext(selectedDriveContext)
    const updateDriveModel: DriveModel = {}
    const [startDate, setstartDate] = useState("")
    const [endDate, setendDate] = useState("")
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


    // Forms the data to prepare the request to the server
    const formDriveDate = () => {
        startDate && (updateDriveModel.startDate = startDate)
        endDate && (updateDriveModel.endDate = endDate)
        startTime && (updateDriveModel.startTime = startTime)
        endTime && (updateDriveModel.endTime = endTime)
        startKilo && (updateDriveModel.startKilometer = startKilo)
        endKilo && (updateDriveModel.endKilometer = endKilo)
        startDate && (updateDriveModel.startDate = startDate)
        startDate && (updateDriveModel.startDate = startDate)
        comments && (updateDriveModel.comments = comments)
        startSelectedFile1 && (updateDriveModel.startImg1 = startSelectedFile1)
        startSelectedFile2 && (updateDriveModel.startImg2 = startSelectedFile2)
        startSelectedFile3 && (updateDriveModel.startImg3 = startSelectedFile3)
        endSelectedFile1 && (updateDriveModel.endImg1 = endSelectedFile1)
        endSelectedFile2 && (updateDriveModel.endImg1 = endSelectedFile2)
        endSelectedFile3 && (updateDriveModel.endImg1 = endSelectedFile3)
        console.log(updateDriveModel)
    }

    return (
        <div >
            {selectedDrive &&
                <div style={{ marginRight: "450px", marginTop: "5px", width: "300px", padding: "50px" }}>
                    <button onClick={()=> formDriveDate()}>שמור</button>
                    <img src={MY_SERVER + selectedDrive?.car_image} style={{ width: '150px', height: '100px' }} alt={selectedDrive?.car_name} /><br /><br />
                    {selectedDrive.startDate!.toString().slice(0, 10) === selectedDrive.endDate!.toString().slice(0, 10) ?
                        <div>
                            בתאריך: <input placeholder={selectedDrive.startDate!.toString().slice(0, 10)} onChange={(e) => setstartDate(e.target.value)} /><br />
                        </div> :
                        <div>
                            מתאריך: <input placeholder={selectedDrive.startDate!.toString().slice(0, 10)} onChange={(e) => setstartDate(e.target.value)} /> <br />
                            עד תאריך:<input placeholder={selectedDrive.endDate!.toString().slice(0, 10)} onChange={(e) => setendDate(e.target.value)} /><br />
                        </div>
                    }
                    משעה:<input placeholder={selectedDrive.startDate!.toString().slice(11, 16)} onChange={(e) => setstartTime(e.target.value)} /> <br />
                    עד שעה:<input placeholder={selectedDrive.endDate!.toString().slice(11, 16)} onChange={(e) => setendTime(e.target.value)} /> <br />
                    קילומטראז' התחלתי:<input placeholder={Number(selectedDrive.startKilometer).toLocaleString()} onChange={(e) => setstartKilo(e.target.value)} /><br />
                    קילומטראז' סופי: <input placeholder={Number(selectedDrive.endKilometer).toLocaleString()} onChange={(e) => setendKilo(e.target.value)} /><br />
                    הערות:<input placeholder={selectedDrive.comments ? selectedDrive.comments : 'אין הערות'} onChange={(e) => setcomments(e.target.value)} /> <br />

                    {selectedDrive.startImg1 &&
                        <div>
                            <hr />
                            <h6>תמונת תחילת נסיעה ראשונה</h6>
                            <img src={MY_SERVER + selectedDrive.startImg1} style={{ width: '150px', height: '100px' }} />
                            <input type='file' onChange={handleFile1Change} />
                            {startSelectedFile1 &&
                                <div>
                                    <img src={URL.createObjectURL(startSelectedFile1)}
                                        alt={startSelectedFile1.name}
                                        style={{ width: '150px', height: '100px' }} /><br />
                                </div>}
                        </div>}
                    {selectedDrive.startImg2 &&
                        <div>
                            <hr />
                            <h6>תמונת תחילת נסיעה שניה</h6>
                            <img src={MY_SERVER + selectedDrive.startImg2} style={{ width: '150px', height: '100px' }} />
                            <input type='file' onChange={handleFile2Change} />
                            {startSelectedFile2 &&
                                <div>
                                    <img src={URL.createObjectURL(startSelectedFile2)}
                                        alt={startSelectedFile2.name}
                                        style={{ width: '150px', height: '100px' }} /><br />
                                </div>}
                        </div>}
                    {selectedDrive.startImg3 &&
                        <div>
                            <hr />
                            <h6>תמונת תחילת נסיעה שלישית</h6>
                            <img src={MY_SERVER + selectedDrive.startImg3} style={{ width: '150px', height: '100px' }} />
                            <input type='file' onChange={handleFile3Change} />
                            {startSelectedFile3 &&
                                <div>
                                    <img src={URL.createObjectURL(startSelectedFile3)}
                                        alt={startSelectedFile3.name}
                                        style={{ width: '150px', height: '100px' }} /><br />
                                </div>}
                        </div>}
                    {selectedDrive.endImg1 &&
                        <div>
                            <hr />
                            <h6>תמונת סוף נסיעה ראשונה</h6>
                            <img src={MY_SERVER + selectedDrive.endImg1} style={{ width: '150px', height: '100px' }} />
                            <input type='file' onChange={handleendFile1Change} />
                            {endSelectedFile1 &&
                                <div>
                                    <img src={URL.createObjectURL(endSelectedFile1)}
                                        alt={endSelectedFile1.name}
                                        style={{ width: '150px', height: '100px' }} /><br />
                                </div>}

                        </div>}
                    {selectedDrive.endImg2 &&
                        <div>
                            <hr />
                            <h6>תמונת סוף נסיעה שניה</h6>
                            <img src={MY_SERVER + selectedDrive.endImg2} style={{ width: '150px', height: '100px' }} />
                            <input type='file' onChange={handleendFile2Change} />
                            {endSelectedFile2 &&
                                <div>
                                    <img src={URL.createObjectURL(endSelectedFile2)}
                                        alt={endSelectedFile2.name}
                                        style={{ width: '150px', height: '100px' }} /><br />
                                </div>}
                        </div>}
                    {selectedDrive.endImg3 &&
                        <div>
                            <hr />
                            <h6>תמונת סוף נסיעה שלישית</h6>
                            <img src={MY_SERVER + selectedDrive.endImg3} style={{ width: '150px', height: '100px' }} />
                            <input type='file' onChange={handleendFile3Change} />
                            {endSelectedFile3 &&
                                <div>
                                    <img src={URL.createObjectURL(endSelectedFile3)}
                                        alt={endSelectedFile3.name}
                                        style={{ width: '150px', height: '100px' }} /><br />
                                </div>}
                        </div>}
                </div>}
        </div>
    )
}




const PreviousDrives = () => {
    const drives = useAppSelector(drivesSelector)
    const dispatch = useAppDispatch()
    const token = useAppSelector(userAccess)
    const [selectedDrive, setselectedDrive] = useState<DriveModel | null>(null)
    const contextValue = useContext(selectedDriveContext)

    useEffect(() => {
        dispatch(getDrivesAsync(token))
    }, [])

    return (
        <div >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
                {drives.filter(drive => drive.endDate).map(drive =>
                    <div onClick={() => setselectedDrive(drive)} key={drive.id} style={{ borderRadius: '5px', border: '2px solid rgb(0, 0, 0)', padding: '.5rem', margin: "10px" }} >
                        מכונית: {drive.car_name}<br />
                        <img src={MY_SERVER + drive.car_image} style={{ width: '150px', height: '100px' }} alt={drive.car_name} /><br /><br />
                        {drive.startDate!.toString().slice(0, 10) === drive.endDate!.toString().slice(0, 10) ?
                            <div>
                                בתאריך: {drive.startDate!.toString().slice(0, 10)}<br />
                            </div> :
                            <div>
                                מתאריך: {drive.startDate!.toString().slice(0, 10)}<br />
                                עד תאריך: {drive.endDate!.toString().slice(0, 10)}<br />
                            </div>
                        }

                        משעה: {drive.startDate!.toString().slice(11, 16)}<br />
                        עד שעה: {drive.endDate!.toString().slice(11, 16)}<br />
                        קילומטראז' התחלתי: {Number(drive.startKilometer).toLocaleString()}<br />
                        קילומטראז' סופי: {Number(drive.endKilometer).toLocaleString()}<br />
                        הערות: {drive.comments ? drive.comments : 'אין הערות'}<br />
                        <button onClick={() => setselectedDrive(drive)}>עריכה</button>
                    </div>)}
            </div>

            <selectedDriveContext.Provider value={selectedDrive}>
                <div >

                    {selectedDrive &&
                        <button onClick={() => setselectedDrive(null)}>X</button>
                    }
                    <UpdateDrive /><br /><br />
                </div>
            </selectedDriveContext.Provider>

        </div>
    )
}

export default PreviousDrives