import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userToken } from '../login/loginSlice'
import { getProfileAsync, profileSelector } from './profileSlicer'

const Profile = () => {
    const dispatch = useAppDispatch()
    const profile = useAppSelector(profileSelector)
    const token = useAppSelector(userToken)

    useEffect(() => {
        dispatch(getProfileAsync(token))
    }, [])


    return (
        <div>
            <h1>Your Profile</h1>
            <div>
                Name: {profile.user_name}
            </div>
            <div>
                Department:  {profile.dep_name}
            </div>
            <div>
                Job Title: {profile.jobTitle}
            </div>
            <div>
                ID: {profile.realID}
            </div>
        </div>
    )
}

export default Profile