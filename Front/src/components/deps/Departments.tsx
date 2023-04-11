import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess } from '../login/loginSlice'
import { depsSelector, getDepsAsync } from './depsSlicer'
import { allProfileSelector, getAllProfilesAsync } from '../profile/profileSlicer'

const Departments = () => {

  const dispatch = useAppDispatch()
  const deps = useAppSelector(depsSelector)
  const token = useAppSelector(userAccess)
  const allProfiles = useAppSelector(allProfileSelector)
  const [departmentName, setdepartmentName] = useState("")

  useEffect(() => {
    dispatch(getDepsAsync(token))
    dispatch(getAllProfilesAsync(token))
  }, [deps.length])


  return (
    <div>
      {deps.map(dep => <div key={dep.id} onClick={() => setdepartmentName(dep.name)} style={{ cursor: 'pointer' }}>
        {dep.name}

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
      </div>)}
    </div>
  )
}

export default Departments