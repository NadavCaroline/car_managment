import React, { useState, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { MaintenanceTypeModel } from '../../models/MaintenanceType'
import { addMaintenanceTypeAsync,maintenanceTypeSelector ,getmaintenanceTypeAsync, maintenanceTypeError, maintenanceTypeMessage, SetError, SetMsg, updateMaintenanceTypeAsync } from '../maintenanceType/maintenanceTypeSlice';
import { userToken } from '../login/loginSlice'
import { Card, Container, Row, Col, Badge, Button, Modal } from "react-bootstrap";
import { MY_SERVER } from '../../env';
import { ToastContainer, toast } from 'react-toastify';


const MaintenanceType = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector(userToken)
  // const [listMaintenanceType, setListMaintenanceTypes] = useState<MaintenanceTypeModel[]>([]);
  const [showModal, setShowModal] = useState(false)
  const [selectedMaintenance, setselectedMaintenance] = useState<MaintenanceTypeModel | null>(null)
  const [maintenanceImage, setMaintenanceImage] = useState<File | null>(null)
  const [maintenanceName, setMaintenanceName] = useState("")
  const fileInputImgRef = useRef<HTMLInputElement | null>(null);
  const successMessage = useAppSelector(maintenanceTypeMessage)
  const errorMessage = useAppSelector(maintenanceTypeError)
  const maintenanceType = useAppSelector(maintenanceTypeSelector)

  // Handles image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaintenanceImage(e.target!.files![0])
  };

  const handleButtonImgClick = () => {
    if (fileInputImgRef.current !== null) {
      fileInputImgRef.current.click();
    }
  };
  const handleExit = () => {
    setselectedMaintenance(null)
    setShowModal(false)
  }
  const resetModal = () => {
    setselectedMaintenance(null)
    setMaintenanceImage(null)
    setMaintenanceName("")
  };

  const checkMaintenanceForm = (): boolean => {
    let msgError = "";
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
    if (!maintenanceName) {
      msgError = "נא להכניס שם תורנות "
    }
    else if (maintenanceImage && !imageExtensions.includes(maintenanceImage.name.split('.').pop()?.toLowerCase() ?? '')) {
      msgError = "בחר קובץ מסוג תמונה"
    }
    if (msgError) {
      dispatch(SetError(msgError))
      return false;
    }
    return true;
  }
  const updMaintenance = () => {
    if (!checkMaintenanceForm())
      return;
    
    const maintenanceTypeNew:MaintenanceTypeModel = {
      id: selectedMaintenance?.id,
      name: maintenanceName,
    }
    if (maintenanceImage) {
      maintenanceTypeNew.imgLogo = maintenanceImage
    }
    dispatch(updateMaintenanceTypeAsync({ token: token, maintenanceType: maintenanceTypeNew}));
  }

  // Handles the addition of a  maintenance type
  const addMaintenance = () => {
    if (!checkMaintenanceForm())
      return;
    const maintenanceTypeNew: MaintenanceTypeModel = {
      name: maintenanceName,
    }
   if (maintenanceImage) {
      maintenanceTypeNew.imgLogo = maintenanceImage
    }
    dispatch(addMaintenanceTypeAsync({ token: token, maintenanceType: maintenanceTypeNew }));
  }

  const updateModalMaintenance = (maintenanceType: MaintenanceTypeModel) => {
    setselectedMaintenance(maintenanceType);
    setMaintenanceName(maintenanceType.name ?? '');
    setMaintenanceImage(null);
    setShowModal(true);
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
  
  useEffect(() => {
    dispatch(getmaintenanceTypeAsync(token))
  }, [,maintenanceType.length])

  useEffect(() => {
    if (errorMessage && errorMessage !== "")
      messageError(errorMessage)
    dispatch(SetError(""))
  }, [errorMessage])

  useEffect(() => {
    if (successMessage && successMessage !== "") {
      message(successMessage)
      handleExit();//close modal form
      resetModal();
    }
    dispatch(SetMsg())
  }, [successMessage])

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
          <div style={{ marginTop: '10px' }}>
            <Container>
              <div style={{ textAlign: 'left' }}>
                <button style={{ marginLeft: "10px", marginBottom: "10px" }} className="btn btn-primary" onClick={() => { resetModal(); setShowModal(true); }} >הוספת סוג תורנות</button>
              </div>

              <Row className="align-items-stretch" xs={1} md={2} lg={3}>
                {maintenanceType.map((maintenanceType) => (
                  <Col key={maintenanceType.id} style={{ marginBottom: '10px' }}>
                    <Card className='h-100 text-center notSelectedDiv' onClick={() => updateModalMaintenance(maintenanceType)}>
                      <Card.Body>
                        <Card.Title>{maintenanceType.name}</Card.Title>
                        <img src={MY_SERVER + maintenanceType.imgLogo} style={{ width: '50px', height: '50px' }} alt={"imglogo"} />
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
            {/* Modal for maintenance */}
            <Modal show={showModal} onHide={handleExit} style={{ direction: 'rtl' }}>
              <Modal.Header style={{ backgroundColor: "rgb(19, 125, 141)" }}  >
                <Modal.Title style={{ color: "white" }}>{selectedMaintenance ? ('עדכון סוג תורנות') : 'הוספת סוג תורנות'}</Modal.Title>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  style={{ color: 'white' }}
                  onClick={handleExit}
                ></button>
              </Modal.Header>
              <Modal.Body>
                <table>
                  <tbody>
                    <tr>
                      <td style={{ paddingLeft: '10px' }}>שם סוג תורנות</td>
                      <td>
                        <input className='form-control' value={maintenanceName} onChange={(e) => setMaintenanceName(e.target.value)} />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingLeft: '10px', paddingTop: '10px'}}>לוגו סוג רכב</td>
                      <td style={{  paddingTop: '10px'}}>
                        <button className="btn btn-primary" onClick={handleButtonImgClick}>בחר תמונה</button>
                        <input required
                          type="file"
                          ref={fileInputImgRef}
                          style={{ display: 'none' }}
                          accept=".jpg, .jpeg, .png, .gif"
                          onChange={handleImageChange}
                        />
                        {maintenanceImage && (
                          <div style={{  paddingTop: '10px'}}>
                            <img
                              src={URL.createObjectURL(maintenanceImage)}
                              alt={maintenanceImage?.name}
                              style={{ width: '150px', height: '100px' }}
                            /><br />
                          </div>
                        )}
                        {!maintenanceImage && selectedMaintenance?.imgLogo && (
                          <div style={{  paddingTop: '10px'}}>
                            <img
                              src={MY_SERVER + selectedMaintenance?.imgLogo}
                              alt={String(selectedMaintenance.id)}
                              style={{ width: '150px', height: '100px' }}
                            /><br />
                          </div>
                        )}
                        
                      </td>
                    </tr>
                  </tbody>
                </table>

              </Modal.Body>
              <Modal.Footer>
                <Button className="btn btn-primary" onClick={() => { selectedMaintenance ? updMaintenance() : addMaintenance() }}>{selectedMaintenance ? 'עדכן' : 'שמור'}</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceType