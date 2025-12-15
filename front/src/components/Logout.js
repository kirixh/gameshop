import React, {useEffect} from "react";
import {Loader} from "./loader/Loader";
import {cookies} from "./MyProfile";

export function Logout() {
    useEffect(() => {
        fetch('http://127.0.0.1:8000/auth/token/logout/', {
            method: 'POST',
            headers: {'Authorization': 'Token ' + cookies.get('token')},
        })
            .then((response) => {
                cookies.set('token', '');
                window.location.href = '/';
            })
    }, []);

    return <aside className="main-aside"><Loader/></aside>;
}