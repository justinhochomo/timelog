import { useState } from 'react'
import './App.css'



function App() {
  const initialTimeLog = {
                      id: null,
                      startTime: "",
                      endTime: "",
                      activity: "",
                      duration: 0,
                      energyLevel: 0,
                    }
  const [timeLog, setTimeLog] = useState(initialTimeLog)
  const [status, setStatus] = useState("idle")
  const [logs, setLogs] = useState(() => {
    try {
      const raw = localStorage.getItem("timelogs");
      const data = raw ? JSON.parse(raw) : [];
      return data
    } catch (error) {
      return [];
    }
  })

  const activityLog = (event) => {
    const activity = event.target.value;
    setTimeLog(prev => ({
      ...prev,
      activity: activity
    }));
  };

  const handleEnergyLevel = (event) => {
    setTimeLog(prev => ({
      ...prev,
      energyLevel: Number(event.target.value)
    }))
  }


  const startLog = () => {
    const datetime = new Date()
    setTimeLog(prev => ({
      ...prev,
      startTime: datetime.toISOString(),
      endTime: "",
      duration: 0
    }));
    setStatus("started")
  }

  const endLog = () => {
    if (!timeLog.startTime) return
    const datetime = new Date()
    const endTime = datetime.toISOString()
    const durationCalc = (new Date(endTime) - new Date(timeLog.startTime)) / 3600000
    const completedLog = {
      ...timeLog,
      id: crypto.randomUUID(),
      endTime: endTime,
      duration: durationCalc
    }
    setTimeLog(completedLog)
    addTimeLog(completedLog)
    setLogs(prev => [...prev, completedLog])
    setStatus("ended")
  }

  const resetLog = () => {
    setTimeLog(initialTimeLog)
    setStatus("idle")
  }

  const addTimeLog = (log) => {
    try {
      const fallbackValue = []
      const raw = localStorage.getItem("timelogs");
      const data = raw ? JSON.parse(raw) : fallbackValue;
      const newData = [...data, log]
      localStorage.setItem("timelogs", JSON.stringify(newData))
    } catch (error) {
      console.log(error)
    }
    
  }

  const removeTimelog = (id) => {
    try {
      const fallbackValue = []
      const raw = localStorage.getItem("timelogs");
      const data = raw ? JSON.parse(raw) : fallbackValue;
      const next = data.filter((timeLog) => timeLog.id != id);
      localStorage.setItem("timelogs", JSON.stringify(next))
      setLogs(next)
    } catch (error) {
      console.log(error)
    }
  }

  const convertDateTime = (datetime) => {
    const time = new Date(datetime).toLocaleString()
    return time
  }

  const downloadCSV = () => {
    const headers = ["id", "startTime", "endTime", "activity", "duration", "energyLevel"];

    const rows = logs.map((log) => {
      return [
        log.id,
        log.startTime,
        log.endTime,
        log.activity,
        log.duration,
        log.energyLevel,
      ].join(",");
    });

    const csvText = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvText], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "timelogs.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
  <div>
    <button onClick={() => downloadCSV()}>download</button>
    
    {logs.map((log) => (
      <div key={log.id}>
        <span><b>Start:</b> {convertDateTime(log.startTime)} </span>
        <span><b>End: </b> {convertDateTime(log.endTime)} </span>
        <span><b>Activity: </b> {log.activity} </span>
        <button onClick={() => removeTimelog(log.id)}>Delete</button>
      </div>
    ))}
    

    <button onClick={startLog} disabled={status !== "idle"}>Start Log</button>
    {status === "started" && <h1>Started at: {new Date(timeLog.startTime).toLocaleString()}</h1>}
    {status === "started" && (
      <>
      <label htmlFor="activity">What activity are you doing?</label>
      <input id="activity" type="text" value={timeLog.activity} onChange={activityLog}/>
      <h1>Activity: {timeLog.activity}</h1>

      <select value={timeLog.energyLevel} onChange={handleEnergyLevel}>
        <option value={0}>Select an Energy level</option>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
        <option value={6}>6</option>
        <option value={7}>7</option>
        <option value={8}>8</option>
        <option value={9}>9</option>
        <option value={10}>10</option>
      </select>
      </>
    )}
    <button onClick={endLog} disabled={status !== "started"} >End Log</button>
    {status === "ended" && timeLog.endTime && <h1>Ended at: {new Date(timeLog.endTime).toLocaleString()}</h1>}

    <button onClick={resetLog} disabled={status !== "ended"}>Reset</button>

  
  </div>


  )
}



export default App
