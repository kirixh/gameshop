import {HeaderLink} from './HeaderLink';
import {cookies} from './MyProfile'
import React from "react";

export function Header() {
    function Profile() {
        const isAuthenticated = cookies.get('token');
        if (isAuthenticated) {
            return (
                <React.Fragment>
                    <HeaderLink to='/profile'>Мой профиль</HeaderLink>
                    <HeaderLink to='/logout'>Выйти</HeaderLink>
                </React.Fragment>)
        } else {
            return <HeaderLink to='/login'>Войти</HeaderLink>
        }
    }


    return (
        <header className='main-header'>
            <HeaderLink to=''>Главная</HeaderLink>
            <HeaderLink to='/info'>О сайте</HeaderLink>
            <Profile/>
        </header>
    );
}
