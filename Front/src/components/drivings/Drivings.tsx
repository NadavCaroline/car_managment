import React, { useEffect, useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';



export function Drivings() {
  // let isRunning = false;
  const [isRunning, setIsRunning] = useState(false);

   
  const handleButtonClick = () => {
    const startStopBtn = document.querySelector('.round') as HTMLButtonElement;
    setIsRunning(!isRunning);
    if (!isRunning) {
      startStopBtn.textContent = 'Stop';
      startStopBtn.className="round redBtn";
    } else {
      startStopBtn.textContent = 'Start';
      startStopBtn.className="round greenBtn";
    }
  };
      
  return (
    <div >
      <h1>נסיעה</h1><hr/>
      <div className="d-flex justify-content-center">
      <button className="round greenBtn"  onClick={handleButtonClick}>Start</button>
      </div>
      

    </div>
  );
}
