import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  isLogged,
  loginAsync,
  logout,
  getDepartmentsAsync,
  getRolesAsync,
  remember,
  dontRemember
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


export function Login() {

  const dispatch = useAppDispatch();
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false);
  const logged = useAppSelector(isLogged)
  const [listDepartments, setListDepartments] = useState<DepModel[]>([]);
  const [listRoles, setListRoles] = useState<RolesModel[]>([]);
  const [basicActive, setBasicActive] = useState('tabLogin');

  const handleBasicClick = (value: string) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };

  const onSubmit = (e: any) => {
    console.log(e)
    
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
    if (!localStorage.getItem("access")) {
      logout()
      dispatch(getDepartmentsAsync()).then((res) => setListDepartments(res.payload))
      dispatch(getRolesAsync()).then((res) => setListRoles(res.payload))
    }
  }, [])

  useEffect(() => {
    rememberMe ? dispatch(remember()) : dispatch(dontRemember())
  }, [rememberMe])


  return (
    <div>

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
              <form style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
                <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >Register</h1>
                {/* <!-- First Name input --> */}
                <div className="form-floating mb-2">
                  <input type="text" id="registerFistName" className="form-control" placeholder="First Name" required />
                  <label className="form-label" htmlFor="registerFisrtName" style={{ marginLeft: "0px" }}>First Name</label>
                </div>
                {/* <!-- Last Name input --> */}
                <div className="form-floating mb-2">
                  <input type="text" id="registerLastName" className="form-control" placeholder="Last Name" required />
                  <label className="form-label" htmlFor="registerLastName" style={{ marginLeft: "0px" }}>Last Name</label>
                </div>
                {/* <!-- Username input --> */}
                <div className="form-floating mb-2">
                  <input type="text" id="registerUsername" className="form-control" placeholder="Username" required />
                  <label className="form-label" htmlFor="registerUsername" style={{ marginLeft: "0px" }}>Username</label>
                </div>
                {/* <!-- Email input --> */}
                <div className="form-floating mb-2">
                  <input type="email" id="registerEmail" className="form-control" placeholder="Email" required />
                  <label className="form-label" htmlFor="registerEmail" style={{ marginLeft: "0px" }}>Email</label>
                </div>
                {/* <!-- Password input --> */}
                <div className="form-floating mb-2">
                  <input type="password" id="registerPassword" className="form-control" placeholder="Password" required />
                  <label className="form-label" htmlFor="registerPassword" style={{ marginLeft: "0px" }} >Password</label>
                </div>
                {/* <!-- Repeat Password input --> */}
                <div className="form-floating mb-2">
                  <input type="password" id="registerRepeatPassword" className="form-control" placeholder=" Repeat password" required />
                  <label className="form-label" htmlFor="registerRepeatPassword" style={{ marginLeft: "0px" }}>Repeat password</label>
                </div>
                {/* <!-- Submit button --> */}
                <div className="form-floating mb-2">
                  <select id="selectDepartment" className="form-select" defaultValue={'DEFAULT'} required>
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
                <div className="form-floating mb-2">
                  <select id="selectRole" className="form-select" defaultValue={'DEFAULT'} required>
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
                <button type="submit" className="btn btn-primary btn-block mb-3">Register</button>
              </form>
            </MDBTabsPane>
          </MDBTabsContent>
        </div>
      </div>

    </div>
  );
}
