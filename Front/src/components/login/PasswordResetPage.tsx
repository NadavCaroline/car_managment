import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';


interface Props {
    match: {
        params: {
            uidb64: string;
            token: string;
        }
    }
}
const PasswordResetPage = () => {
    //   const [newPassword, setNewPassword] = useState("");
    //   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     // Send a request to the backend to update the password
    //   };
    type UserResetForm = {
        password: string;
        confirmPassword: string;
    };
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
            // const response = await axios.post('/api/password/reset/confirm/', {
            //   uidb64: props.match.params.uidb64,
            //   token: props.match.params.token,
            //   password: data.password,
            //   confirmPassword: data.confirmPassword,
            // });
            // handle success
          } catch (error) {
            // setError(error.response.data.detail);
          }
    };
    return (
        <form id="resetPasswordPage" onSubmit={handleSubmit(onReset)} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
            <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >Reset password</h1>
            {/* <!-- Password input --> */}
            <div className="form-floating mb-2">
                <input type="password" id="registerPassword"  {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.password?.message}</div>
                <label className="form-label" htmlFor="registerPassword" style={{ marginLeft: "0px" }} >Password</label>
            </div>
            {/* <!-- Confirm Password input --> */}
            <div className="form-floating mb-2">
                <input type="password" id="registerConfirmPassword"   {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback"> {errors.confirmPassword?.message}</div>
                <label className="form-label" htmlFor="registerConfirmPassword" style={{ marginLeft: "0px" }}>Confirm password</label>
            </div>
            <div className="col text-center">
                <button type='submit' className="btn btn-primary" >Reset Password</button>
            </div>
        </form>

    );
};

export default PasswordResetPage;
