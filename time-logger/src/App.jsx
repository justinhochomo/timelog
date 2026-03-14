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
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Personal Time Log</p>
          <h1>Browser-based time logging that stays on your device.</h1>
          <p className="hero-text">
            Track sessions, note activity, rate energy, and export your history as CSV. Your logs are stored locally in your browser.
          </p>
        </div>
        <div className="hero-actions">
          <button className="secondary-button" onClick={downloadCSV}>Download CSV</button>
          <span className="log-count">{logs.length} saved {logs.length === 1 ? "log" : "logs"}</span>
        </div>
      </section>

      <section className="session-panel">
        <div className="section-heading">
          <p className="section-label">Current Session</p>
          <h2>{status === "idle" ? "Ready to begin" : status === "started" ? "Session in progress" : "Session complete"}</h2>
        </div>

        <div className="button-row">
          <button className="primary-button" onClick={startLog} disabled={status !== "idle"}>Start Log</button>
          <button className="primary-button" onClick={endLog} disabled={status !== "started"}>End Log</button>
          <button className="secondary-button" onClick={resetLog} disabled={status !== "ended"}>Reset</button>
        </div>

        <div className="session-meta">
          {timeLog.startTime && (
            <div className="meta-card">
              <span className="meta-label">Started</span>
              <span className="meta-value">{convertDateTime(timeLog.startTime)}</span>
            </div>
          )}
          {timeLog.endTime && (
            <div className="meta-card">
              <span className="meta-label">Ended</span>
              <span className="meta-value">{convertDateTime(timeLog.endTime)}</span>
            </div>
          )}
          {timeLog.duration > 0 && (
            <div className="meta-card">
              <span className="meta-label">Duration</span>
              <span className="meta-value">{timeLog.duration.toFixed(2)} hours</span>
            </div>
          )}
        </div>

        {status === "started" && (
          <div className="form-grid">
            <label className="field">
              <span className="field-label">Activity</span>
              <input id="activity" type="text" value={timeLog.activity} onChange={activityLog} placeholder="Writing, planning, coding..." />
            </label>

            <label className="field">
              <span className="field-label">Energy Level</span>
              <select value={timeLog.energyLevel} onChange={handleEnergyLevel}>
                <option value={0}>Select an energy level</option>
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
            </label>
          </div>
        )}
      </section>

      <section className="logs-panel">
        <div className="section-heading">
          <p className="section-label">Saved Logs</p>
          <h2>Session history</h2>
        </div>

        {logs.length === 0 ? (
          <div className="empty-state">No saved logs yet. Finish one session and it will appear here.</div>
        ) : (
          <div className="logs-list">
            {logs.map((log) => (
              <article className="log-card" key={log.id}>
                <div className="log-card-header">
                  <div>
                    <p className="log-activity">{log.activity || "Untitled activity"}</p>
                    <p className="log-id">ID: {log.id}</p>
                  </div>
                  <button className="danger-button" onClick={() => removeTimelog(log.id)}>Delete</button>
                </div>

                <div className="log-details">
                  <span><strong>Start:</strong> {convertDateTime(log.startTime)}</span>
                  <span><strong>End:</strong> {convertDateTime(log.endTime)}</span>
                  <span><strong>Duration:</strong> {log.duration.toFixed(2)} hours</span>
                  <span><strong>Energy:</strong> {log.energyLevel}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}



export default App
