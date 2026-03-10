import { useState } from 'react'
import './App.css'

function App() {
  const [timeLog, setTimeLog] = useState({
                      startTime: "",
                      endTime: "",
                      activity: "",
                      duration: 0,
                      energyLevel: 0,
                    })


  const startLog = () => {
    datetime = new Date()
    setTimeLog(prev => ({
      ...prev,
      startTime: datetime.toISOString()
    }));
  }

  const endLog = () => {
    if (!startTime) return
    datetime = new Date()
    setEndTime(datetime)
    timeLog.endTime = datetime.toISOString()
  }

  const resetLog = () => {
    setStartTime(null)
    setEndTime(null)
  }


  return (
  
  <div>
    <button onClick={startLog}>Start Log</button>
    {startTime && <h1>Started at: {startTime.toLocaleString()}</h1>}

    <button onClick={endLog} disabled={!startTime} >End Log</button>
    {startTime && endTime && <h1>Ended at: {endTime.toLocaleString()}</h1>}

    <button onClick={resetLog} disabled={!endTime}>Reset</button>
  </div>

  )
}

export default App
