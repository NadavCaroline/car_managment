import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addCarsAsync, carsSelector, getAllCarsAsync, getCarsAsync, updateCarAsync } from './carsSlice';
import { getCarMaintenanceAsync, carMaintenanceSelector } from '../carMaintenance/carMaintenanceSlice';
import { getFileTypesAsync, fileTypesSelector } from '../fileType/fileTypeSlice';
import { userAccess, userToken } from '../login/loginSlice';
import { getProfileAsync, profileSelector } from '../profile/profileSlicer';
import { MY_SERVER } from '../../env';
import CarModel from '../../models/Car';
import CarMaintenanceModel from '../../models/CarMaintenance';
import { depsSelector, getDepsAsync } from '../deps/depsSlicer';
import { Card, Container, Row, Col, Badge, Button, Modal } from "react-bootstrap";
import dayjs from 'dayjs';
import pdfImg from '../../images/pdf.png';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
// import Form from 'react-bootstrap/Form';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'


export function Cars() {
  const [show, setShow] = useState(false);
  const [showModalFiles, setShowModalFiles] = useState(false);
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
  const [nickName, setNickName] = useState("")
  const [garageName, setGarageName] = useState("")
  const [garagePhone, setGaragePhone] = useState("")
  const [licenseNum, setlicenseNum] = useState("")
  const [make, setmake] = useState("")
  const [model, setmodel] = useState("")
  const [color, setcolor] = useState("")
  const [year, setyear] = useState("")
  const [department, setdepartment] = useState("")
  const [carImage, setcarImage] = useState<File | null>(null)
  // const [fileTypesImage, setFileTypesImage] = useState<{ id: string; img: File | null }>({ id: '', img: null });
  const [newDep, setnewDep] = useState("")
  const [selectedCar, setselectedCar] = useState<CarModel | null>(null)
  const updateCar: CarModel = {}
  const [carMaintenanceArr, setCarMaintenanceArr] = useState<CarMaintenanceModel[]>([]);
  const updateCarMaintenance: CarMaintenanceModel = {}
  const [isChecked, setIsChecked] = useState(false);

  // Handles image upload
  const handleCarImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setcarImage(e.target!.files![0])
  };

  const handleFileTypesChange = (filetypeId: string, event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];

    if (file && file.type === 'application/pdf') {
      updateCarMaintenance.fileType = filetypeId
      // updateCarMaintenance.fileMaintenance=file
      // setFileTypesImage({ id: filetypeId, img: file });
    }
    else {
      // Reset the file input
      event.target.value = '';
      // setFileTypesImage({ id: '', img: null });
      //display error
    }
  };
  const handleToggle = () => {
    setIsChecked(!isChecked);
  };
  // Pop up for adding car
  const handleExitUpload = () => {
    setaddpopUp(false)
    setcarImage(null)
    setnewDep("")
  }
  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };
  const handleCloseModalFiles = () => {
    setShowModalFiles(false);
  };

  const handleShowModalFiles = () => {
    setShowModalFiles(true);
  };
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Process your form data or perform other actions
  };

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
      nickName: nickName,
      make: make,
      model: model,
      color: color,
      year: year,
      garageName: garageName,
      garagePhone: garagePhone,
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
        mydiv.classList.remove('selectedDivBody');
      }
    }
    element.classList.add('selectedDivBody');
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
    <div className="row mt-3" style={{ direction: "rtl" }}>
      <div className="mx-auto col-10">
        <div style={{ textAlign: 'left' }}>
          <button style={{ marginLeft: "10px", marginBottom: "10px" }} className="btn btn-primary" onClick={() => {/*setaddpopUp(true);*/handleShow() }}>הוספת רכב</button>
        </div>
        <Container>
          <Row className="align-items-stretch" xs={1} md={2} lg={3} >
            {cars.map(car =>
              <Col style={{ marginBottom: '10px' }}>
                <Card id={`divCar-${car.id}`} className='h-100 text-center notSelectedDiv' onClick={(event) => handleCarDivClick(event.currentTarget, String(car.id))}  >
                  <Card.Body >
                    <Card.Title>
                      <table style={{ width: '100%' }}>
                        <tr>
                          <td style={{ width: '20px' }}>
                            <div data-tooltip={car.isDisabled ? 'לא פעיל' : 'פעיל'} className={`circle ${car.isDisabled ? 'red' : 'green'}`} />
                          </td>
                          <td>
                            {car.nickName} <br /> {car.licenseNum}
                          </td>
                          <td style={{ width: '20px' }}>
                          </td>
                        </tr>
                      </table>

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
                    <img src={MY_SERVER + car.image} style={{ width: '150px', height: '100px' }} alt={car.model} /><br></br>
                    {car.garageName && (
                      <React.Fragment>
                        מוסך {car.garageName} {car.garagePhone}<br></br>
                      </React.Fragment>
                    )}

                    <button className="btn btn-primary" style={{ marginTop: '10px' }} onClick={() => setselectedCar(car)}>עריכה</button>
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
        <form dir="rtl" id="formCarmaintenance" onSubmit={handleFormSubmit} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
          <div style={{ marginTop: '10px' }}>
            <input placeholder='חיפוש' onChange={(e) => setsearchTerm(e.target.value)} style={{ width: '300px', left: '150px' }} />
            <h3 style={{ color: "rgb(19, 125, 141)", marginRight: "10px", marginBottom: "0px", marginTop: "10px" }} >מסמכי רכב</h3><hr />
            <div style={{ textAlign: 'left' }}>
              <button style={{ marginLeft: "10px", marginBottom: "10px" }} className="btn btn-primary" onClick={() => {/*setaddpopUp(true);*/handleShowModalFiles() }}>הוספת מסמך</button>
            </div>
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
                {carMaintenance.filter(carMaintenance => (carMaintenance.car == selectedCarId)).length == 0 &&
                  <h4 style={{ color: "red", marginBottom: "0px", marginTop: "10px" }} >לא נמצאו מסמכי רכב  </h4>
                }
              </Row>
            </Container>

          </div >

        </form>

        {/* modal for file type car */}
        <Modal show={showModalFiles} onHide={handleCloseModalFiles} style={{ direction: 'rtl' }}>
          <Modal.Header style={{ backgroundColor: "rgb(19, 125, 141)" }}  >
            <Modal.Title style={{ color: "white" }}>הוספת מסמך לרכב</Modal.Title>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              style={{ color: 'white' }}
              onClick={handleCloseModalFiles}
            ></button>
          </Modal.Header>
          <Modal.Body>
            <table>
              <tbody>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>סוג מסמך</td>
                  <td>
                    <select value={department} onChange={(e) => setdepartment(e.target.value)}>
                      <option value="" disabled={true}>בחר מחלקה </option>
                      {fileTypes.map((filetype) => (
                        <option key={filetype.id} value={filetype.id}>
                          {filetype.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>תאריך טיפול</td>
                  <td>
                    <div >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker', 'MobileTimePicker']}>
                          {/* Date Picking Component */}
                          <DemoItem >
                            <DatePicker
                              minDate={dayjs()}
                              format='DD-MM-YYYY'
                            // value={selectedStartDate}
                            // onChange={handleStartDateChange}
                            />
                          </DemoItem>
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>תאריך פג תוקף</td>
                  <td>
                    <div >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker', 'MobileTimePicker']}>
                          {/* Date Picking Component */}
                          <DemoItem >
                            <DatePicker 
                              minDate={dayjs()}
                              format='DD-MM-YYYY'
                            // value={selectedStartDate}
                            // onChange={handleStartDateChange}
                            />
                          </DemoItem>
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                  </td>
                </tr>
                <tr >
                  <td style={{ paddingLeft: '10px' }}>מסמך</td>
                  <td>
                    <input required type="file" />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>
                    ק"מ טיפול הבא
                  </td>
                  <td style={{ paddingLeft: '10px' }}>
                    <input />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>
                    הערות
                  </td>
                  <td>
                    <div className="form-floating mb-2">
                      <textarea style={{ width: '100%' }} id="filecomment" rows={3} placeholder="הערות"></textarea>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>

          </Modal.Body>
          <Modal.Footer>
            {/* <Button variant="secondary" onClick={handleClose} >
              Close
            </Button> */}
            <Button className="btn btn-primary" onClick={() => handlePostRequest()}>שמור</Button>
            {/* Additional buttons or content */}
          </Modal.Footer>
        </Modal>

        {/* Modal for cars */}
        <Modal show={show} onHide={handleClose} style={{ direction: 'rtl' }}>
          <Modal.Header style={{ backgroundColor: "rgb(19, 125, 141)" }}  >
            <Modal.Title style={{ color: "white" }}>הוספת רכב</Modal.Title>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              style={{ color: 'white' }}
              onClick={handleClose}
            ></button>
          </Modal.Header>
          <Modal.Body>
            <table>
              <tbody>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>כינוי רכב</td>
                  <td>
                    <input onChange={(e) => setNickName(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>מספר רישוי</td>
                  <td>
                    <input required onChange={(e) => setlicenseNum(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>יצרן</td>
                  <td>
                    <input required onChange={(e) => setmake(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>דגם</td>
                  <td>
                    <input required onChange={(e) => setmodel(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>צבע</td>
                  <td>
                    <input required onChange={(e) => setcolor(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>שנה</td>
                  <td>
                    <input required onChange={(e) => setyear(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>מחלקה</td>
                  <td>
                    <select value={department} onChange={(e) => setdepartment(e.target.value)}>
                      <option value="" disabled={true}>בחר מחלקה </option>
                      {departments.map((dep) => (
                        <option key={dep.id} value={dep.id}>
                          {dep.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>שם מוסך</td>
                  <td>
                    <input onChange={(e) => setGarageName(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>טלפון מוסך</td>
                  <td>
                    <input onChange={(e) => setGaragePhone(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>תמונת הרכב</td>
                  <td>
                    <input required type="file" onChange={handleCarImageChange} />
                    {carImage && (
                      <div>
                        <img
                          src={URL.createObjectURL(carImage)}
                          alt={carImage.name}
                          style={{ width: '150px', height: '100px' }}
                        /><br />
                      </div>
                    )}

                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>פעיל</td>
                  <td>
                    <BootstrapSwitchButton
                      checked={true}
                      onlabel='כן'
                      offlabel='לא'
                      offstyle="danger"
                      onstyle="success"
                      size='xs'
                      // onChange={(checked: boolean) => {
                      //   this.setState({ isUserAdmin: checked })
                      // }}
                    />
                   
                  </td>
                </tr>

              </tbody>
            </table>

          </Modal.Body>
          <Modal.Footer>
            {/* <Button variant="secondary" onClick={handleClose} >
              Close
            </Button> */}
            <Button className="btn btn-primary" onClick={() => handlePostRequest()}>שמור</Button>
            {/* Additional buttons or content */}
          </Modal.Footer>
        </Modal>
        {/* {addpopUp &&
          <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100vh", backgroundColor: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", padding: "32px", width: "420px", height: "640px", maxWidth: "640px", backgroundColor: "white", border: "2px solid black", borderRadius: "5px", textAlign: "left" }}>
              <button style={{ position: "absolute", top: "0", right: "0" }} onClick={() => handleExitUpload()}>X</button>
              <form>
              <div>
                  כינוי רכב:
                  <input onChange={(e) => setNickName(e.target.value)} />
                </div>
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
                  שם מוסך :
                  <input onChange={(e) => setGarageName(e.target.value)} />
                </div>
                <div>
                  טלפון מוסך :
                  <input onChange={(e) => setGaragePhone(e.target.value)} />
                </div>
                <div>
                  תמונת הרכב:
                  <input required type='file' onChange={handleCarImageChange} />
                  {carImage &&
                    <div>
                      <img src={URL.createObjectURL(carImage)}
                        alt={carImage.name}
                        style={{ width: '150px', height: '100px' }} /><br />
                    </div>}
                </div>
                {fileTypes.map((fileType, index) => (
                  <div>{fileType.name}
                    <input required type='file' onChange={(e) => handleFileTypesChange(String(fileType.id), e)} />
                  </div>
                ))}
                <br />
                <button className="btn btn-primary" onClick={() => handlePostRequest()}>שמור</button>
              </form>
            </div>
          </div>
        } */}
        {selectedCar &&
          <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100vh", backgroundColor: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", padding: "32px", width: "400px", height: "200px", maxWidth: "640px", backgroundColor: "white", border: "2px solid black", borderRadius: "5px", textAlign: "left" }}>
              <button style={{ position: "absolute", top: "0", right: "0" }} onClick={() => setselectedCar(null)}>X</button>
              <div>
                שינוי מחלקה:
                <select value={newDep} onChange={(e) => setnewDep(e.target.value)}>
                  <option value="" disabled={true}>בחר מחלקה </option>
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
    </div>

  );
}
