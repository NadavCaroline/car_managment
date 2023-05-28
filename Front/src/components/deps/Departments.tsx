import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess } from '../login/loginSlice'
import { addDepAsync, depsSelector, getDepsAsync } from './depsSlicer'
import { allProfileSelector, getAllProfilesAsync } from '../profile/profileSlicer'
import { Card, Container, Row, Col, Badge, Button, Modal } from "react-bootstrap";

const Departments = () => {

  const dispatch = useAppDispatch()
  const deps = useAppSelector(depsSelector)
  const token = useAppSelector(userAccess)
  const allProfiles = useAppSelector(allProfileSelector)
  const [departmentName, setdepartmentName] = useState("")
  const [addState, setaddState] = useState(false)
  const [depName, setdepName] = useState("")
  useEffect(() => {
    dispatch(getDepsAsync(token))
    // dispatch(getAllProfilesAsync(token))
  }, [deps.length])


  return (
    <div className="row mt-3" style={{ direction: "rtl" }}>
      <div className="mx-auto col-10">
        <table align='center'>
          <tr>
            <td><input className='form-control' placeholder='שם מחלקה' onChange={(e) => setdepName(e.target.value)} /></td>
            <td>  <button style={{ marginRight: "10px" }} onClick={() => dispatch(addDepAsync({ token: token, dep: { name: depName } }))} className="btn btn-primary">הוספת מחלקה</button></td>
          </tr>
        </table>
        <div style={{ marginTop: '10px' }}>
          <Container>
            <Row className="align-items-stretch" xs={1} md={2} lg={3}>
              {deps.map((dep) => (
                <Col key={dep.id} style={{ marginBottom: '10px' }}>
                  <Card className='h-100 text-center notSelectedDiv'>
                    <Card.Body>
                      <Card.Title>{dep.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>

        </div>
      </div>
    </div>
  )
}

export default Departments