import { useEffect, useState } from "react";
import { API_BASE_URL } from "./config";
import './styles/App.css'
import TwoWayButton from "./components/forms/TwoWayButton";

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
        <TwoWayButton
          leftContent="텍스트"
          rightContent="텍스트"
          defaultActive="left"
          onToggle={(active) => console.log("현재 활성 버튼:", active)}
        ></TwoWayButton>
      </main>
      <footer className="app-footer"></footer>
    </div>
  )
}

export default App
