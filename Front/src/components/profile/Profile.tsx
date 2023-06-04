import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess } from '../login/loginSlice'
import { getProfileAsync, profileSelector } from './profileSlicer'

const Profile = () => {
    const dispatch = useAppDispatch()
    const profile = useAppSelector(profileSelector)
    const token = useAppSelector(userAccess)

    useEffect(() => {
        dispatch(getProfileAsync(token))
    }, [])


    return (
        <div>
            <h1>הפרופיל שלך</h1>
            {profile.roleLevel}
            <div>
                שם מלא: {profile.user_name}
            </div>
            <div>
                מחלקה:  {profile.dep_name}
            </div>
            <div>
                תפקיד: {profile.jobTitle}
            </div>
            <div>
                תעודת זהות: {profile.realID}
            </div>
        </div>
    )
}

export default Profile