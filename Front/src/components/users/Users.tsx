import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getUsersAsync, usersSelector } from './userSlicer'
import { userAccess } from '../login/loginSlice'
import { allProfileSelector, getAllProfilesAsync, getProfileAsync } from '../profile/profileSlicer'

const Users = () => {
  const dispatch = useAppDispatch()
  const users = useAppSelector(usersSelector)
  const allProfiles = useAppSelector(allProfileSelector)
  const token = useAppSelector(userAccess)
  const [searchTerm, setsearchTerm] = useState("")

  useEffect(() => {
    dispatch(getUsersAsync(token))
    dispatch(getAllProfilesAsync(token))
  }, [])


  return (
    <div>
      <div style={{ marginTop: '10px' }}>
        <input placeholder='חיפוש אחר משתמש לפי שם' onChange={(e) => setsearchTerm(e.target.value)} style={{width: '300px', left: '150px'}} />
        <table style={{ marginLeft: "auto", marginRight: "auto", marginTop: '10px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>שם פרטי</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>שם משפחה</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>שם משתמש</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>תעודת זהות</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>מייל</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>מחלקה</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>תפקיד</th>

            </tr>
          </thead>
          <tbody>
            {users.filter(user => user.first_name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
             user.last_name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())).map(user =>
              <tr key={user.id}>
                <td style={{ border: '1px solid black', padding: '5px' }}>{user.first_name}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>{user.last_name}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>{user.username}</td >
                <td style={{ border: '1px solid black', padding: '5px' }}>{allProfiles.filter(profile => profile.user === user.id)[0].realID}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>{user.email}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>{allProfiles.filter(profile => profile.user === user.id)[0].dep_name}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>{allProfiles.filter(profile => profile.user === user.id)[0].jobTitle}</td>

              </tr>
            )}
          </tbody>
        </table>
      </div >

    </div>
  )
}

export default Users