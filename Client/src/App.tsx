import React from "react";
import "./App.css";
import Keyboard from "./keyboard";

function App() {
  // Safely parse user ID
  const searchParams = new URLSearchParams(window.location.search);
  const userIdParam = searchParams.get("user");
  const userId = userIdParam ? parseInt(userIdParam, 10) : 2;

  return (
    <div className="app">
      <Keyboard userId={userId} />
    </div>
  );
}

export default App;
