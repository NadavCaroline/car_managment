import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Reset from './Reset';
import Forgot from './Forgot'
import Register from './Register'
import {
  loginAsync,
  remember,
  dontRemember, loginError, SetError, loginMsg, SetMsg, sformToShow, SetFormLogin, SetFormForgot, SetFormRegister
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Link, Outlet, useOutlet } from 'react-router-dom';

export function Login() {

  const dispatch = useAppDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const errorMessage = useAppSelector(loginError)
  const loginMessage = useAppSelector(loginMsg)
  const [basicActive, setBasicActive] = useState('tabLogin');
  const [passwordShown, setPasswordShown] = useState(false);
  const formToShow = useAppSelector(sformToShow);
  const outlet = useOutlet();
  console.log("outlet");
  console.log(outlet);
  // const isComponentInOutlet =  false;//outlet?.('my-outlet') !== null;

  type UserLoginForm = {
    userName:string;
    password: string;
  };
  const emailRegExp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const validationSchema = Yup.object().shape({
    userName: Yup.string()
      .required('נא להזין שם משתמש')
      .min(4, 'שם משתמש חייב להיות מעל 4 אותיות')
      .max(20, 'שם משתמש חייב להיות עד 20 אותיות'),
    password: Yup.string()
      .required('נא להזין סיסמא')
      .min(4, 'סיסמא חייבת להיות לפחות 4 תווים')
      .max(40, 'ססימא חייבת להיות עד 40 תווים'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserLoginForm>({
    resolver: yupResolver(validationSchema)
  });
  const onSubmitLogin = (data: UserLoginForm) => {
    // e.preventDefault();
    dispatch(loginAsync({username: data.userName,password: data.password }))
  };

  const handleBasicClick = (value: string) => {
    if (value === 'tabLogin') {
      dispatch(SetFormLogin());
    }
    if (value == 'tabRegister') {
      dispatch(SetFormRegister());
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
    rememberMe ? dispatch(remember()) : dispatch(dontRemember())
  }, [rememberMe])

  // Password toggle handler
  const togglePassword = () => {
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
              <MDBTabsLink onClick={() => handleBasicClick('tabRegister')} active={basicActive === 'tabRegister'}>
                <FontAwesomeIcon icon={faVcard} style={{ paddingRight: "1em" }} />
                הרשמה
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleBasicClick('tabLogin')} active={basicActive === 'tabLogin'}>
                <FontAwesomeIcon icon={faUser} style={{ paddingRight: "1em" }} />
                כניסה
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>

          <MDBTabsContent>
            <MDBTabsPane show={basicActive === 'tabLogin'}>
              {formToShow === 'login' && !outlet &&
                <form dir="rtl" onSubmit={handleSubmit(onSubmitLogin)} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
                  <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >כניסה</h1>
                  {/* <!-- Username input --> */}
                  <div className="form-floating mb-2">
                    <input type="text" id="loginUsername"  {...register('userName')} className={`form-control ${errors.userName ? 'is-invalid' : ''}`} placeholder="שם משתמש" />
                    <div className="invalid-feedback">{errors.userName?.message}</div>
                    <label className="form-label" htmlFor="loginUsername" style={{ marginLeft: "0px" }}>שם משתמש</label>
                  </div>
                  {/* <!-- Password input --> */}
                  <div className="input-group mb-3">
                    <div className="form-floating">
                      <input type={passwordShown ? "text" : "password"} {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="סיסמא" id="loginPassword" />
                      <label htmlFor="loginPassword" style={{ marginLeft: "0px" }}>סיסמא</label>
                      <div className="invalid-feedback">{errors.password?.message}</div>
                    </div>
                    <span onClick={togglePassword} className="input-group-text">
                      <i onClick={togglePassword} className="fa fa-eye" id="togglePassword" style={{ cursor: "pointer" }}>
                        {passwordShown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                      </i>
                    </span>
                  </div>
                  <div className="row mb-2" style={{ marginTop: "1.5rem " }}>
                    <div className="col-md-6 d-flex justify-content-center">
                      <div className="form-check mb-3 mb-md-0">
                        <input className="form-check-input" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} id="loginCheck" />
                        <label className="form-check-label" htmlFor="loginCheck"> זכור אותי </label>
                      </div>
                    </div>

                    <div className="col-md-6 d-flex justify-content-center">
                      {/* <!-- Simple link --> */}
                      <a href="#!" style={{ cursor: "pointer" }} onClick={forgotClick}>שכחתי סיסמא</a>
                      {/* <Link to='/forgot' onClick={() => setStatus("forgot")} >Forgot password</Link> */}
                    </div>
                  </div>

                  <div className="col text-center">
                    <button type='submit' className="btn btn-primary" >כניסה</button>
                  </div>
                </form>
              }
              {formToShow === 'forgot' &&
                <Forgot />
              }
              {formToShow === 'reset' &&
                <Reset />
              }
              <Outlet />
            </MDBTabsPane>
            <MDBTabsPane show={basicActive === 'tabRegister'}>
              {formToShow === 'register' &&
                <Register />
              }
            </MDBTabsPane>
          </MDBTabsContent>
        </div>
      </div>

    </div>
  );
}