import { useEffect, useState } from "react";
import { API_BASE_URL } from "./config";
import './styles/App.css'

function App() {
  const [message, setMessage] = useState<string>("(loading...)");

  useEffect(() => {
    fetch(`${API_BASE_URL}/db-ping`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.text();
      })
      .then((data) => setMessage(data))
      .catch((err) => setMessage("Error: " + err.message));
  }, []);

  return (
    <div className="app">
      <header className="app-header"></header>
      <main className="app-main">
        <h1>knockbook-frontend</h1>
        <p>response: {message}</p>
      </main>
      <footer className="app-footer"></footer>
    </div>
  )
}

export default App
