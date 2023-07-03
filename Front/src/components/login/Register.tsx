import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { SetFormReset, forgotAsync } from './loginSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DepModel } from '../../models/Deps'
import { RolesModel } from '../../models/Roles'
import { regAsync, userToken, getDepartmentsAsync, getRolesAsync, } from './loginSlice';
import { faUser, faVcard, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'

const Register = () => {
    const dispatch = useAppDispatch();
    const [listDepartments, setListDepartments] = useState<DepModel[]>([]);
    const [listRoles, setListRoles] = useState<RolesModel[]>([]);
    const token = useAppSelector(userToken)
    const [passwordShown, setPasswordShown] = useState(false);

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

    const onSubmitReg = (data: UserSubmitForm) => {
        console.log(JSON.stringify(data, null, 2));
        dispatch(regAsync({ user: { first_name: data.firstName, last_name: data.lastName, password: data.password, username: data.userName, email: data.email }, profile: { jobTitle: data.jobTitle, roleLevel: data.role, department: data.department, realID: data.id } }));
    };

    // Password toggle handler
    const togglePassword = () => {

        setPasswordShown(!passwordShown);
    };
    useEffect(() => {
        dispatch(getDepartmentsAsync()).then((res) => setListDepartments(res.payload))
        dispatch(getRolesAsync()).then((res) => setListRoles(res.payload))

    }, [])

    return (
        <form dir="rtl" id="formRegister" onSubmit={handleSubmit(onSubmitReg)} style={{ border: ".2rem solid #ececec", borderRadius: "8px", padding: "1rem" }}>
            <h1 className="h3 mb-3" style={{ color: "rgb(19, 125, 141)" }} >הרשמה</h1>
            {/* <!-- First Name input --> */}
            <div className="form-floating mb-2">
                <input type="text" id="registerFirstName" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} placeholder="שם פרטי" />
                <div className="invalid-feedback">{errors.firstName?.message}</div>
                <label className="form-label" htmlFor="registerFirstName" style={{ marginLeft: "0px" }}>שם פרטי</label>
            </div>
            {/* <!-- Last Name input --> */}
            <div className="form-floating mb-2">
                <input type="text" id="registerLastName"  {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} placeholder="שם משפחה" />
                <div className="invalid-feedback">{errors.lastName?.message}</div>
                <label className="form-label" htmlFor="registerLastName" style={{ marginLeft: "0px" }}>שם משפחה</label>
            </div>
            {/* <!-- Username input --> */}
            <div className="form-floating mb-2">
                <input type="text" id="registerUsername"  {...register('userName')} className={`form-control ${errors.userName ? 'is-invalid' : ''}`} placeholder="שם משתמש" />
                <div className="invalid-feedback">{errors.userName?.message}</div>
                <label className="form-label" htmlFor="registerUsername" style={{ marginLeft: "0px" }}>שם משתמש</label>
            </div>
            {/* <!-- ID input --> */}
            <div className="form-floating mb-2">
                <input type="number" id="registerId" {...register('id')} className={`form-control ${errors.id ? 'is-invalid' : ''}`} placeholder="תעודת זהות" />
                <div className="invalid-feedback">{errors.id?.message}</div>
                <label className="form-label" htmlFor="registerId" style={{ marginLeft: "0px" }}>תעודת זהות</label>
            </div>
            {/* <!-- Email input --> */}
            <div className="form-floating mb-2">
                <input type="email" id="registerEmail"   {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="אימייל" />
                <div className="invalid-feedback">{errors.email?.message}</div>
                <label className="form-label" htmlFor="registerEmail" style={{ marginLeft: "0px" }}>אימייל</label>
            </div>
            {/* <!-- Password input --> */}
            <div className="input-group mb-3">
                <div className="form-floating">
                    <input type={passwordShown ? "text" : "password"} {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="סיסמא" id="registerPassword" />
                    <label htmlFor="registerPassword" style={{ marginLeft: "0px" }}>סיסמא</label>
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
                    <input type={passwordShown ? "text" : "password"} {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} placeholder="אימות סיסמא" id="registerConfirmPassword" />
                    <label htmlFor="registerConfirmPassword" style={{ marginLeft: "0px" }}>אימות סיסמא</label>
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
                <label className="form-label" htmlFor="selectDepartment" style={{ marginLeft: "0px" }}>מחלקה</label>
            </div>
            {/* <!-- Role level select --> */}
            <div className="form-floating mb-2" style={{visibility:'hidden'}}>
                <select id="selectRole"  {...register('role')} className={`form-select ${errors.role ? 'is-invalid' : ''}`} defaultValue={'1'} >
                    <option value="" disabled>בחר הרשאה...</option>
                    {listRoles.map(item => (
                        <option value={item.id} key={item.id}>{item.name}</option>
                    ))}
                </select>
                <div className="invalid-feedback"> {errors.role?.message}</div>
                <label className="form-label" htmlFor="selectRole" style={{ marginLeft: "0px" }}>הרשאה</label>
            </div>
            {/* <!-- JobTitle input --> */}
            <div className="form-floating mb-2">
                <input type="text" id="registerJobTitle"   {...register('jobTitle')} className={`form-control ${errors.jobTitle ? 'is-invalid' : ''}`} placeholder="תפקיד" />
                <div className="invalid-feedback"> {errors.jobTitle?.message}</div>
                <label className="form-label" htmlFor="registerJobTitle" style={{ marginLeft: "0px" }}>תפקיד</label>
            </div>
            <button type='submit' className="btn btn-primary btn-block mb-3">הרשמה</button>
        </form>
    );
};

export default Register;