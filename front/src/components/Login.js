import React, {useState} from "react";
import {cookies} from "./MyProfile";
import {Link} from "react-router-dom";


export function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    function handleSubmit(event) {
        event.preventDefault();

        fetch('http://127.0.0.1:8000/auth/token/login/', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type': 'application/json'},
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Неправильный логин или пароль!');
                }
                return response.json();
            })
            .then((data) => {
                cookies.set('token', data.auth_token);
                window.location.href = '/';
            })
            .catch((error) => {
                setError(error.message);
            });
    }

    return (
        <div className="auth-card">
            <h2 className="auth-title">Вход</h2>
            <p className="auth-subtitle">Продолжайте покупать игры и следить за прогрессом</p>
            {error && <div className="status-text error">{error}</div>}
            <form onSubmit={handleSubmit} className="auth-form">
                <label className="auth-label">
                    <span>Логин</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Введите логин"
                    />
                </label>
                <label className="auth-label">
                    <span>Пароль</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Введите пароль"
                    />
                </label>
                <button className="submit-button" type="submit">Войти</button>
            </form>
            <div className="auth-footer">
                <span>Нет аккаунта?</span> <Link to="/register">Зарегистрироваться</Link>
            </div>
        </div>
    );
}

export function Login() {
    return <aside className="main-aside auth-wrapper"><LoginForm/></aside>;
}
