import React from "react";
import {Link} from "react-router-dom";
import {useState} from "react";

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
                    throw new Error('Удостоверьтесь, что пароль достаточно безопасен. Также проверьте корректность введённых данных.');
                }
                return response.json();
            })
            .then((data) => {
                window.location.href = '/login';
            })
            .catch((error) => {
                setError(error.message);
            });
    }

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="username" value={username} onChange={(event) => setUsername(event.target.value)}/>
                </label>
                <br/>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)}/>
                </label>
                <br/>
                <label>
                    Password:
                    <input
                        type="password" value={password} onChange={(event) => setPassword(event.target.value)}
                    />
                </label>
                <br/>
                <button className="submit-button" type="submit">Register</button>
                <Link to="/login">Log in</Link>
            </form>
            <p>{error && <p style={{"color": "red"}}>{error}</p>}</p>
        </React.Fragment>
    );
}


export function Register() {
    return <aside className="main-aside"><RegisterForm/></aside>;
}
