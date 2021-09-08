import React, { useState, useRef } from 'react';

const Timer = ({formatTime, formatTimeTotal, handleStart, handlePause, handleResume,isActive,isPaused}) => {
//   const [timer, setTimer] = useState(0)
//   const [timerTotal, setTimerTotal] = useState(0)

//   const [isActive, setIsActive] = useState(false)
//   const [isPaused, setIsPaused] = useState(false)

//   const [isActiveTotal, setIsActiveTotal] = useState(false)
//   const [isPausedTotal, setIsPausedTotal] = useState(false)

//   const increment = useRef(null)
//   const incrementTotal = useRef(null)

//   const handleStart = () => {
//     setIsActive(true)
//     setIsPaused(true)
//     increment.current = setInterval(() => {
//       setTimer((timer) => timer + 1)
//     }, 1000)
//     incrementTotal.current = setInterval(() => {
//         setTimerTotal((timer) => timer + 1)
//     }, 1000)
//   }

//   const handlePause = () => {
//       console.log(timer)
//       console.log(timerTotal)
//     clearInterval(increment.current)
//     clearInterval(incrementTotal.current)
//     setIsPaused(false)
//   }

//   const handleResume = () => {
//     setIsPaused(true)
//     increment.current = setInterval(() => {
//       setTimer((timer) => timer + 1)
//     }, 1000)
//     increment.current = setInterval(() => {
//         setTimerTotal((timer) => timer + 1)
//     }, 1000)
//   }

//   const handleReset = () => {
//     clearInterval(increment.current)
//     setIsActive(false)
//     setIsPaused(false)
//     setTimer(0)
//   }

//   const formatTime = () => {
//     const getSeconds = `0${(timer % 60)}`.slice(-2)
//     const minutes = `${Math.floor(timer / 60)}`
//     const getMinutes = `0${minutes % 60}`.slice(-2)
//     const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

//     return `${getHours} : ${getMinutes} : ${getSeconds}`
//   }

//   const formatTimeTotal = () => {
//     const getSeconds = `0${(timerTotal % 60)}`.slice(-2)
//     const minutes = `${Math.floor(timerTotal / 60)}`
//     const getMinutes = `0${minutes % 60}`.slice(-2)
//     const getHours = `0${Math.floor(timerTotal / 3600)}`.slice(-2)

//     return `${getHours} : ${getMinutes} : ${getSeconds}`
//   }

  return (
    <div className="app">
      <h3>React Stopwatch</h3>
      <div className='stopwatch-card'>
        <p>해당카드학습시간 : {formatTime()}</p>
        <p>전체학습시간 : {formatTimeTotal()}</p>
        <div className='buttons'>
          {
            !isActive && !isPaused ?
              <button onClick={handleStart}>Start</button>
              : (
                isPaused ? <button onClick={handlePause}>Pause</button> :
                  <button onClick={handleResume}>Resume</button>
              )
          }
          {/* <button onClick={handleReset} disabled={!isActive}>Reset</button> */}
        </div>
      </div>
    </div>
  );
}

export default Timer;