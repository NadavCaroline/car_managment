import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { userAccess, userToken } from '../login/loginSlice';
import { getProfileAsync, profileSelector } from '../profile/profileSlicer';
import { getLogsAsync, logsSelector } from './logsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
// import Select from 'react-select';
import Select from 'react-select';
// import { ValueType } from 'react-select/src/types';



const Logs = () => {
  const logs = useAppSelector(logsSelector);
  const dispatch = useAppDispatch();
  const token = useAppSelector(userAccess)
  const profile = useAppSelector(profileSelector)
  const [searchTerm, setsearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState("")

  // const handleChange = (selectedOption: { value: number; label: string } | null) => {
  //   setFilterLevel(String(selectedOption?.value));
  // };
  const handleChange = (newValue: { value: number; label: Element; }) => {
    // if (selectedOption) {
    //   setFilterLevel(String(selectedOption.value));
    // } else {
    //   setFilterLevel(""); // Set a default value when no option is selected
    // }
  };
  useEffect(() => {
    dispatch(getLogsAsync(token))
    dispatch(getProfileAsync(token))
  }, [logs.length])

  const options = [
    { value: 1, label: <span><FontAwesomeIcon icon={faInfoCircle} style={{ color: '#00B300',marginRight:'10px',marginLeft:'10px' }} /> מידע</span> },
    { value: 2, label: <span><FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#F7CD29',marginRight:'10px',marginLeft:'10px' }} />הזהרה</span> },
    { value: 3, label: <span><FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#C93234',marginRight:'10px',marginLeft:'10px' }} />קריטי</span> },
  ];
  return (
    <div>
      <div style={{ marginTop: '10px' }}>
        <table style={{ marginLeft: "auto", marginRight: "auto", marginBottom: '10px' }}>
          <tr >
            <td style={{ paddingLeft: "10px" }}>  <input placeholder='חיפוש' onChange={(e) => setsearchTerm(e.target.value)} style={{ width: '200px' }} />
            </td>
            <td >
              <Select
                options={options}                // value={Number(filterLevel)}
                // onChange={handleChange}
              />
            </td>
          </tr>
        </table>
        <table style={{ marginLeft: "auto", marginRight: "auto" }}>
          <thead>

            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>רמה</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>זמן</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>משתמש</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>מכונית</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {logs.filter(log => (log.user_name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) ||
              (log.car_name?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())))
              .map(log =>
                <tr key={log.id}>
                  <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>
                    {log.level === 'warning' ? (
                      <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#F7CD29' }} />
                    ) : log.level === 'critical' ? (
                      <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#C93234' }} />
                    ) : log.level === 'info' ? (
                      <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#00B300' }} />
                    ) : (
                      ''
                    )}
                  </td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{dayjs(log.logDate, 'YYYY-MM-DD HH:mm:ss').format(' HH:mm:ss DD/MM/YYYY')}</td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{log.user_name ? log.user_name : ""}</td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{log.car_name ? log.car_name : ""}</td >
                  <td style={{ border: '1px solid black', padding: '5px' }}>{log.action}</td>

                </tr>
              )}
          </tbody>
        </table>
      </div >
    </div>
  )

}



export default Logs