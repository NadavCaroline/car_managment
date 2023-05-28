import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { MaintenanceTypeModel } from '../../models/MaintenanceType'
import { getmaintenanceTypeAsync } from '../maintenanceType/maintenanceTypeSlice';
import { userToken } from '../login/loginSlice'
import { Card, Container, Row, Col, Badge, Button, Modal } from "react-bootstrap";
import { MY_SERVER } from '../../env';


const MaintenanceType = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector(userToken)
  const [listMaintenanceType, setListMaintenanceTypes] = useState<MaintenanceTypeModel[]>([]);

  useEffect(() => {
   
    dispatch(getmaintenanceTypeAsync(token)).then((res) => setListMaintenanceTypes(res.payload))
   
    // dispatch(getRolesAsync()).then((res) => setListRoles(res.payload))
}, [])

  return (
    <div className="row mt-3" style={{ direction: "rtl" }}>
      <div className="mx-auto col-10">
        <div style={{ marginTop: '10px' }}>
          <Container>
          <div style={{ textAlign: 'left' }}>
            <button style={{ marginLeft: "10px", marginBottom: "10px" }} className="btn btn-primary" >הוספת סוג תורנות</button>
          </div>
                 
            <Row className="align-items-stretch" xs={1} md={2} lg={3}>
              {listMaintenanceType.map((maintenanceType) => (
                <Col key={maintenanceType.id} style={{ marginBottom: '10px' }}>
                  <Card className='h-100 text-center notSelectedDiv'>
                    <Card.Body>
                      <Card.Title>{maintenanceType.name}</Card.Title>
                      <img src={MY_SERVER + maintenanceType.imgLogo} style={{ width: '50px', height: '50px' }} alt={"imglogo"} />
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

export default MaintenanceType