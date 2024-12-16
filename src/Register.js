import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 用於跳轉頁面

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // 初始化 useNavigate

    const handleRegister = async (e) => {
        e.preventDefault(); // 防止表單提交刷新頁面
        try {
            const response = await axios.post('http://localhost:5000/register', {
                email,
                password,
            });
            setMessage(response.data.message);
            if (response.status === 201) {
                // 註冊成功，跳轉至登入頁面
                alert('註冊成功！即將跳轉至登入頁面');
                setEmail(''); // 清空輸入框
                setPassword('');
                navigate('/login'); // 跳轉到登入頁面
            }
        } catch (error) {
            if (!error.response) {
                setMessage('無法連接伺服器，請稍後再試');
            } else {
                setMessage(error.response?.data?.message || '註冊失敗');
            }
        }
    };

    return (
        <div>
            <h2>註冊</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="email"
                    placeholder="電子郵件"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="密碼"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">註冊</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;
