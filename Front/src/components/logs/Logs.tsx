import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { userAccess, userToken } from '../login/loginSlice';
import { getProfileAsync, profileSelector } from '../profile/profileSlicer';
import { getLogsAsync, logsSelector } from './logsSlice';

const Logs = () => {
  const logs = useAppSelector(logsSelector);
  const dispatch = useAppDispatch();
  const token = useAppSelector(userAccess)
  const profile = useAppSelector(profileSelector)

  useEffect(() => {
    dispatch(getLogsAsync(token))
    dispatch(getProfileAsync(token))
  }, [logs.length])


  return (
    <div>
      <div style={{ marginTop: '10px' }}>

        <table style={{ marginLeft: "auto", marginRight: "auto" }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>זמן</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>משתמש</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>מכונית</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>פעולה</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>רמה</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log =>
              <tr key={log.id}>
                <td style={{ border: '1px solid black', padding: '5px' }}>{log.logDate}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>{log.user_name  ? log.user_name: "N/A"}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>{log.car_name ? log.car_name: "N/A"}</td >
                <td style={{ border: '1px solid black', padding: '5px' }}>{log.action}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>{log.level}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div >
    </div>
  )

}



export default Logs