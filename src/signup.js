import React, { useState } from 'react';
import axios from 'axios';
import './signup.css';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('密碼不一致');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/register', {
                username,
                email,
                password,
            });
            setMessage(response.data.message1);
            alert('註冊成功！請返回登入頁面');
        } catch (error) {
            setMessage(error.response?.data?.message || '註冊失敗');
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>註冊</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="username">使用者名稱</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="使用者名稱"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label htmlFor="email">電子郵件</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="電子郵件"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">密碼</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="密碼"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="confirm-password">確認密碼</label>
                    <input
                        type="password"
                        id="confirm-password"
                        placeholder="再次輸入密碼"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit">註冊</button>
                </form>
                {message && <p className="message">{message}</p>}
                <a href="/login" className="register-link">已有帳號？返回登入</a>
            </div>
        </div>
    );
}

export default Register;
