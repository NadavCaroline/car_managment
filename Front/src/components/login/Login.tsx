import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  isLogged,
  loginAsync,
  regAsync,
  logout,
  getDepartmentsAsync,
  getRolesAsync,
  remember,
  dontRemember, userToken, errorMsg, SetErrorMsg
} from './loginSlice';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane
} from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faVcard } from '@fortawesome/free-solid-svg-icons'
import { DepModel } from '../../models/Deps'
import { RolesModel } from '../../models/Roles'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Login() {

  const dispatch = useAppDispatch();
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false);
  const logged = useAppSelector(isLogged)
  const errorMessage = useAppSelector(errorMsg)
  const [listDepartments, setListDepartments] = useState<DepModel[]>([]);
  const [listRoles, setListRoles] = useState<RolesModel[]>([]);
  const [basicActive, setBasicActive] = useState('tabLogin');
  const token = useAppSelector(userToken)

  const [firstName, setFistName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userNameReg, setUserNameReg] = useState("")
  const [email, setEmail] = useState("")
  const [passwordReg, setPasswordReg] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [department, setDepartment] = useState(-1)
  const [role, setRole] = useState(-1)
  const [jobTitle, setJobTitle] = useState("")
  const [Id, setId] = useState(-1)

  

  const handleBasicClick = (value: string) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };
  const message = (value: string) => toast.error(value, {
    position: "top-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });


  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }
  // // Function to load list Roles and update state
  // const getListRoles = async () => {
  //   // const response = await fetch('/api/list');
  //   // const data = await response.json();
  //   const data = [{ id: 0, name: 'עובד' }, { id:1, name: 'אחראי מחלקה' }, { id: 2, name: 'מנהל מערכת' },]
  //   setListRoles(data);
  // };
  useEffect(() => {
    if (errorMessage != "")
      message(errorMessage)
    dispatch(SetErrorMsg())
  }, [errorMessage])

  useEffect(() => {
    // if (!localStorage.getItem("access")) {
    // logout()
    dispatch(getDepartmentsAsync()).then((res) => setListDepartments(res.payload))
    dispatch(getRolesAsync()).then((res) => setListRoles(res.payload))
    // }
  }, [])

  useEffect(() => {
    rememberMe ? dispatch(remember()) : dispatch(dontRemember())
  }, [rememberMe])


  return (
    <div>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="row mt-3" style={{ direction: "ltr" }}>
        <div className="mx-auto col-10 col-md-8 col-lg-6">
          <MDBTabs pills fill className='mb-3'>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleBasicClick('tabLogin')} active={basicActive === 'tabLogin'}>
                <FontAwesomeIcon icon={faUser} style={{ paddingRight: "1em" }} />
                Log in
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleBasicClick('tabRegister')} active={basicActive === 'tabRegister'}>
                <FontAwesomeIcon icon={faVcard} style={{ paddingRight: "1em" }} />
                Register
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>

          <MDBTabsContent>
            <MDBTabsPane show={basicActive === 'tabLogin'}>
              <form onSubmit={onSubmit} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
                <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >Log in</h1>
                <div className="form-floating mb-2">
                  <input type="text" onChange={(e) => setusername(e.target.value)} className="form-control" id="floatingInput" placeholder="User name" required />
                  <label htmlFor="floatingInput">User name</label>
                  <div className="invalid-feedback">
                    Please provide a User name.
                  </div>
                </div>
                <div className="form-floating">
                  <input type="password" onChange={(e) => setpassword(e.target.value)} className="form-control" id="floatingPassword" placeholder="Password" required />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="row mb-2" style={{ marginTop: "1.5rem " }}>
                  <div className="col-md-6 d-flex justify-content-center">
                    <div className="form-check mb-3 mb-md-0">
                      <input className="form-check-input" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} id="loginCheck" />
                      <label className="form-check-label" htmlFor="loginCheck"> Remember me </label>
                    </div>
                  </div>

                  <div className="col-md-6 d-flex justify-content-center">
                    {/* <!-- Simple link --> */}
                    <a href="#!">Forgot password?</a>
                  </div>
                </div>

                <div className="col text-center">
                  <button type='submit' onClick={() => dispatch(loginAsync({ username, password }))} className="btn btn-primary" >Log in</button>
                </div>
              </form>
            </MDBTabsPane>
            <MDBTabsPane show={basicActive === 'tabRegister'}>
              <form onSubmit={onSubmit} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
                <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >Register</h1>
                {/* <!-- First Name input --> */}
                <div className="form-floating mb-2">
                  <input type="text" id="registerFistName" onChange={(e) => setFistName(e.target.value)} className="form-control" placeholder="First Name" required />
                  <label className="form-label" htmlFor="registerFisrtName" style={{ marginLeft: "0px" }}>First Name</label>
                </div>
                {/* <!-- Last Name input --> */}
                <div className="form-floating mb-2">
                  <input type="text" id="registerLastName" onChange={(e) => setLastName(e.target.value)} className="form-control" placeholder="Last Name" required />
                  <label className="form-label" htmlFor="registerLastName" style={{ marginLeft: "0px" }}>Last Name</label>
                </div>
                {/* <!-- Username input --> */}
                <div className="form-floating mb-2">
                  <input type="text" id="registerUsername" onChange={(e) => setUserNameReg(e.target.value)} className="form-control" placeholder="Username" required />
                  <label className="form-label" htmlFor="registerUsername" style={{ marginLeft: "0px" }}>Username</label>
                </div>
                {/* <!-- ID input --> */}
                <div className="form-floating mb-2">
                  <input type="number" id="registerId" onChange={(e) => setId(Number(e.target.value))} className="form-control" placeholder="ID" required />
                  <label className="form-label" htmlFor="registerId" style={{ marginLeft: "0px" }}>ID</label>
                </div>
                {/* <!-- Email input --> */}
                <div className="form-floating mb-2">
                  <input type="email" id="registerEmail" onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Email" required />
                  <label className="form-label" htmlFor="registerEmail" style={{ marginLeft: "0px" }}>Email</label>
                </div>
                {/* <!-- Password input --> */}
                <div className="form-floating mb-2">
                  <input type="password" id="registerPassword" onChange={(e) => setPasswordReg(e.target.value)} className="form-control" placeholder="Password" required />
                  <label className="form-label" htmlFor="registerPassword" style={{ marginLeft: "0px" }} >Password</label>
                </div>
                {/* <!-- Repeat Password input --> */}
                <div className="form-floating mb-2">
                  <input type="password" id="registerRepeatPassword" onChange={(e) => setRepeatPassword(e.target.value)} className="form-control" placeholder=" Repeat password" required />
                  <label className="form-label" htmlFor="registerRepeatPassword" style={{ marginLeft: "0px" }}>Repeat password</label>
                </div>
                {/* <!-- Department select --> */}
                <div className="form-floating mb-2">
                  <select id="selectDepartment" onChange={(e) => setDepartment(Number(e.target.value))} className="form-select" defaultValue={'DEFAULT'} required>
                    <option value="DEFAULT" disabled>Choose a Department ...</option>
                    {listDepartments.map(item => (
                      <option value={item.id} key={item.id} >{item.name}</option>
                    ))}
                    {/* <option value="1">It</option>
                  <option value="2">Dev</option>
                  <option value="3">Gis</option> */}
                  </select>
                  <label className="form-label" htmlFor="selectDepartment" style={{ marginLeft: "0px" }}>Department</label>
                </div>
                {/* <!-- Role level select --> */}
                <div className="form-floating mb-2">
                  <select id="selectRole" onChange={(e) => setRole(Number(e.target.value))} className="form-select" defaultValue={'DEFAULT'} required>
                    <option value="DEFAULT" disabled>Choose a Role ...</option>
                    {listRoles.map(item => (
                      <option value={item.id} key={item.id}>{item.name}</option>
                    ))}
                    {/* <option value="0">עובד</option>
                  <option value="1">אחראי מחלקה</option>
                  <option value="2">מנהל מערכת</option> */}
                  </select>
                  <label className="form-label" htmlFor="selectRole" style={{ marginLeft: "0px" }}>Role Level</label>
                </div>
                {/* <!-- JobTitle input --> */}
                <div className="form-floating mb-2">
                  <input type="text" id="registerJobTitle" onChange={(e) => setJobTitle(e.target.value)} className="form-control" placeholder="JobTitle" required />
                  <label className="form-label" htmlFor="registerJobTitle" style={{ marginLeft: "0px" }}>JobTitle</label>
                </div>
                {/* <button type="submit" className="btn btn-primary btn-block mb-3">Register</button> */}

                <button type='submit'  onClick={() => dispatch(regAsync({  user: { first_name: firstName, last_name: lastName,password:passwordReg, username: userNameReg,email:email },profile:{jobTitle: jobTitle, roleLevel: role, department: department, realID:Id } }))} className="btn btn-primary btn-block mb-3">Register</button>
              </form>
            </MDBTabsPane>
          </MDBTabsContent>
        </div>
      </div>

    </div>
  );
}
