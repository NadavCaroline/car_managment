import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addCarsAsync, carsSelector, getAllCarsAsync, getCarsAsync, updateCarAsync } from './carsSlice';
import { getCarMaintenanceAsync, carMaintenanceSelector } from '../carMaintenance/carMaintenanceSlice';
import { userAccess, userToken } from '../login/loginSlice';
import { getProfileAsync, profileSelector } from '../profile/profileSlicer';
import { MY_SERVER } from '../../env';
import CarModel from '../../models/Car';
import { depsSelector, getDepsAsync } from '../deps/depsSlicer';
import { Card, Container, Row, Col, Badge, Button } from "react-bootstrap";
import dayjs from 'dayjs';
import pdfImg from '../../images/pdf.png';


export function Cars() {
  const cars = useAppSelector(carsSelector);
  const carMaintenance = useAppSelector(carMaintenanceSelector);
  const [searchTerm, setsearchTerm] = useState("")
  const dispatch = useAppDispatch();
  const token = useAppSelector(userAccess)
  const departments = useAppSelector(depsSelector)
  const [addpopUp, setaddpopUp] = useState(false)
  // const [editPopUp, seteditPopUp] = useState(false)
  const [licenseNum, setlicenseNum] = useState("")
  const [make, setmake] = useState("")
  const [model, setmodel] = useState("")
  const [color, setcolor] = useState("")
  const [year, setyear] = useState("")
  const [department, setdepartment] = useState("")
  const [carImage, setcarImage] = useState<File | null>(null)
  const [newDep, setnewDep] = useState("")
  const [selectedCar, setselectedCar] = useState<CarModel | null>(null)
  const updateCar: CarModel = {}

  // Handles image upload
  const handleCarImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setcarImage(e.target!.files![0])
  };
  // Pop up for adding car
  const handleExitUpload = () => {
    setaddpopUp(false)
    setcarImage(null)
    setnewDep("")
  }

  // Handles the update of a car's department
  const handleUpdate = () => {
    updateCar.id = selectedCar?.id
    updateCar.department = newDep
    dispatch(updateCarAsync({ token: token, car: updateCar }))
    dispatch(getAllCarsAsync(token))
    setselectedCar(null)
    setnewDep("")
  }
  // Handles the addition of a car
  const handlePostRequest = () => {
    const car: CarModel = {
      licenseNum: licenseNum,
      nickName: '',
      make: make,
      model: model,
      color: color,
      year: year,
      garageName: '',
      garagePhone: '',
      department: department,
      image: carImage,
      isDisabled: '0'

    }
    dispatch(addCarsAsync({ token: token, car: car }))
  }
  // Gets the cars from the server
  useEffect(() => {
    dispatch(getAllCarsAsync(token))
    // if (selectedCar) {
    //   dispatch(getCarMaintenanceAsync({ token: token, carid: String(selectedCar.id) }))
    // }
  }, [cars.length, selectedCar])
  // Gets the departments from the server
  useEffect(() => {
    dispatch(getDepsAsync(token))
  }, [])

  return (
    <div style={{ marginTop: '10px' }}>
      <div>
        <button onClick={() => setaddpopUp(true)}>הוספת מכונית</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
        {cars.map(car =>
          <div key={car.id} onClick={() => dispatch(getCarMaintenanceAsync({ token: token, carid: String(car.id) }))} style={{ borderRadius: '5px', border: '2px solid rgb(0, 0, 0)', padding: '.5rem' }}>

            <div style={{ textAlign: 'center' }}>
              Department: {car.dep_name}<br />
              יצרן: {car.make}<br />
              דגם: {car.model}<br />
              צבע: {car.color}<br />
              שנה: {car.year}   <br />
              <img src={MY_SERVER + car.image} style={{ width: '150px', height: '100px' }} alt={car.model} /><br />
              <button onClick={() => setselectedCar(car)}>עריכה</button>
            </div>
          </div>)}
      </div>
      <form dir="rtl" id="formCarmaintenance" style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
        <div style={{ marginTop: '10px' }}>
          <input placeholder='חיפוש' onChange={(e) => setsearchTerm(e.target.value)} style={{ width: '300px', left: '150px' }} />
          <h3 style={{ color: "rgb(19, 125, 141)", marginRight: "10px", marginBottom: "0px", marginTop: "10px" }} >מסמכי רכב</h3><hr />
          <Container>
            <Row className="align-items-stretch" xs={1} md={2} lg={3} >
              {carMaintenance && carMaintenance.filter(carMaintenance => ((carMaintenance.car_file_type_name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                carMaintenance.expirationDate?.includes(searchTerm.toLocaleLowerCase())))
              ).map(carMaintenance =>
                <Col style={{ marginBottom: '10px' }}>
                  <Card className='h-100 text-center'>
                    {/* <Card.Img variant="top" src="https://via.placeholder.com/350x150" /> */}
                    <Card.Body >
                      <Card.Title>
                        {carMaintenance.car_file_type_name}</Card.Title>
                      <Card.Text>
                      <a href={MY_SERVER +carMaintenance.car_fileFolderName+ carMaintenance.fileMaintenance} style={{textDecoration: 'none', color: 'inherit'}} target="_blank">
                          <img src={pdfImg} alt="pdfImg" width="36" height="36" className="vertical-align-middle" />
                          <br></br>
                          <small>{decodeURIComponent(carMaintenance.fileMaintenance!.substring(1))  }</small>
                        </a> <br></br>
                       
                        {dayjs(carMaintenance.maintenanceDate, 'YYYY-MM-DD').format('DD/MM/YYYY')} עד {dayjs(carMaintenance.expirationDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}<br></br>
                        {/* {carMaintenance.car_name}<br></br> */}
                        <span className="cardlabel" >ק"מ טיפול הבא</span>{carMaintenance.nextMaintenancekilometer} ק"מ<br></br>
                        <span className="cardlabel" >הערות</span> {carMaintenance.comments}
                      </Card.Text>
                    </Card.Body>
                    {/* <Card.Footer style={{ backgroundColor: 'transparent', borderTop: 'none' }}>
                            {!shift.isDone && <Button id={shift.id?.toString()} variant="danger" onClick={() => shift.id !== undefined ? DoneClick(shift.id) : null}>
                              סמן כבוצע
                            </Button>}
                            {shift.isDone && <Badge style={{ fontSize: '1em', fontWeight: 'normal', padding: '10px' }} className="ms-2 bg-success">בוצע</Badge>}

                          </Card.Footer> */}
                  </Card>
                </Col>

              )}
            </Row>
          </Container>

        </div >

      </form>
      {addpopUp &&
        <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100vh", backgroundColor: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "relative", padding: "32px", width: "420px", height: "400px", maxWidth: "640px", backgroundColor: "white", border: "2px solid black", borderRadius: "5px", textAlign: "left" }}>
            <button style={{ position: "absolute", top: "0", right: "0" }} onClick={() => handleExitUpload()}>X</button>
            <form>
              <div>
                מספר לוחית רישוי:
                <input required onChange={(e) => setlicenseNum(e.target.value)} />
              </div>
              <div>
                יצרן:
                <input required onChange={(e) => setmake(e.target.value)} />
              </div>
              <div>
                דגם:
                <input required onChange={(e) => setmodel(e.target.value)} />
              </div>
              <div>
                צבע:
                <input required onChange={(e) => setcolor(e.target.value)} />
              </div>
              <div>
                שנה:
                <input required onChange={(e) => setyear(e.target.value)} />
              </div>
              <div>
                מחלקה:
                <select value={department} onChange={(e) => setdepartment(e.target.value)}>
                  <option value="" disabled={true}>בחר מחלקה חדשה</option>
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                תמונה:
                <input required type='file' onChange={handleCarImageChange} />
                {carImage &&
                  <div>
                    <img src={URL.createObjectURL(carImage)}
                      alt={carImage.name}
                      style={{ width: '150px', height: '100px' }} /><br />
                  </div>}
              </div>
              <br />
              <button onClick={() => handlePostRequest()}>שמור</button>
            </form>
          </div>
        </div>
      }
      {selectedCar &&
        <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100vh", backgroundColor: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "relative", padding: "32px", width: "400px", height: "200px", maxWidth: "640px", backgroundColor: "white", border: "2px solid black", borderRadius: "5px", textAlign: "left" }}>
            <button style={{ position: "absolute", top: "0", right: "0" }} onClick={() => setselectedCar(null)}>X</button>
            <div>
              שינוי מחלקה:
              <select value={newDep} onChange={(e) => setnewDep(e.target.value)}>
                <option value="" disabled={true}>בחר מחלקה חדשה</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={() => handleUpdate()}>שמור</button>
          </div>
        </div>}
    </div>
  );
}
