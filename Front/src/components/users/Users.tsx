import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getUsersAsync, updateUserAsync, usersSelector } from './userSlicer'
import { userAccess } from '../login/loginSlice'
import { allProfileSelector, getAllProfilesAsync, getProfileAsync, updateProfileAsync } from '../profile/profileSlicer'
import { UserModel } from '../../models/User';
import { ProfileModel } from '../../models/Profile';
import { MY_SERVER } from '../../env'
import { depsSelector, getDepsAsync } from '../deps/depsSlicer'
import { FaEdit } from 'react-icons/fa';
const Users = () => {
  const dispatch = useAppDispatch()
  const users = useAppSelector(usersSelector)
  const allProfiles = useAppSelector(allProfileSelector)
  const token = useAppSelector(userAccess)
  const departments = useAppSelector(depsSelector)
  const [searchTerm, setsearchTerm] = useState("")
  const [selectedUser, setselectedUser] = useState<UserModel | null>(null)
  const [selectedUserProfile, setselectedUserProfile] = useState<ProfileModel | null>(null)
  const [editMode, seteditMode] = useState(false)
  const updateUserModel: UserModel = {}
  const updateProfileModel: ProfileModel = {}
  const [newFirstName, setnewFirstName] = useState("")
  const [newLastName, setnewLastName] = useState("")
  const [newUserName, setnewUserName] = useState("")
  const [newId, setnewId] = useState("")
  const [selectedDep, setselectedDep] = useState("")
  const [newMail, setnewMail] = useState("")
  const [newTitle, setnewTitle] = useState("")

  useEffect(() => {
    dispatch(getUsersAsync(token))
    dispatch(getAllProfilesAsync(token))
    dispatch(getDepsAsync(token))
  }, [])

  useEffect(() => {
    selectedUser &&
      setselectedUserProfile(allProfiles.filter(profile => profile.user === selectedUser.id)[0])
  }, [selectedUser])

  const handleUpdateUserData = () => {
    // updateUserModel.id = selectedUser?.id
    // updateProfileModel.id = selectedUserProfile?.id
    newFirstName && (updateUserModel.first_name = newFirstName)
    newLastName && (updateUserModel.last_name = newLastName)
    newUserName && (updateUserModel.username = newUserName)
    newMail && (updateUserModel.email = newMail)
    newId && (updateProfileModel.realID = Number(newId))
    selectedDep && (updateProfileModel.department = departments.filter(dep => dep.name === selectedDep)[0].id)
    newTitle && (updateProfileModel.jobTitle = newTitle)
    if (updateUserModel) {
      updateUserModel.id = selectedUser?.id
    }
    if (updateProfileModel) {
      updateProfileModel.id = selectedUserProfile?.id
    }
    updateUserModel &&  dispatch(updateUserAsync({ token: token, user: updateUserModel }))
    updateProfileModel &&  dispatch(updateProfileAsync({ token: token, profile: updateProfileModel }))
  }

  const handleeditExit = () => {
    setselectedUser(null)
    seteditMode(false)
  }
  return (
    <div>
      <div style={{ marginTop: '10px' }}>
        <input placeholder='חיפוש אחר משתמש לפי שם' onChange={(e) => setsearchTerm(e.target.value)} style={{ width: '300px', left: '150px' }} />
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

            {users && users.filter(user => user.first_name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
              user.last_name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())).map(user =>
                <tr key={user.id} onClick={() => setselectedUser(user)} style={{ cursor: 'pointer' }}>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{user.first_name}</td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{user.last_name}</td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{user.username}</td >
                  <td style={{ border: '1px solid black', padding: '5px' }}>{allProfiles.filter(profile => profile.user === user.id)[0]?.realID}</td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{user.email}</td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{allProfiles.filter(profile => profile.user === user.id)[0]?.dep_name}</td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{allProfiles.filter(profile => profile.user === user.id)[0]?.jobTitle}</td>

                </tr>
              )}
          </tbody>
        </table>
      </div >
      {(selectedUser && selectedUserProfile) &&
        <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100vh", backgroundColor: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "relative", padding: "32px", width: "400px", height: "300px", maxWidth: "640px", backgroundColor: "white", border: "2px solid black", borderRadius: "5px" }}>
            <button style={{ position: "absolute", top: "0", left: "0" }} onClick={() => seteditMode(true)}>
              <FaEdit /> Edit
            </button>
            <button style={{ position: "absolute", top: "0", right: "0" }} onClick={() => handleeditExit()}>X</button>
            {!editMode ?
              <div>
                <div>שם פרטי:
                  {selectedUser.first_name}<br />
                </div>
                <div>שם משפחה:
                  {selectedUser.last_name}<br />
                </div>
                <div>שם משתמש:
                  {selectedUser.username}<br />
                </div>
                <div>תעודת זהות:
                  {selectedUserProfile.realID}<br />
                </div>
                <div>מייל:
                  {selectedUser.email}<br />
                </div>
                <div>
                  מחלקה:
                  {selectedUserProfile?.dep_name}<br />
                </div>
                <div>תפקיד:
                  {selectedUserProfile?.jobTitle}<br />
                </div>
                <div>רמת הרשאות:
                  {selectedUserProfile?.roleLevel}<br />
                </div>
              </div> :
              // This block of code is for editing the user's data
              <div>
                <form>
                  <div>שם פרטי:
                    <input onChange={(e) => setnewFirstName(e.target.value)} />
                    <br />
                  </div>
                  <div>שם משפחה:
                    <input onChange={(e) => setnewLastName(e.target.value)} />
                    <br />
                  </div>
                  <div>שם משתמש:
                    <input onChange={(e) => setnewUserName(e.target.value)} />
                    <br />
                  </div>
                  <div>תעודת זהות:
                    <input type='number' onChange={(e) => setnewId(e.target.value)} />
                    <br />
                  </div>
                  <div>מייל:
                    <input type='email' onChange={(e) => setnewMail(e.target.value)} />
                  </div>
                  <div>
                    מחלקה:
                    <select value={selectedDep} onChange={(e) => setselectedDep(e.target.value)}>
                      <option value="" disabled={true}>בחר מחלקה חדשה</option>
                      {departments.map((dep) => (
                        <option key={dep.id} value={dep.name}>
                          {dep.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>תפקיד:
                    <input onChange={(e) => setnewTitle(e.target.value)} />
                  </div>
                  <button type='submit' onClick={() => handleUpdateUserData()}>שמור שינויים</button>
                </form>
              </div>
            }
          </div>
        </div>
      }
    </div >
  )
}

export default Users