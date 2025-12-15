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
        <form onSubmit={handleSubmit}>
            {error && <p style={{"color": "red"}}>{error}</p>}
            <label>
                Username:
                <input type="username" value={username} onChange={(event) => setUsername(event.target.value)}/>
            </label>
            <br/>
            <label>
                Password:
                <input
                    type="password" value={password} onChange={(event) => setPassword(event.target.value)}
                />
            </label>
            <br/>
            <button className="submit-button" type="submit">Log In</button>
            <Link to="/register">Register</Link>
        </form>
    );
}

export function Login() {
    return <aside className="main-aside"><LoginForm/></aside>;
}
