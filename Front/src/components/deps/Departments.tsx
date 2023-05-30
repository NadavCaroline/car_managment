import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess } from '../login/loginSlice'
import { addDepAsync, depsSelector, getDepsAsync, updateDepAsync, depError, depMessage, SetError, SetMsg, } from './depsSlicer'
import { allProfileSelector, getAllProfilesAsync } from '../profile/profileSlicer'
import { Card, Container, Row, Col, Badge, Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { DepModel } from '../../models/Deps';


const Departments = () => {

  const dispatch = useAppDispatch()
  const deps = useAppSelector(depsSelector)
  const token = useAppSelector(userAccess)
  const allProfiles = useAppSelector(allProfileSelector)
  const [departmentName, setdepartmentName] = useState("")
  const [showModal, setShowModal] = useState(false)
  const successMessage = useAppSelector(depMessage)
  const errorMessage = useAppSelector(depError)
  const [selectedDep, setselectedDep] = useState<DepModel | null>(null)



  const handleExit = () => {
    setdepartmentName("")
    setselectedDep(null)
    setShowModal(false)
  }

  const checkForm = (): boolean => {
    let msgError = "";
    if (!departmentName) {
      msgError = "נא להכניס שם מחלקה "
    }

    if (msgError) {
      dispatch(SetError(msgError))
      return false;
    }
    return true;
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

  const updateModalDep = (dep: DepModel) => {
    setselectedDep(dep);
    setdepartmentName(dep.name ?? '');
    setShowModal(true);
  }

  const updDep = () => {
    if (!checkForm())
      return;

    const DepNew: DepModel = {
      id: selectedDep?.id,
      name: departmentName,
    }

    dispatch(updateDepAsync({ token: token, dep: DepNew }));
  }

  // Handles the addition of a  dep 
  const addDep = () => {
    if (!checkForm())
      return;
    const depNew: DepModel = {
      name: departmentName
    }
    dispatch(addDepAsync({ token: token, dep: depNew }));
  }

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
    dispatch(getDepsAsync(token))
    // dispatch(getAllProfilesAsync(token))
  }, [deps.length])

  useEffect(() => {
    if (errorMessage && errorMessage !== "")
      messageError(errorMessage)
    dispatch(SetError(""))
  }, [errorMessage])

  useEffect(() => {
    if (successMessage && successMessage !== "") {
      message(successMessage)
      handleExit();//close modal form
      setdepartmentName("");
      setselectedDep(null)
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
        {/* <table align='center'>
          <tr>
            <td><input className='form-control' placeholder='שם מחלקה' onChange={(e) => setdepName(e.target.value)} /></td>
            <td>  <button style={{ marginRight: "10px" }} onClick={() => dispatch(addDepAsync({ token: token, dep: { name: depName } }))} className="btn btn-primary">הוספת מחלקה</button></td>
          </tr>
        </table> */}
        <div style={{ marginTop: '10px' }}>
          <Container>
            <div style={{ textAlign: 'left' }}>
              <button style={{ marginLeft: "10px", marginBottom: "10px" }} className="btn btn-primary" onClick={() => { setdepartmentName(""); setselectedDep(null); setShowModal(true); }} >הוספת מחלקה</button>
            </div>
            <Row className="align-items-stretch" xs={1} md={2} lg={3}>
              {deps.map((dep) => (
                <Col key={dep.id} style={{ marginBottom: '10px' }}>
                  <Card className='h-100 text-center notSelectedDiv' onClick={() => updateModalDep(dep)}>
                    <Card.Body>
                      <Card.Title>{dep.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
          {/* Modal for FileType */}
          <Modal show={showModal} onHide={handleExit} style={{ direction: 'rtl' }}>
            <Modal.Header style={{ backgroundColor: "rgb(19, 125, 141)" }}  >
              <Modal.Title style={{ color: "white" }}>{selectedDep ? ('עדכון  מחלקה') : 'הוספת  מחלקה'}</Modal.Title>
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
                    <td style={{ paddingLeft: '10px' }}>שם מחלקה</td>
                    <td>
                      <input className='form-control' value={departmentName} onChange={(e) => setdepartmentName(e.target.value)} />
                    </td>
                  </tr>
                </tbody>
              </table>

            </Modal.Body>
            <Modal.Footer>
              <Button className="btn btn-primary" onClick={() => { selectedDep ? updDep() : addDep() }}>{selectedDep ? 'עדכן' : 'שמור'}</Button>
            </Modal.Footer>
          </Modal>

        </div>
      </div>
    </div>
    </div>
  )
}

export default Departments