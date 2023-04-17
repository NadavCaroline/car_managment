import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Redirect from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { SetFormLogin, resetAsync, } from './loginSlice';
import { useParams ,useNavigate  } from 'react-router-dom';

const Reset: React.FC = (): JSX.Element => {
    const params = useParams();
    const navigate = useNavigate ();
  
    const dispatch = useAppDispatch();

    type UserResetForm = {
        password: string;
        confirmPassword: string;
    };
    const [passwordShown, setPasswordShown] = useState(false);
    const emailRegExp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required('נא להזין סיסמא')
            .min(4, 'סיסמא חייבת להיות לפחות 4 תווים')
            .max(40, 'ססימא חייבת להיות עד 40 תווים'),
        confirmPassword: Yup.string()
            .required('נא להזין אימות סיסמא')
            .oneOf([Yup.ref('password')], 'אימות סיסמא לא תואם לסיסמא שהכנסת'),

    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<UserResetForm>({
        resolver: yupResolver(validationSchema)
    });
    
    const onReset = (data: UserResetForm) => {
        console.log(JSON.stringify(data, null, 2));
        // Send a request to the backend to update the password
        try {
            dispatch(resetAsync({
                uidb64: String(params.uidb64),
                token: String(params.token),
                password: data.password,
            })).then((res) => {res.payload?.status==="success" && navigate('/')} );

           

        } catch (error) {
        }
    };
    // Password toggle handler
    const togglePassword = () => {
        // When the handler is invoked
        // inverse the boolean state of passwordShown
        setPasswordShown(!passwordShown);
    };
    return (
        <form dir="rtl" id="resetPasswordPage" onSubmit={handleSubmit(onReset)} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
            <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >איפוס סיסמא</h1>
            {/* <!-- Password input --> */}
            <div className="input-group mb-3">
                <div className="form-floating">
                    <input type={passwordShown ? "text" : "password"} {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="Password" id="passwordReset" />
                    <label htmlFor="floatingPassword">סיסמא</label>
                    <div className="invalid-feedback">{errors.password?.message}</div>
                </div>
                <span onClick={togglePassword} className="input-group-text">
                    <i onClick={togglePassword} className="fa fa-eye" id="togglePassword" style={{ cursor: "pointer" }}>
                        {passwordShown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                    </i>
                </span>

            </div>

            {/* <!-- Confirm Password input --> */}
            <div className="input-group mb-3">
                <div className="form-floating">
                    <input type={passwordShown ? "text" : "password"} {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} placeholder="Confirm Password" id="confirmPasswordReset" />
                    <label htmlFor="confirmPassword">אימות סיסמא</label>
                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                </div>
                <span onClick={togglePassword} className="input-group-text">
                    <i onClick={togglePassword} className="fa fa-eye" id="togglePassword" style={{ cursor: "pointer" }}>
                        {passwordShown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                    </i>
                </span>

            </div>

            <div className="col text-center">
                <button type='submit' className="btn btn-primary" >Reset Password</button>
            </div>
        </form>

    );
};

export default Reset;

