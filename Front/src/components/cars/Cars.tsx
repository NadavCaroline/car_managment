import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addCarsAsync, carsSelector, getAllCarsAsync, updateCarAsync, carError, carMessage, SetError, SetMsg } from './carsSlice';
import { getCarMaintenanceAsync, carMaintenanceSelector, addCarMaintenanceAsync, carMaintenanceError, carMaintenanceMessage, SetErrorCarMaintenance, SetMsgCarMaintenance, updateCarMaintenanceAsync } from '../carMaintenance/carMaintenanceSlice';
import { getFileTypesAsync, fileTypesSelector } from '../fileType/fileTypeSlice';
import { userAccess } from '../login/loginSlice';
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
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { Dayjs } from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';

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
  const [selectedCar, setselectedCar] = useState<CarModel | null>(null)
  const [selectedCarMaintenance, setselectedCarMaintenance] = useState<CarMaintenanceModel | null>(null)
  const [isChecked, setIsChecked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputImgRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("")
  const [selectedExpirationDate, setSelectedExpirationDate] = useState<Dayjs | null>(null)
  const [selectedMaintenanceDate, setSelectedMaintenanceDate] = useState<Dayjs | null>(null)
  const [nextKm, setNextKm] = useState("")
  const [comments, setComments] = useState("")
  const successMessage = useAppSelector(carMessage)
  const errorMessage = useAppSelector(carError)
  const successMessageMaintenance = useAppSelector(carMaintenanceMessage)
  const errorMessageMaintenance = useAppSelector(carMaintenanceError)



  const handleExpirationDate = (date: Dayjs | null) => {
    setSelectedExpirationDate(date)
  }
  const handleMaintenanceDate = (date: Dayjs | null) => {
    setSelectedMaintenanceDate(date)
  }
  // Handles image upload
  const handleCarImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setcarImage(e.target!.files![0])
  };
  const handleToogle = () => {
    setIsChecked(!isChecked)
  };

  const resetModalCars = () => {
    setselectedCar(null);
    setlicenseNum("");
    setNickName("");
    setmake("");
    setmodel("");
    setcolor("");
    setyear("");
    setGarageName("");
    setGaragePhone("");
    setdepartment("");
    setcarImage(null);
    setIsChecked(false);

  };
  const resetModalFiles = () => {
    setSelectedMaintenanceDate(null);
    setSelectedFile(null);
    setFileType("");
    setSelectedExpirationDate(null);
    setNextKm("");
    setComments("");
  };


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
  async function convertURLToFile(url: string, filename: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();

    // Extract the file type from the response headers
    const contentType = response.headers.get('content-type');
    const fileType = contentType ? contentType.split('/')[1] : '';

    // Append the file type to the filename
    const fullFilename = `${filename}.${fileType}`;

    return new File([blob], fullFilename);
  }
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


  const updateModalCar = (car: CarModel) => {
    convertURLToFile(MY_SERVER + car.image, String(car.image).split('/')[2].split('.')[0])
      .then((file) => {
        setcarImage(file);
        console.log(file);
      })
      .catch((error) => {
        console.error('Error converting URL to File:', error);
      });
    setselectedCar(car);
    setlicenseNum(car.licenseNum ?? '');
    setNickName(car.nickName ?? '');
    setmake(car.make ?? '');
    setmodel(car.model ?? '');
    setcolor(car.color ?? '');
    setyear(car.year ?? '');
    setGarageName(car.garageName ?? '');
    setGaragePhone(car.garagePhone ?? '');
    setdepartment(car.department ?? '');

    setIsChecked(car.isDisabled ?? false);
    handleShow();
  }
  const updCar = () => {
    if (!checkCarForm())
      return;
    const carNew: CarModel = {
      id: selectedCar?.id,
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
      isDisabled: isChecked
    }

    dispatch(updateCarAsync({ token: token, car: carNew })).then((res) => { });
  }

  const checkCarForm = (): boolean => {
    let msgError = "";
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
    if (!nickName) {
      msgError = "נא להכניס כינוי רכב "
    }
    else if (!licenseNum) {
      msgError = "נא להכניס מספר רכב "
    }
    else if (!(/^\d+$/.test(licenseNum))) {
      msgError = "מספר רכב חייב להכיל רק מספרים"
    }
    else if (!make) {
      msgError = "נא להכניס יצרן "
    }
    else if (!model) {
      msgError = "נא להכניס דגם  "
    }
    else if (!color) {
      msgError = "נא להכניס צבע   "
    }
    else if (!year) {
      msgError = "נא להכניס שנה   "
    }
    else if (!(/^\d{4}$/.test(year))) {
      msgError = "נא להכניס שנה תקינה"
    }
    else if (!department) {
      msgError = "נא לבחור מחלקה   "
    }
    else if (carImage && !imageExtensions.includes(carImage.name.split('.').pop()?.toLowerCase() ?? '')) {
      msgError = "בחר קובץ מסוג תמונה"
    }
    if (msgError) {
      dispatch(SetError(msgError))
      return false;
    }
    return true;
  }

  // Handles the addition of a car
  const addCar = () => {
    if (!checkCarForm())
      return;
    const carNew: CarModel = {
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
      isDisabled: isChecked
    }
    console.log(carImage);
    console.log(typeof carImage);
    dispatch(addCarsAsync({ token: token, car: carNew })).then((res) => { });
  }
  const checkCarMaintenanceForm = (): boolean => {
    let msgError = "";
    const imageExtensions = ['pdf'];
    if (!fileType) {
      msgError = "בחר סוג מסמך"
    }
    else if ( !selectedCarMaintenance && (!selectedFile || !imageExtensions.includes(selectedFile.name.split('.').pop()?.toLowerCase() ?? ''))) {
      msgError = "בחר קובץ מסוג PDF"
    }
    else if (fileType == '5' && !(/^\d+$/.test(nextKm))) {
      msgError = 'נא להכניס מספר ק"מ'
    }
    else if (!selectedMaintenanceDate) {
      msgError = 'נא להכניס תאריך מסמך'
    }
    else if (!selectedExpirationDate) {
      msgError = 'נא להכניס תאריך תוקף'
    }
    else if (dayjs(selectedExpirationDate, 'YYYY-MM-DD').locale('he').isBefore(dayjs(selectedMaintenanceDate, 'YYYY-MM-DD').locale('he').format('YYYY-MM-DD'), 'day')) {
      msgError = 'תאריך תוקף חייב להיות גדול מתאריך מסמך'
    }

    if (msgError) {
      dispatch(SetErrorCarMaintenance(msgError))
      return false;
    }

    return true;
  }
  const updateModalCarMaintenance = (carMaintenance: CarMaintenanceModel) => {
    // setSelectedFile(MY_SERVER + carMaintenance.fileMaintenance);
    setSelectedFile(null)
    setselectedCarMaintenance(carMaintenance);
    setSelectedMaintenanceDate(dayjs(carMaintenance.maintenanceDate, 'YYYY-MM-DD').locale('he') ?? '');
    setFileType(carMaintenance.fileType ?? '');
    setSelectedExpirationDate(dayjs(carMaintenance.expirationDate, 'YYYY-MM-DD').locale('he') ?? '');
    setNextKm(carMaintenance.nextMaintenancekilometer ?? '');
    setComments(carMaintenance.comments ?? '');

    handleShowModalFiles();
  }
  const updCarMaintenance = () => {
    if (!checkCarMaintenanceForm())
      return;
    // if(!selectedfile)
    // {
    // let urlfile = decodeURIComponent(String(carMaintenance.fileMaintenance));
    // convertURLToFile(MY_SERVER + urlfile, urlfile.split('/')[2].split('.')[0])
    //   .then((file) => {
    //     setSelectedFile(file);
    //     console.log(file);
    //   })
    //   .catch((error) => {
    //     console.error('Error converting URL to File:', error);
    //   });
    // }
    const carMaintenanceNew: CarMaintenanceModel = {
      id: selectedCarMaintenance?.id,
      car: selectedCarId,
      maintenanceDate: selectedMaintenanceDate!.format('YYYY-MM-DD'),
      // fileMaintenance: selectedFile,
      fileType: fileType,
      expirationDate: selectedExpirationDate!.format('YYYY-MM-DD'),
      nextMaintenancekilometer: nextKm,
      comments: comments,
    }
    if (selectedFile) {
      carMaintenanceNew.fileMaintenance = selectedFile
    }
    dispatch(updateCarMaintenanceAsync({ token: token, carMaintenance: carMaintenanceNew })).then((res) => { });
  }

  // Handles the addition of a car maintenance
  const addCarMaintenance = () => {
    if (!checkCarMaintenanceForm())
      return;
    const carMaintenanceNew: CarMaintenanceModel = {
      car: selectedCarId,
      maintenanceDate: selectedMaintenanceDate!.format('YYYY-MM-DD'),
      fileMaintenance: selectedFile,
      fileType: fileType,
      expirationDate: selectedExpirationDate!.format('YYYY-MM-DD'),
      nextMaintenancekilometer: nextKm,
      comments: comments,
    }
    dispatch(addCarMaintenanceAsync({ token: token, carMaintenance: carMaintenanceNew })).then((res) => { });
  }

  function handleCarDivClick(element: HTMLElement, carid: string): void {
    // if (selectedCarId) {
    //   const mydiv = document.getElementById('divCar-' + selectedCarId);
    //   if (mydiv) {
    //     mydiv.classList.remove('selectedDivBody');
    //   }
    // }
    removeAllHighlights();
    element.classList.add('selectedDivBody');
    setSelectedCarId(carid);
  }
  const removeAllHighlights = () => {
    const elements = document.querySelectorAll('[id^="divCar-"]');
    elements.forEach(element => {
      element.classList.remove('selectedDivBody');
    });
  }


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file || null);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  };
  const handleButtonImgClick = () => {
    if (fileInputImgRef.current !== null) {
      fileInputImgRef.current.click();
    }
  };
  // Gets the cars from the server
  useEffect(() => {
    dispatch(getAllCarsAsync(token))
    dispatch(getFileTypesAsync(token))
    dispatch(getCarMaintenanceAsync(token))
  }, [cars.length, selectedCar])

  // Gets the cars from the server
  useEffect(() => {
    dispatch(getCarMaintenanceAsync(token))
  }, [carMaintenance.length, selectedCarMaintenance])

  // Gets the departments from the server
  useEffect(() => {
    dispatch(getDepsAsync(token))
  }, [])

  useEffect(() => {
    if (errorMessage && errorMessage !== "")
      messageError(errorMessage)
    dispatch(SetError(""))
  }, [errorMessage])

  useEffect(() => {
    if (successMessage && successMessage !== "") {
      message(successMessage)
      handleClose();//close modal car form
      // if (selectedCar) {
      setselectedCar(null);
      setSelectedCarId("");
      removeAllHighlights();
      // }
    }
    dispatch(SetMsg())
  }, [successMessage])
  useEffect(() => {
    if (errorMessageMaintenance && errorMessageMaintenance !== "")
      messageError(errorMessageMaintenance)
    dispatch(SetErrorCarMaintenance(""))
  }, [errorMessageMaintenance])

  useEffect(() => {
    if (successMessageMaintenance && successMessageMaintenance !== "") {
      message(successMessageMaintenance)
      handleCloseModalFiles()//close modal form car maintenance
      setselectedCarMaintenance(null);
    }
    dispatch(SetMsgCarMaintenance())
  }, [successMessageMaintenance])


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
      <div className="row mt-3" style={{ direction: "rtl" }}>
        <div className="mx-auto col-10">
          <div style={{ textAlign: 'left' }}>
            <button style={{ marginLeft: "10px", marginBottom: "10px" }} className="btn btn-primary" onClick={() => { resetModalCars(); handleShow(); }}>הוספת רכב</button>
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

                      <button className="btn btn-primary" style={{ marginTop: '10px' }} onClick={() => updateModalCar(car)}>עריכה</button>
                    </Card.Body>
                    <Card.Footer>
                      <Container>
                        <Row>
                          {fileTypes.map((fileType, index) => {
                            const matchingCarMaintenance = carMaintenance
                              .filter(cm => cm.fileType === fileType.id && cm.car === car.id)
                              .slice(0, 1);

                            if (matchingCarMaintenance.length > 0) {
                              return (
                                <Col key={fileType.id} xs={6} md={6} lg={6} style={{ paddingRight: '5px', paddingLeft: '0' }}>
                                  {matchingCarMaintenance.map((cm, index) => (
                                    <Card style={{ marginBottom: '10px' }}>
                                      <a href={MY_SERVER + cm.fileMaintenance} style={{ textDecoration: 'none', color: 'inherit' }} target="_blank">
                                        <Card.Body style={{ padding: '0' }}>
                                          <Card.Title style={{ fontSize: '1rem' }}>{fileType.name}<br></br>
                                            <small style={{ marginLeft: '10px', fontWeight: 'normal' }}>{cm.expirationDate ? dayjs(cm.expirationDate).format('DD/MM/YYYY') : ''}</small>
                                          </Card.Title>
                                        </Card.Body>
                                      </a>
                                    </Card>
                                  ))}
                                </Col>
                              );
                            }
                            return null; // Render nothing if no matching carMaintenance
                          })}
                        </Row>
                      </Container>
                    </Card.Footer>
                  </Card>
                </Col>

              )}
            </Row>
          </Container>
          {selectedCarId &&
            <form dir="rtl" id="formCarmaintenance" onSubmit={handleFormSubmit} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
              <div style={{ marginTop: '10px' }}>
                <input className='form-control' placeholder='חיפוש' onChange={(e) => setsearchTerm(e.target.value)} style={{ width: '300px', left: '150px' }} />
                <h3 style={{ color: "rgb(19, 125, 141)", marginRight: "10px", marginBottom: "0px", marginTop: "10px" }} >מסמכי רכב</h3><hr />
                <div style={{ textAlign: 'left' }}>
                  {cars.filter(car => String(car.id) === selectedCarId)[0].isDisabled != true &&
                    <button style={{ marginLeft: "10px", marginBottom: "10px" }} className="btn btn-primary" onClick={() => { resetModalFiles(); setselectedCarMaintenance(null); handleShowModalFiles(); }}>הוספת מסמך</button>
                  }
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
                              {/* <a href={MY_SERVER + carMaintenance.car_fileFolderName + carMaintenance.fileMaintenance!.name} style={{ textDecoration: 'none', color: 'inherit' }} target="_blank"> */}
                              <a href={MY_SERVER + carMaintenance.fileMaintenance} style={{ textDecoration: 'none', color: 'inherit' }} target="_blank">
                                <img src={pdfImg} alt="pdfImg" width="36" height="36" className="vertical-align-middle" />
                                <br></br>
                                <small>{decodeURIComponent(String(carMaintenance.fileMaintenance)!.split('/')[2])}</small>
                                {/* <small>{carMaintenance.fileMaintenance && carMaintenance.fileMaintenance.name && (
                                decodeURIComponent(carMaintenance.fileMaintenance.name.substring(1))
                              )}</small> */}
                              </a> <br></br>

                              {dayjs(carMaintenance.maintenanceDate, 'YYYY-MM-DD').format('DD/MM/YYYY')} עד {dayjs(carMaintenance.expirationDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}<br></br>
                              {carMaintenance.nextMaintenancekilometer && (
                                <>
                                  <span className="cardlabel" style={{ marginLeft: '10px' }}>
                                    ק"מ טיפול הבא
                                  </span>
                                  {carMaintenance.nextMaintenancekilometer} ק"מ
                                  <br />
                                </>
                              )}
                              {carMaintenance.comments &&
                                <table style={{ margin: '0 auto' }}>
                                  <tr>
                                    <td style={{ fontWeight: 'bold', display: 'inline-block', textAlign: 'right', paddingLeft: '10px' }}>הערות</td>
                                    <td style={{ textAlign: 'right' }}>{carMaintenance.comments}</td>
                                  </tr>
                                </table>}
                            </Card.Text>
                            <button className="btn btn-primary" style={{ marginTop: '10px' }} onClick={() => updateModalCarMaintenance(carMaintenance)}>עריכה</button>
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
          }

          {/* modal for file type car */}
          <Modal show={showModalFiles} onHide={handleCloseModalFiles} style={{ direction: 'rtl' }}>
            <Modal.Header style={{ backgroundColor: "rgb(19, 125, 141)" }}  >
              {/* <Modal.Title style={{ color: "white" }}>הוספת מסמך לרכב</Modal.Title> */}
              <Modal.Title style={{ color: "white" }}>{selectedCarMaintenance ? ('עדכון מסמך לרכב ') : 'הוספת מסמך לרכב'}</Modal.Title>

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
                      <select className='form-select' value={fileType} onChange={(e) => setFileType(e.target.value)}>
                        <option value="" disabled={true}>בחר סוג מסמך </option>
                        {fileTypes.map((filetype) => (
                          <option key={filetype.id} value={filetype.id}>
                            {filetype.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '10px' }}>תאריך מסמך</td>
                    <td>
                      <div >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={['DatePicker', 'MobileTimePicker']}>
                            {/* Date Picking Component */}
                            <DemoItem >
                              <DatePicker
                                minDate={dayjs()}
                                format='DD-MM-YYYY'
                                value={selectedMaintenanceDate}
                                onChange={handleMaintenanceDate}
                              />
                            </DemoItem>
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '10px' }}>תאריך  תוקף</td>
                    <td>
                      <div >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={['DatePicker', 'MobileTimePicker']}>
                            {/* Date Picking Component */}
                            <DemoItem >
                              <DatePicker
                                minDate={dayjs()}
                                format='DD-MM-YYYY'
                                value={selectedExpirationDate}
                                onChange={handleExpirationDate}
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
                      <button className="btn btn-primary" onClick={handleButtonClick}>בחר קובץ</button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".pdf"
                        onChange={handleFileChange}
                      />
                      {/* {selectedFile && (
                        <a href={selectedCarMaintenance ? (MY_SERVER + decodeURIComponent(String(selectedCarMaintenance.fileMaintenance))) : URL.createObjectURL(selectedFile)} style={{ marginRight: "10px" }} target="_blank" rel="noopener noreferrer">
                          {selectedCarMaintenance ?decodeURIComponent(String(selectedCarMaintenance.fileMaintenance)!.split('/')[2]) :selectedFile?.name}
                        </a>
                      )} */}
                      {selectedFile ?
                        <a href={URL.createObjectURL(selectedFile)} style={{ marginRight: "10px" }} target="_blank" rel="noopener noreferrer">
                          {selectedFile?.name}
                        </a> :
                              (selectedCarMaintenance ?
                                <a href={(MY_SERVER + decodeURIComponent(String(selectedCarMaintenance.fileMaintenance)))} style={{ marginRight: "10px" }} target="_blank" rel="noopener noreferrer">
                                  {decodeURIComponent(String(selectedCarMaintenance.fileMaintenance)!.split('/')[2])}
                                </a>
                                :
                                ''
                              )
                      }
                    </td>
                  </tr>
                  {/* רק בסוג של טיפול רכב מראה את השדה קילומטרז */}
                  {fileType == "5" &&
                    <tr>
                      <td style={{ paddingLeft: '10px' }}>
                        ק"מ טיפול הבא
                      </td>
                      <td style={{ paddingLeft: '10px' }}>
                        <input className='form-control' inputMode="numeric" value={nextKm} pattern="[0-9]*" onChange={(e) => setNextKm(e.target.value)} />
                      </td>
                    </tr>}
                  <tr>
                    <td style={{ paddingLeft: '10px', verticalAlign: "top" }}>
                      הערות
                    </td>
                    <td>
                      <div className="form-floating mb-2">
                        <textarea style={{ width: '100%' }} value={comments} id="filecomment" onChange={(e) => setComments(e.target.value)} rows={3} placeholder="הערות"></textarea>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>

            </Modal.Body>
            <Modal.Footer>
              {/* <Button className="btn btn-primary" onClick={() => addCarMaintenance()}>שמור</Button> */}
              <Button className="btn btn-primary" onClick={() => { selectedCarMaintenance ? updCarMaintenance() : addCarMaintenance() }}>{selectedCarMaintenance ? 'עדכן' : 'שמור'}</Button>
            </Modal.Footer>
          </Modal>

          {/* Modal for cars */}
          <Modal show={show} onHide={handleClose} style={{ direction: 'rtl' }}>
            <Modal.Header style={{ backgroundColor: "rgb(19, 125, 141)" }}  >
              <Modal.Title style={{ color: "white" }}>{selectedCar ? ('עדכון רכב "' + selectedCar.nickName + '"') : 'הוספת רכב'}</Modal.Title>
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
                      <input className='form-control' value={nickName} onChange={(e) => setNickName(e.target.value)} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '10px' }}>מספר רכב</td>
                    <td>
                      <input className='form-control' value={licenseNum} required onChange={(e) => setlicenseNum(e.target.value)} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '10px' }}>יצרן</td>
                    <td>
                      <input className='form-control' value={make} required onChange={(e) => setmake(e.target.value)} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '10px' }}>דגם</td>
                    <td>
                      <input className='form-control' value={model} required onChange={(e) => setmodel(e.target.value)} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '10px' }}>צבע</td>
                    <td>
                      <input className='form-control' value={color} required onChange={(e) => setcolor(e.target.value)} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '10px' }}>שנה</td>
                    <td>
                      <input className='form-control' value={year} required onChange={(e) => setyear(e.target.value)} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '10px' }}>מחלקה</td>
                    <td>
                      <select  className='form-select' value={department} onChange={(e) => setdepartment(e.target.value)}>
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
                      <input className='form-control' value={garageName} onChange={(e) => setGarageName(e.target.value)} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '10px' }}>טלפון מוסך</td>
                    <td>
                      <input className='form-control' value={garagePhone} onChange={(e) => setGaragePhone(e.target.value)} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '10px' }}>תמונת הרכב</td>
                    <td>
                      <button className="btn btn-primary" onClick={handleButtonImgClick}>בחר תמונה</button>
                      <input required
                        type="file"
                        ref={fileInputImgRef}
                        style={{ display: 'none' }}
                        accept=".jpg, .jpeg, .png, .gif"
                        onChange={handleCarImageChange}
                      />
                      {carImage && (
                        <div>
                          <img
                            src={URL.createObjectURL(carImage)}
                            alt={carImage?.name}
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
                        checked={!isChecked}
                        onlabel='כן'
                        offlabel='לא'
                        offstyle="danger"
                        onstyle="success"
                        size='xs'
                        onChange={handleToogle}
                      />

                    </td>
                  </tr>

                </tbody>
              </table>

            </Modal.Body>
            <Modal.Footer>
              <Button className="btn btn-primary" onClick={() => { selectedCar ? updCar() : addCar() }}>{selectedCar ? 'עדכן' : 'שמור'}</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>

  );
}
