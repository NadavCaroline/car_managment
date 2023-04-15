import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { SetFormReset ,forgotAsync} from './loginSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


const Forgot = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    // Send a password reset link to the user's email
    dispatch(forgotAsync({ email: data.email})).then((res) => {setIsLoading(false);} );
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
        <button type='submit' className="btn btn-primary" > {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Submit'}</button>
      </div>
    </form>
  );
};

export default Forgot;