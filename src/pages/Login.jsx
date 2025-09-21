import React, { useState } from 'react';

export default function Login({ onLogin }){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Hardcoded accounts (change as needed)
  const accounts = [
    { username: "admin", password: "Admin@123" },
    { username: "staff", password: "voucher2025" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = accounts.find(acc => acc.username === username && acc.password === password);
    if(found){
      onLogin();
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="center-screen">
      <form onSubmit={handleSubmit} className="card">
        <h2>Đăng nhập</h2>
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
