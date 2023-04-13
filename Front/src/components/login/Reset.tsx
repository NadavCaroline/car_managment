import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Redirect from  "react-router-dom";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { SetFormLogin } from './loginSlice';
import {useParams} from 'react-router-dom';

// interface Props {
//     match: {
//         params: {
//             uidb64: string;
//             token: string;
//         }
//     }
// }
const Reset : React.FC = (): JSX.Element => {
    const params = useParams();
    // const uidb64=params.uidb64;
    // const token= params.token;
   
    //  return <>Link ID parameter === "{params.id}"</>;
    //   const [newPassword, setNewPassword] = useState("");
    //   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     // Send a request to the backend to update the password
    //   };
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
//  const data={
//   token: this && this?.props.match.param.id

//  }
    const onReset = (data: UserResetForm) => {
        console.log(JSON.stringify(data, null, 2));
        // Send a request to the backend to update the password
        try {
            //  const response = await axios.post('/api/password/reset/confirm/', {
            //  const response = await axios.post('/reset/'+params.uidb64+"/"+params.token, {

            //   uidb64:params.uidb64,// props.match.params.uidb64,
            //   token: params.token,//props.match.params.token,//props.match.param.id
            //    password: data.password,
            //    confirmPassword: data.confirmPassword,
            //  });
            // handle success
            dispatch(SetFormLogin());
             

        } catch (error) {
            // setError(error.response.data.detail);
        }
    };
    // Password toggle handler
    const togglePassword = () => {
        // When the handler is invoked
        // inverse the boolean state of passwordShown
        setPasswordShown(!passwordShown);
    };
    return (     
      // this.state.reset ? <Redirect to={'/login'}/> :
        <form id="resetPasswordPage" onSubmit={handleSubmit(onReset)} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
            <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >Reset password</h1>
            {/* <!-- Password input --> */}
            <div className="input-group mb-3">
                <div className="form-floating">
                    <input type={passwordShown ? "text" : "password"} {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="Password"   id="passwordReset"/>
                    <label htmlFor="floatingPassword">Password</label>
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
                    <input type={passwordShown ? "text" : "password"} {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} placeholder="Confirm Password"  id="confirmPasswordReset" />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                </div>
                <span  onClick={togglePassword} className="input-group-text">
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

