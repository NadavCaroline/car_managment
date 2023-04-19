import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addCarsAsync, carsSelector, getAllCarsAsync, getCarsAsync, updateCarAsync } from './carsSlice';
import { userAccess, userToken } from '../login/loginSlice';
import { getProfileAsync, profileSelector } from '../profile/profileSlicer';
import { MY_SERVER } from '../../env';
import CarModel from '../../models/Car';
import { depsSelector, getDepsAsync } from '../deps/depsSlicer';

export function Cars() {
  const cars = useAppSelector(carsSelector);
  const dispatch = useAppDispatch();
  const token = useAppSelector(userAccess)
  const departments = useAppSelector(depsSelector)
  const [addpopUp, setaddpopUp] = useState(false)
  // const [editPopUp, seteditPopUp] = useState(false)
  const [licenseNum, setlicenseNum] = useState("")
  const [make, setmake] = useState("")
  const [model, setmodel] = useState("")
  const [color, setcolor] = useState("")
  const [year, setyear] = useState("")
  const [department, setdepartment] = useState("")
  const [carImage, setcarImage] = useState<File | null>(null)
  const [newDep, setnewDep] = useState("")
  const [selectedCar, setselectedCar] = useState<CarModel | null>(null)
  const updateCar: CarModel = {}

  // Handles image upload
  const handleCarImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setcarImage(e.target!.files![0])
  };
  // Pop up for adding car
  const handleExitUpload = () => {
    setaddpopUp(false)
    setcarImage(null)
    setnewDep("")
  }

  // Handles the update of a car's department
  const handleUpdate = () => {
    updateCar.id = selectedCar?.id
    updateCar.department = newDep
    dispatch(updateCarAsync({token: token, car: updateCar}))
    dispatch(getAllCarsAsync(token))
    setselectedCar(null)
    setnewDep("")
  }
  // Handles the addition of a car
  const handlePostRequest = () => {
    const car: CarModel = {
      licenseNum: licenseNum,
      nickName:'',
      make: make,
      model: model,
      color: color,
      year: year,
      garageName:'',
      garagePhone:'',
      department: department,
      image: carImage,
      isDisabled:'0'
      
    }
    dispatch(addCarsAsync({ token: token, car: car }))
  }
  // Gets the cars from the server
  useEffect(() => {
    dispatch(getAllCarsAsync(token))
  }, [cars.length, selectedCar])
  // Gets the departments from the server
  useEffect(() => { 
    dispatch(getDepsAsync(token))
  }, [])

  return (
    <div style={{ marginTop: '10px' }}>
      <div>
        <button onClick={() => setaddpopUp(true)}>הוספת מכונית</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
        {cars.map(car =>
          <div key={car.id} style={{ borderRadius: '5px', border: '2px solid rgb(0, 0, 0)', padding: '.5rem' }}>

            <div style={{ textAlign: 'center' }}>
              Department: {car.dep_name}<br />
              יצרן: {car.make}<br />
              דגם: {car.model}<br />
              צבע: {car.color}<br />
              שנה: {car.year}   <br />
              <img src={MY_SERVER + car.image} style={{ width: '150px', height: '100px' }} alt={car.model} /><br />
              <button onClick={() => setselectedCar(car)}>עריכה</button>
            </div>
          </div>)}
      </div>
      {addpopUp &&
        <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100vh", backgroundColor: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "relative", padding: "32px", width: "420px", height: "400px", maxWidth: "640px", backgroundColor: "white", border: "2px solid black", borderRadius: "5px", textAlign: "left" }}>
            <button style={{ position: "absolute", top: "0", right: "0" }} onClick={() => handleExitUpload()}>X</button>
            <form>
              <div>
                מספר לוחית רישוי:
                <input required onChange={(e) => setlicenseNum(e.target.value)} />
              </div>
              <div>
                יצרן:
                <input required onChange={(e) => setmake(e.target.value)} />
              </div>
              <div>
                דגם:
                <input required onChange={(e) => setmodel(e.target.value)} />
              </div>
              <div>
                צבע:
                <input required onChange={(e) => setcolor(e.target.value)} />
              </div>
              <div>
                שנה:
                <input required onChange={(e) => setyear(e.target.value)} />
              </div>
              <div>
                מחלקה:
                <select value={department} onChange={(e) => setdepartment(e.target.value)}>
                  <option value="" disabled={true}>בחר מחלקה חדשה</option>
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                תמונה:
                <input required type='file' onChange={handleCarImageChange} />
                {carImage &&
                  <div>
                    <img src={URL.createObjectURL(carImage)}
                      alt={carImage.name}
                      style={{ width: '150px', height: '100px' }} /><br />
                  </div>}
              </div>
              <br />
              <button onClick={() => handlePostRequest()}>שמור</button>
            </form>
          </div>
        </div>
      }
      {selectedCar &&
        <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100vh", backgroundColor: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "relative", padding: "32px", width: "400px", height: "200px", maxWidth: "640px", backgroundColor: "white", border: "2px solid black", borderRadius: "5px", textAlign: "left" }}>
            <button style={{ position: "absolute", top: "0", right: "0" }} onClick={() => setselectedCar(null)}>X</button>
            <div>
              שינוי מחלקה:
              <select value={newDep} onChange={(e) => setnewDep(e.target.value)}>
                <option value="" disabled={true}>בחר מחלקה חדשה</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={()=> handleUpdate()}>שמור</button>
          </div>
        </div>}
    </div>
  );
}
