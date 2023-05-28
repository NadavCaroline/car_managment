import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getUsersAsync, updateUserAsync, usersSelector, userError, userMessage, SetError, SetMsg } from './userSlicer'
import { userAccess, getRolesAsync } from '../login/loginSlice'
import { allProfileSelector, getAllProfilesAsync, getProfileAsync, updateProfileAsync } from '../profile/profileSlicer'
import { UserModel } from '../../models/User';
import { ProfileModel } from '../../models/Profile';
import { MY_SERVER } from '../../env'
import { depsSelector, getDepsAsync } from '../deps/depsSlicer'
import { FaEdit } from 'react-icons/fa';
import { Card, Container, Row, Col, Badge, Button, Modal } from "react-bootstrap";
import { RolesModel } from '../../models/Roles'
import { ToastContainer, toast } from 'react-toastify';


const Users = () => {
  const dispatch = useAppDispatch()
  const users = useAppSelector(usersSelector)
  const allProfiles = useAppSelector(allProfileSelector)
  const token = useAppSelector(userAccess)
  const departments = useAppSelector(depsSelector)
  const [searchTerm, setsearchTerm] = useState("")
  const [selectedUser, setselectedUser] = useState<UserModel | null>(null)
  const [selectedUserProfile, setselectedUserProfile] = useState<ProfileModel | null>(null)
  const [editMode, seteditMode] = useState(false)
  const updateUserModel: UserModel = {}
  const updateProfileModel: ProfileModel = {}
  const [newFirstName, setnewFirstName] = useState("")
  const [newLastName, setnewLastName] = useState("")
  const [newUserName, setnewUserName] = useState("")
  const [newId, setnewId] = useState("")
  const [selectedDep, setselectedDep] = useState("")
  const [newMail, setnewMail] = useState("")
  const [newTitle, setnewTitle] = useState("")
  const [listRoles, setListRoles] = useState<RolesModel[]>([]);
  const [newRole, setnewRole] = useState("")
  const [profileID, setprofileID] = useState("")
  const successMessage = useAppSelector(userMessage)
  const errorMessage = useAppSelector(userError)
  const [filterDep, setFilterDep] = useState("")

  useEffect(() => {
    dispatch(getUsersAsync(token))
    dispatch(getAllProfilesAsync(token))
    dispatch(getDepsAsync(token))
    dispatch(getRolesAsync()).then((res) => setListRoles(res.payload))
  }, [])

  useEffect(() => {
    if (selectedUser) {
      let profile: ProfileModel = allProfiles.filter(profile => profile.user === selectedUser.id)[0]
      // setselectedUserProfile(profile)
      setnewFirstName(String(selectedUser.first_name))
      setnewLastName(String(selectedUser.last_name))
      setnewUserName(String(selectedUser.username))
      setnewId(String(profile?.realID))
      setselectedDep(String(profile?.department))
      setnewMail(String(selectedUser.email))
      setnewTitle(String(profile?.jobTitle))
      setnewRole(String(profile?.roleLevel))
      setprofileID(String(profile?.id))
    }
    else {
      setselectedUserProfile(null)
      setnewFirstName("")
      setnewLastName("")
      setnewUserName("")
      setnewId("")
      setselectedDep("")
      setnewMail("")
      setnewTitle("")
      setnewRole("")
    }

  }, [selectedUser])
  const checkUserForm = (): boolean => {
    let msgError = "";
    const emailRegExp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!newFirstName) {
      msgError = "נא להזין שם פרטי"
    }
    else if (!newLastName) {
      msgError = "נא להזין שם משפחה"
    }
    else if (!newUserName) {
      msgError = "נא להזין שם משתמש"
    }
    else if (newUserName.length < 4) {
      msgError = 'שם משתמש חייב להיות מעל 4 אותיות'
    }
    else if (newUserName.length > 20) {
      msgError = 'שם משתמש חייב להיות עד 20 אותיות'
    }

    else if (!newId) {
      msgError = "נא להזין תעודת זהות"
    }
    else if (newId.length != 9) {
      msgError = 'נא להכניס תעודת זהות בעל 9 ספרות'
    }
    else if (!emailRegExp.test(newMail)) {
      msgError = 'מייל לא תקין'
    }
    else if (!selectedDep) {
      msgError = "נא לבחור מחלקה"
    }
    else if (!newRole) {
      msgError = "נא לבחור הרשאה"
    }
    else if (!newTitle) {
      msgError = "נא להזין תפקיד"
    }
    if (msgError) {
      dispatch(SetError(msgError))
      return false;
    }

    return true;
  }
  const handleUpdateUserData = () => {

    if (!checkUserForm())
      return;
    newFirstName && (updateUserModel.first_name = newFirstName)
    newLastName && (updateUserModel.last_name = newLastName)
    newUserName && (updateUserModel.username = newUserName)
    newMail && (updateUserModel.email = newMail)
    newId && (updateProfileModel.realID = Number(newId))
    selectedDep && (updateProfileModel.department = Number(selectedDep))
    newRole && (updateProfileModel.roleLevel = Number(newRole))
    newTitle && (updateProfileModel.jobTitle = newTitle)
    if (updateUserModel) {
      updateUserModel.id = selectedUser?.id
    }
    if (updateProfileModel) {
      updateProfileModel.id = Number(profileID)//selectedUserProfile?.id
    }
    updateUserModel && dispatch(updateUserAsync({ token: token, user: updateUserModel }))
    updateProfileModel && dispatch(updateProfileAsync({ token: token, profile: updateProfileModel }))
  }

  const handleeditExit = () => {
    setselectedUser(null)
    seteditMode(false)
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
    if (errorMessage && errorMessage !== "")
      messageError(errorMessage)
    dispatch(SetError(""))
  }, [errorMessage])

  useEffect(() => {
    if (successMessage && successMessage !== "") {
      message(successMessage)
      handleeditExit();//close modal 
      dispatch(getUsersAsync(token))
      dispatch(getAllProfilesAsync(token))
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

      <div style={{ marginTop: '10px' }}>
        <Container>
          <table style={{ marginBottom: '10px' }}>
            <tr>
              <td> <input className='form-control' placeholder='חיפוש לפי משתמש ושם' onChange={(e) => setsearchTerm(e.target.value)} style={{ width: '200px', left: '150px' }} /></td>
              <td style={{ paddingRight: '10px' }}>
                <select className='form-select' value={filterDep} onChange={(e) => setFilterDep(e.target.value)}>
                  <option value="" >סינון לפי מחלקה </option>
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </table>


          <Row className="align-items-stretch" xs={1} md={2} lg={3} >

            {
              users &&
              users
                .filter(
                  (user) =>
                  (user.first_name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                    user.last_name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()))
                )
                .map((user) => {
                  return (
                    allProfiles &&
                    allProfiles
                      .filter((profile) => profile.user === user.id && (!filterDep || profile.department == Number(filterDep)))
                      .map((profile) => {
                        // Perform actions on each matching profile
                        return (
                          <Col style={{ marginBottom: '10px' }}>
                            <Card id={`divUser-${user.id}`} className='h-100 text-center notSelectedDiv'   >
                              <Card.Body >
                                <Card.Title>
                                  <table style={{ width: '100%' }}>
                                    <tr>
                                      <td style={{ width: '20px' }}>
                                        {user.first_name}   {user.last_name}
                                      </td>
                                    </tr>
                                  </table>

                                </Card.Title>
                                <Card.Text>
                                  <table style={{ margin: '0 auto' }}>
                                    <tbody>
                                      <tr>
                                        <td style={{ textAlign: 'right', paddingLeft: '10px' }}>שם משתמש:</td>
                                        <td style={{ textAlign: 'right' }}>{user.username}</td>
                                      </tr>
                                      <tr>
                                        <td style={{ textAlign: 'right' }}>ת"ז:</td>
                                        <td style={{ textAlign: 'right' }}>{profile?.realID}</td>
                                      </tr>
                                      <tr>
                                        <td style={{ textAlign: 'right' }}>מייל:</td>
                                        <td style={{ textAlign: 'right' }}>{user.email}</td>
                                      </tr>
                                      <tr>
                                        <td style={{ textAlign: 'right' }}>מחלקה:</td>
                                        <td style={{ textAlign: 'right' }}>{profile?.dep_name}</td>
                                      </tr>
                                      <tr>
                                        <td style={{ textAlign: 'right' }}>תפקיד:</td>
                                        <td style={{ textAlign: 'right' }}>{profile?.jobTitle}</td>
                                      </tr>
                                      <tr>
                                        <td style={{ textAlign: 'right' }}>רמת הרשאות:</td>
                                        <td style={{ textAlign: 'right' }}>{profile?.role_name}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Card.Text>

                                <button className="btn btn-primary" style={{ marginTop: '10px' }} onClick={() => { setselectedUser(user); seteditMode(true) }}>עריכה</button>
                              </Card.Body>
                            </Card>
                          </Col>
                        )
                      })
                  )
                })
            }


            {/* {users && users.filter(user => user.first_name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
              user.last_name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())).map(user =>
               

              )} */}
          </Row>
        </Container>
        {/* Modal for users */}
        <Modal show={editMode} onHide={handleeditExit} style={{ direction: 'rtl' }}>
          <Modal.Header style={{ backgroundColor: "rgb(19, 125, 141)" }}  >
            <Modal.Title style={{ color: "white" }}>{'עדכון משתמש "' + selectedUser?.first_name + ' ' + selectedUser?.last_name + '"'}</Modal.Title>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              style={{ color: 'white' }}
              onClick={handleeditExit}
            ></button>
          </Modal.Header>
          <Modal.Body>
            <table>
              <tbody>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>שם פרטי</td>
                  <td>
                    <input className='form-control'  value={newFirstName} onChange={(e) => setnewFirstName(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>שם משפחה </td>
                  <td>
                    <input className='form-control'  value={newLastName} required onChange={(e) => setnewLastName(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>שם משתמש</td>
                  <td>
                    <input className='form-control'  value={newUserName} required onChange={(e) => setnewUserName(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>ת"ז</td>
                  <td>
                    <input className='form-control'  value={newId} required onChange={(e) => setnewId(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>מייל</td>
                  <td>
                    <input className='form-control' value={newMail} required onChange={(e) => setnewMail(e.target.value)} />
                  </td>
                </tr>

                <tr>
                  <td style={{ paddingLeft: '10px' }}>מחלקה</td>
                  <td>
                    <select className='form-select' value={selectedDep} onChange={(e) => setselectedDep(e.target.value)}>
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
                  <td style={{ paddingLeft: '10px' }}>תפקיד</td>
                  <td>
                    <input className='form-control' value={newTitle} required onChange={(e) => setnewTitle(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '10px' }}>הרשאה</td>
                  <td>
                    <select className='form-select' value={newRole} onChange={(e) => setnewRole(e.target.value)}>
                      <option value="" disabled>בחר הרשאה...</option>
                      {listRoles.map(item => (
                        <option value={item.id} key={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>

          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-primary" onClick={() => { handleUpdateUserData() }}>{'עדכן'}</Button>
          </Modal.Footer>
        </Modal>

      </div >

    </div >
  )
}

export default Users