import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addCarsAsync, carsSelector, getAllCarsAsync, getCarsAsync, updateCarAsync } from './carsSlice';
import { getCarMaintenanceAsync, carMaintenanceSelector } from '../carMaintenance/carMaintenanceSlice';
import { getFileTypesAsync, fileTypesSelector } from '../fileType/fileTypeSlice';
import { userAccess, userToken } from '../login/loginSlice';
import { getProfileAsync, profileSelector } from '../profile/profileSlicer';
import { MY_SERVER } from '../../env';
import CarModel from '../../models/Car';
import { depsSelector, getDepsAsync } from '../deps/depsSlicer';
import { Card, Container, Row, Col, Badge, Button } from "react-bootstrap";
import dayjs from 'dayjs';
import pdfImg from '../../images/pdf.png';
import { FaUnderline } from 'react-icons/fa';
import { fontSize } from '@mui/system';


export function Cars() {
  const cars = useAppSelector(carsSelector);
  const carMaintenance = useAppSelector(carMaintenanceSelector);
  const fileTypes = useAppSelector(fileTypesSelector);
  const [searchTerm, setsearchTerm] = useState("")
  const dispatch = useAppDispatch();
  const token = useAppSelector(userAccess)
  const departments = useAppSelector(depsSelector)
  const [addpopUp, setaddpopUp] = useState(false)
  // const [editPopUp, seteditPopUp] = useState(false)
  const [selectedCarId, setSelectedCarId] = useState("")
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
  function handleCarDivClick(element: HTMLElement, carid: string): void {
    if (selectedCarId) {
      const mydiv = document.getElementById('divCar-' + selectedCarId);
      if (mydiv) {
        mydiv.classList.remove('selectedDiv');
      }
    }
    element.classList.add('selectedDiv');
    setSelectedCarId(carid);
  }
  // Gets the cars from the server
  useEffect(() => {
    dispatch(getAllCarsAsync(token))
    dispatch(getFileTypesAsync(token))
    dispatch(getCarMaintenanceAsync(token))
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
      <Container>
        <Row className="align-items-stretch" xs={1} md={2} lg={3} >
          {cars.map(car =>
            <Col style={{ marginBottom: '10px' }}>
              <Card id={`divCar-${car.id}`} className='h-100 text-center notSelectedDiv' onClick={(event) => handleCarDivClick(event.currentTarget, String(car.id))}  >
                {/* <Card.Img variant="top" src="https://via.placeholder.com/350x150" /> */}
                <Card.Body >
                  <Card.Title>
                    {car.nickName} <br /> {car.licenseNum}
                  </Card.Title>
                  <Card.Text>
                    <table style={{ margin: '0 auto' }}>
                      <tbody>
                        <tr>
                          <td style={{ textAlign: 'right', paddingLeft: '10px' }}>מחלקה:</td>
                          <td style={{ textAlign: 'right' }}>{car.dep_name}</td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'right' }}>יצרן:</td>
                          <td style={{ textAlign: 'right' }}>{car.make}</td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'right' }}>דגם:</td>
                          <td style={{ textAlign: 'right' }}>{car.model}</td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'right' }}>צבע:</td>
                          <td style={{ textAlign: 'right' }}>{car.color}</td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'right' }}>שנה:</td>
                          <td style={{ textAlign: 'right' }}>{car.year}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Card.Text>
                  <img src={MY_SERVER + car.image} style={{ width: '150px', height: '100px' }} alt={car.model} />
                </Card.Body>
                <Card.Footer>
                  <Container>
                    <Row>
                      {fileTypes.map((fileType, index) => (
                        <Col key={fileType.id} xs={6} md={6} lg={6} style={{ paddingRight: '5px', paddingLeft: '0' }}>


                          {carMaintenance
                            .filter(cm => cm.fileType === fileType.id && cm.car === car.id)
                            .slice(0, 1) // Get only the first element
                            .map((cm, index) => (
                              <Card style={{ marginBottom: '10px' }}>
                                <a href={MY_SERVER + cm.car_fileFolderName + cm.fileMaintenance} style={{ textDecoration: 'none', color: 'inherit' }} target="_blank">
                                  <Card.Body style={{ padding: '0' }}>
                                    <Card.Title style={{ fontSize: '1rem' }}>{fileType.name}<br></br>
                                      <small style={{ marginLeft: '10px', fontWeight: 'normal' }}>{cm.expirationDate ? dayjs(cm.expirationDate).format('DD/MM/YYYY') : ''}</small>

                                      {/* <Card.Text key={index}>
                                      <a href={MY_SERVER + cm.car_fileFolderName + cm.fileMaintenance} style={{ textDecoration: 'none', color: 'inherit' }} target="_blank">
                                        <img src={pdfImg} alt="pdfImg" width="30" height="30" className="vertical-align-middle" />
                                      </a>
                                      <small>{decodeURIComponent(cm.fileMaintenance!.substring(1))}</small><br></br>
                                      <small style={{ marginLeft: '10px' }}>{cm.expirationDate ? dayjs(cm.expirationDate).format('DD/MM/YYYY') : ''}</small>
                                    </Card.Text> */}
                                    </Card.Title>
                                  </Card.Body>
                                </a>
                              </Card>
                            ))}


                        </Col>
                      ))}
                    </Row>
                  </Container>
                </Card.Footer>
              </Card>
            </Col>

          )}
        </Row>
      </Container>

      <form dir="rtl" id="formCarmaintenance" style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
        <div style={{ marginTop: '10px' }}>
          <input placeholder='חיפוש' onChange={(e) => setsearchTerm(e.target.value)} style={{ width: '300px', left: '150px' }} />
          <h3 style={{ color: "rgb(19, 125, 141)", marginRight: "10px", marginBottom: "0px", marginTop: "10px" }} >מסמכי רכב</h3><hr />
          <Container>
            <Row className="align-items-stretch" xs={1} md={2} lg={3} >
              {selectedCarId && carMaintenance && carMaintenance.filter(carMaintenance => (carMaintenance.car == selectedCarId && (carMaintenance.car_file_type_name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                carMaintenance.expirationDate?.includes(searchTerm.toLocaleLowerCase())))
              ).map(carMaintenance =>
                <Col style={{ marginBottom: '10px' }}>
                  <Card className='h-100 text-center'>
                    {/* <Card.Img variant="top" src="https://via.placeholder.com/350x150" /> */}
                    <Card.Body >
                      <Card.Title>
                        {carMaintenance.car_file_type_name}</Card.Title>
                      <Card.Text>
                        <a href={MY_SERVER + carMaintenance.car_fileFolderName + carMaintenance.fileMaintenance} style={{ textDecoration: 'none', color: 'inherit' }} target="_blank">
                          <img src={pdfImg} alt="pdfImg" width="36" height="36" className="vertical-align-middle" />
                          <br></br>
                          <small>{decodeURIComponent(carMaintenance.fileMaintenance!.substring(1))}</small>
                        </a> <br></br>

                        {dayjs(carMaintenance.maintenanceDate, 'YYYY-MM-DD').format('DD/MM/YYYY')} עד {dayjs(carMaintenance.expirationDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}<br></br>
                        {/* {carMaintenance.car_name}<br></br> */}
                        <span className="cardlabel" >ק"מ טיפול הבא</span>{carMaintenance.nextMaintenancekilometer} ק"מ<br></br>
                        <span className="cardlabel" >הערות</span> {carMaintenance.comments}
                      </Card.Text>
                    </Card.Body>
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
