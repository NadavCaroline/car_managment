import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { SetFormReset } from './loginSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';



const Forgot = () => {
  //   const [email, setEmail] = useState("");
  //   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     // Send a password reset link to the user's email
  //   };
  const dispatch = useAppDispatch();

  type UserResetForm = {
    email: string;
  };
  const emailRegExp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('נא להזין מייל')
      .email('מייל לא תקין')
      .matches(emailRegExp, 'מייל לא תקין'),

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
    dispatch(SetFormReset());
    // Send a password reset link to the user's email
    // dispatch(regAsync({ user: { first_name: data.firstName, last_name: data.lastName, password: data.password, username: data.userName, email: data.email }, profile: { jobTitle: data.jobTitle, roleLevel: data.role, department: data.department, realID: data.id } }));
  };
  return (
    <form id="resetPasswordForm" onSubmit={handleSubmit(onReset)} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
      <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >Forgot password</h1>
      <div className="form-floating mb-2">
        <input type="email" id="resetEmail"   {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="Email" />
        <div className="invalid-feedback">{errors.email?.message}</div>
        <label className="form-label" htmlFor="resetEmail" style={{ marginLeft: "0px" }}>Email</label>
      </div>
      <div className="col text-center">
        <button type='submit' className="btn btn-primary" >Submit</button>
      </div>
    </form>
  );
};

export default Forgot;