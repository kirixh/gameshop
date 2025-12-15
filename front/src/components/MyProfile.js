import Cookies from "universal-cookie"
import React, {useEffect, useState} from 'react';
import {GameItem} from "./GameItem";

export const cookies = new Cookies()

export function MyGames() {
    const [games, setGames] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/v1/statistics/user/', {
            method: 'GET',
            headers: {'Authorization': 'Token ' + cookies.get('token')},
        })
            .then((response) => {
                if (!response.ok) {
                    if (cookies.get('token')) {
                        throw new Error('Failed to get statistics: ' + response.statusText);
                    } else {
                        window.location.href = '/'
                    }
                }
                return response.json();
            })
            .then((data) => {
                const games = [];
                data.games.forEach((game) => {
                    const gameElement = (
                        <GameItem
                            key={game.id}
                            id={game.id}
                            name={game.name}
                            photo={game.photo}
                        />
                    );
                    games.push(gameElement);
                });
                setGames(games);
            })
    }, []);

    return <React.Fragment>{games}</React.Fragment>;
}

export function MyProfile() {
    return <aside className='main-aside'><MyGames/></aside>;
}
