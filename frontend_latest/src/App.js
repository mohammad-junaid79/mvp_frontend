import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState(null);

  const API_BASE = "http://http://13.204.69.173:8000"; // replace

  const createUser = async () => {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username }),
    });
    setResponse(await res.json());
  };

  const getCount = async () => {
    const res = await fetch(`${API_BASE}/users/count`);
    setResponse(await res.json());
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Management</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={createUser}>Create User</button>
      <button onClick={getCount}>Get User Count</button>

      {response && (
        <pre style={{ marginTop: "20px", background: "#eee", padding: "10px" }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
