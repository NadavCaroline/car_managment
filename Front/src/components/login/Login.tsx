import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Reset from './Reset';
import Forgot from './Forgot'

import {
  // isLogged,
  // logout,
  loginAsync,
  regAsync,
  getDepartmentsAsync,
  getRolesAsync,
  remember,
  dontRemember, userToken, loginError, SetError, loginMsg, SetMsg,sformToShow,SetFormLogin,SetFormForgot
} from './loginSlice';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane
} from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faVcard, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { DepModel } from '../../models/Deps'
import { RolesModel } from '../../models/Roles'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Link, Outlet ,useOutlet} from 'react-router-dom';

export function Login() {

  const dispatch = useAppDispatch();
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false);
  // const logged = useAppSelector(isLogged)
  const errorMessage = useAppSelector(loginError)
  const loginMessage = useAppSelector(loginMsg)
  const [listDepartments, setListDepartments] = useState<DepModel[]>([]);
  const [listRoles, setListRoles] = useState<RolesModel[]>([]);
  const [basicActive, setBasicActive] = useState('tabLogin');
  const token = useAppSelector(userToken)
  const [passwordShown, setPasswordShown] = useState(false);
  const formToShow =useAppSelector(sformToShow) ;
  const outlet = useOutlet();
  console.log("outlet");
  console.log(outlet);
  // const isComponentInOutlet =  false;//outlet?.('my-outlet') !== null;



  type UserSubmitForm = {
    firstName: string;
    lastName: string;
    userName: string;
    id: number;
    email: string;
    password: string;
    confirmPassword: string;
    department: number;
    role: number
    jobTitle: string;
    // acceptTerms: boolean;
  };
  const emailRegExp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('נא להזין שם פרטי'),
    lastName: Yup.string().required('נא להזין שם משפחה'),
    userName: Yup.string()
      .required('נא להזין שם משתמש')
      .min(4, 'שם משתמש חייב להיות מעל 4 אותיות')
      .max(20, 'שם משתמש חייב להיות עד 20 אותיות'),
    id: Yup.string()
      .required('נא להזין תעודת זהות ')
      .min(9, 'נא להכניס תעודת זהות בעל 9 ספרות')
      .max(9, 'נא להכניס תעודת זהות בעל 9 ספרות'),
    email: Yup.string()
      .required('נא להזין מייל')
      .email('מייל לא תקין')
      .matches(emailRegExp, 'מייל לא תקין'),
    password: Yup.string()
      .required('נא להזין סיסמא')
      .min(4, 'סיסמא חייבת להיות לפחות 4 תווים')
      .max(40, 'ססימא חייבת להיות עד 40 תווים'),
    confirmPassword: Yup.string()
      .required('נא להזין אימות סיסמא')
      .oneOf([Yup.ref('password')], 'אימות סיסמא לא תואם לסיסמא שהכנסת'),
    department: Yup.string()
      .required('נא לבחור מחלקה'),
    role: Yup.string()
      .required('נא להזין הרשאה'),
    jobTitle: Yup.string()
      .required('נא להזין תפקיד')
    // acceptTerms: Yup.bool().oneOf([true], 'Accept Terms is required')
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginAsync({ username, password }))
  }
  const onSubmitReg = (data: UserSubmitForm) => {
    console.log(JSON.stringify(data, null, 2));
    dispatch(regAsync({ user: { first_name: data.firstName, last_name: data.lastName, password: data.password, username: data.userName, email: data.email }, profile: { jobTitle: data.jobTitle, roleLevel: data.role, department: data.department, realID: data.id } }));
  };

  const handleBasicClick = (value: string) => {
    if (value === 'tabLogin') {
      dispatch(SetFormLogin());
    }
    if (value === basicActive) {
      return;
    }
    setBasicActive(value);
  };
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
  });

  useEffect(() => {
    if (errorMessage && errorMessage !== "")
      messageError(errorMessage)
    dispatch(SetError())
  }, [errorMessage])

  useEffect(() => {
    if (loginMessage && loginMessage !== "")
      message(loginMessage)
    dispatch(SetMsg())
  }, [loginMessage])


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

  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };
  const forgotClick = () => {
    dispatch(SetFormForgot());
  };
  
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
              {formToShow === 'login' && !outlet &&
                <form onSubmit={onSubmitLogin} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
                  <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >Log in</h1>
                  <div className="form-floating mb-2">
                    <input type="text" onChange={(e) => setusername(e.target.value)} className="form-control" id="floatingInput" placeholder="User name" required />
                    <label htmlFor="floatingInput">User name</label>
                    <div className="invalid-feedback">
                      Please provide a User name.
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <div className="form-floating">
                      <input type={passwordShown ? "text" : "password"} onChange={(e) => setpassword(e.target.value)} className="form-control" id="floatingPassword" placeholder="Password" required />
                      <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <span onClick={togglePassword} className="input-group-text">
                      <i onClick={togglePassword} className="fa fa-eye" id="togglePassword" style={{ cursor: "pointer" }}>
                        {passwordShown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                      </i>
                    </span>
                  </div>
                  {/* <div className="form-floating">
                  <input type="password" onChange={(e) => setpassword(e.target.value)} className="form-control" id="floatingPassword" placeholder="Password" required />
                  <label htmlFor="floatingPassword">Password</label>
                </div> */}
                  <div className="row mb-2" style={{ marginTop: "1.5rem " }}>
                    <div className="col-md-6 d-flex justify-content-center">
                      <div className="form-check mb-3 mb-md-0">
                        <input className="form-check-input" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} id="loginCheck" />
                        <label className="form-check-label" htmlFor="loginCheck"> Remember me </label>
                      </div>
                    </div>

                    <div className="col-md-6 d-flex justify-content-center">
                      {/* <!-- Simple link --> */}
                      <a href="#!" style={{ cursor: "pointer" }} onClick={forgotClick}>Forgot password</a>
                      {/* <Link to='/forgot' onClick={() => setStatus("forgot")} >Forgot password</Link> */}
                    </div>
                  </div>

                  <div className="col text-center">
                    <button type='submit'  className="btn btn-primary" >Log in</button>
                  </div>
                </form>
              }
              {formToShow === 'forgot' &&
                <Forgot />
              }
               {formToShow === 'reset' &&
                <Reset />
              }
              <Outlet/>
            </MDBTabsPane>
            <MDBTabsPane show={basicActive === 'tabRegister'}>
              <form id="formRegister" onSubmit={handleSubmit(onSubmitReg)} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
                <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >Register</h1>
                {/* <!-- First Name input --> */}
                <div className="form-floating mb-2">
                  <input type="text" id="registerFirstName" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} placeholder="First Name" />
                  <div className="invalid-feedback">{errors.firstName?.message}</div>
                  <label className="form-label" htmlFor="registerFirstName" style={{ marginLeft: "0px" }}>First Name</label>
                </div>
                {/* <!-- Last Name input --> */}
                <div className="form-floating mb-2">
                  <input type="text" id="registerLastName"  {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} placeholder="Last Name" />
                  <div className="invalid-feedback">{errors.lastName?.message}</div>
                  <label className="form-label" htmlFor="registerLastName" style={{ marginLeft: "0px" }}>Last Name</label>
                </div>
                {/* <!-- Username input --> */}
                <div className="form-floating mb-2">
                  <input type="text" id="registerUsername"  {...register('userName')} className={`form-control ${errors.userName ? 'is-invalid' : ''}`} placeholder="User Name" />
                  <div className="invalid-feedback">{errors.userName?.message}</div>
                  <label className="form-label" htmlFor="registerUsername" style={{ marginLeft: "0px" }}>Username</label>
                </div>
                {/* <!-- ID input --> */}
                <div className="form-floating mb-2">
                  <input type="number" id="registerId" {...register('id')} className={`form-control ${errors.id ? 'is-invalid' : ''}`} placeholder="Id" />
                  <div className="invalid-feedback">{errors.id?.message}</div>
                  <label className="form-label" htmlFor="registerId" style={{ marginLeft: "0px" }}>ID</label>
                </div>
                {/* <!-- Email input --> */}
                <div className="form-floating mb-2">
                  <input type="email" id="registerEmail"   {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="Email" />
                  <div className="invalid-feedback">{errors.email?.message}</div>
                  <label className="form-label" htmlFor="registerEmail" style={{ marginLeft: "0px" }}>Email</label>
                </div>
                {/* <!-- Password input --> */}
                <div className="input-group mb-3">
                  <div className="form-floating">
                    <input type={passwordShown ? "text" : "password"} {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="Password" id="registerPassword" />
                    <label htmlFor="registerPassword" style={{ marginLeft: "0px" }}>Password</label>
                    <div className="invalid-feedback">{errors.password?.message}</div>
                  </div>
                  <span onClick={togglePassword} className="input-group-text">
                    <i onClick={togglePassword} className="fa fa-eye" id="togglePassword" style={{ cursor: "pointer" }}>
                      {passwordShown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                    </i>
                  </span>
                </div>
                {/* <div className="form-floating mb-2">
                  <input type={passwordShown ? "text" : "password"} id="registerPassword"  {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="Password" />
                  <div className="invalid-feedback">{errors.password?.message}</div>
                  <label className="form-label" htmlFor="registerPassword" style={{ marginLeft: "0px" }} >Password</label>
                  <span className="input-group-text">
                    <i onClick={togglePassword} className="fa fa-eye" id="togglePassword" style={{ cursor: "pointer" }}>
                        {passwordShown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                    </i>
                </span>
                </div> */}
                {/* <!-- Confirm Password input --> */}
                <div className="input-group mb-3">
                  <div className="form-floating">
                    <input type={passwordShown ? "text" : "password"} {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} placeholder="Confirm Password" id="registerConfirmPassword" />
                    <label htmlFor="registerConfirmPassword" style={{ marginLeft: "0px" }}>Confirm Password</label>
                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                  </div>
                  <span onClick={togglePassword} className="input-group-text">
                    <i onClick={togglePassword} className="fa fa-eye" id="togglePassword" style={{ cursor: "pointer" }}>
                      {passwordShown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                    </i>
                  </span>
                </div>

                {/* <div className="form-floating mb-2">
                  <input type={passwordShown ? "text" : "password"} id="registerConfirmPassword"   {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} placeholder="Confirm Password" />
                  <div className="invalid-feedback"> {errors.confirmPassword?.message}</div>
                  <label className="form-label" htmlFor="registerConfirmPassword" style={{ marginLeft: "0px" }}>Confirm password</label>
                </div> */}
                {/* <!-- Department select --> */}
                <div className="form-floating mb-2">
                  <select id="selectDepartment" {...register('department')} className={`form-select ${errors.department ? 'is-invalid' : ''}`} defaultValue={''}  >
                    <option value="" disabled>בחר מחלקה...</option>
                    {listDepartments.map(item => (
                      <option value={item.id} key={item.id} >{item.name}</option>
                    ))}
                  </select>
                  <div className="invalid-feedback"> {errors.department?.message}</div>
                  <label className="form-label" htmlFor="selectDepartment" style={{ marginLeft: "0px" }}>Department</label>
                </div>
                {/* <!-- Role level select --> */}
                <div className="form-floating mb-2">
                  <select id="selectRole"  {...register('role')} className={`form-select ${errors.role ? 'is-invalid' : ''}`} defaultValue={''} >
                    <option value="" disabled>בחר הרשאה...</option>
                    {listRoles.map(item => (
                      <option value={item.id} key={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <div className="invalid-feedback"> {errors.role?.message}</div>
                  <label className="form-label" htmlFor="selectRole" style={{ marginLeft: "0px" }}>Role Level</label>
                </div>
                {/* <!-- JobTitle input --> */}
                <div className="form-floating mb-2">
                  <input type="text" id="registerJobTitle"   {...register('jobTitle')} className={`form-control ${errors.jobTitle ? 'is-invalid' : ''}`} placeholder="Job Title" />
                  <div className="invalid-feedback"> {errors.jobTitle?.message}</div>
                  <label className="form-label" htmlFor="registerJobTitle" style={{ marginLeft: "0px" }}>JobTitle</label>
                </div>
                <button type='submit' className="btn btn-primary btn-block mb-3">Register</button>
              </form>
            </MDBTabsPane>
          </MDBTabsContent>
        </div>
      </div>

    </div>
  );
}