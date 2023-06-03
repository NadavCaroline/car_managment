import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess } from '../login/loginSlice'
import { addDepAsync, depsSelector, getDepsAsync } from './depsSlicer'
import { allProfileSelector, getAllProfilesAsync, profileSelector } from '../profile/profileSlicer'

const Departments = () => {

  const dispatch = useAppDispatch()
  const deps = useAppSelector(depsSelector)
  const token = useAppSelector(userAccess)
  const allProfiles = useAppSelector(allProfileSelector)
  const [departmentName, setdepartmentName] = useState("")
  const [addState, setaddState] = useState(false)
  const [depName, setdepName] = useState("")

// responsible for calling the server once the page is loaded
  useEffect(() => {
    dispatch(getDepsAsync(token))
    dispatch(getAllProfilesAsync(token))
  }, [deps.length])


  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => setaddState(true)} style={{ margin: '10px', right: '300px' }}>הוסף מחלקה</button>
      </div>
      {deps.map(dep => <div key={dep.id} onClick={() => setdepartmentName(dep.name)} style={{ cursor: 'pointer' }}>
        <h3>
          {dep.name}
        </h3>
      </div>)}
      {departmentName &&
        <div style={{ marginTop: '10px' }}>
          <table style={{ marginLeft: "auto", marginRight: "auto", marginTop: '10px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '5px' }}>שם משתמש</th>
                <th style={{ border: '1px solid black', padding: '5px' }}>תפקיד</th>
                <th style={{ border: '1px solid black', padding: '5px' }}>תעודת זהות</th>
              </tr>
            </thead>
            <tbody>
              {allProfiles.filter(profile => profile.dep_name?.includes(departmentName)).map(profile =>
                <tr key={profile.id}>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{profile.user_name}</td >
                  <td style={{ border: '1px solid black', padding: '5px' }}>{profile.jobTitle}</td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{profile.realID}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div >}
      {/* Add Department */}
      <div>
        {addState &&
          <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100vh", backgroundColor: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", padding: "32px", width: "420px", height: "400px", maxWidth: "640px", backgroundColor: "white", border: "2px solid black", borderRadius: "5px", textAlign: "left" }}>
              <button style={{ position: "absolute", top: "0", right: "0" }} onClick={() => setaddState(false)}>X</button>
              <form>
                שם המחלקה:<input onChange={(e) => setdepName(e.target.value)} />
                <button onClick={() => dispatch(addDepAsync({token: token, dep: {name: depName}}))}>שמור</button>
              </form>
            </div>
          </div>
        }

      </div>
    </div>
  )
}

export default Departments