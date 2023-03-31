import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { carsSelector, getAllCarsAsync, getCarsAsync } from './carsSlice';
import { userAccess } from '../login/loginSlice';
import { getProfileAsync, profileSelector } from '../profile/profileSlicer';
import { MY_SERVER } from '../../env';

export function Cars() {
  const cars = useAppSelector(carsSelector);
  const dispatch = useAppDispatch();
  const token = useAppSelector(userAccess)
  const profile = useAppSelector(profileSelector)
  useEffect(() => {
    dispatch(getProfileAsync(token)) 
    dispatch(getAllCarsAsync(token))
  }, [cars.length])


  return (
    <div style={{marginTop: '10px'}}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '.25rem', gridAutoRows: 'minmax(160px, auto)' }}>
        {cars.map(car =>
          <div key={car.id} style={{ borderRadius: '5px', border: '2px solid rgb(0, 0, 0)', padding: '.5rem' }}>

            <div style={{textAlign: 'center'}}>
              Department: {car.dep_name}<br />
              יצרן: {car.make}<br />
              דגם: {car.model}<br />
              צבע: {car.color}<br />
              שנה: {car.year}   <br />
              <img src={MY_SERVER + car.image} style={{ width: '150px', height: '100px' }} alt={car.model} /><br/>
            </div>


          </div>)}
      </div>
    </div>
  );
}
