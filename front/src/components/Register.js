import React, {useState} from "react";
import {Link} from "react-router-dom";

export function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    function handleSubmit(event) {
        event.preventDefault();

        fetch('http://127.0.0.1:8000/api/v1/auth/users/', {
            method: 'POST',
            body: JSON.stringify({username, password, email}),
            headers: {'Content-Type': 'application/json'},
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Не удалось зарегистрироваться. Проверьте данные и попробуйте ещё раз.');
                }
                return response.json();
            })
            .then(() => {
                window.location.href = '/login';
            })
            .catch((error) => {
                setError(error.message);
            });
    }

    return (
        <div className="auth-card">
            <h2 className="auth-title">Регистрация</h2>
            <p className="auth-subtitle">Создайте аккаунт, чтобы покупать игры и отслеживать прогресс</p>
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
                    <span>Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="example@mail.com"
                    />
                </label>
                <label className="auth-label">
                    <span>Пароль</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Придумайте пароль"
                    />
                </label>
                <button className="submit-button" type="submit">Зарегистрироваться</button>
            </form>
            <div className="auth-footer">
                <span>Уже есть аккаунт?</span> <Link to="/login">Войти</Link>
            </div>
        </div>
    );
}


export function Register() {
    return <aside className="main-aside auth-wrapper"><RegisterForm/></aside>;
}
