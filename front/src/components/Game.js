import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ajaxService } from '../services/ajaxService';
import { GameItem } from './GameItem';
import { Loader } from './loader/Loader';
import {cookies} from "./MyProfile";

export function Game() {
    const params = useParams();
    const [game, setGame] = useState(null);
    const [category, setCategory] = useState(null);
    const [achievements, setAchievements] = useState(null);
    const [spentHours, setSpentHours] = useState(null);
    const [buyed, setBuyed] = useState(null);

    useEffect(() => {
        ajaxService(`/games/${params.id}/`).then((data) => {
            setGame(data);
        });
    }, [params.id]);


    useEffect(() => {
        ajaxService(`/games/${params.id}/category/`).then((data) => {
            setCategory(data.category);
        });
    }, [params.id]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/statistics/${params.id}/game/`, {
            method: 'GET',
            headers: {'Authorization': 'Token ' + cookies.get('token')},
        })
            .then((response) => {
                if (!response.ok && cookies.get('token')) {
                    throw new Error('Failed to get statistics: ' + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                if (cookies.get('token') && data.statistic) {
                    setAchievements(data.statistic.achievements);
                    setSpentHours(data.statistic.spent_hours);
                    setBuyed(true);
                }
            })
    }, [params.id]);

    function BuyButton(event) {
        event.preventDefault();
        if (cookies.get('token')) {
            fetch(`http://127.0.0.1:8000/api/v1/statistics/`, {
                method: 'POST',
                body: `{"achievements": "[]", "spent_hours": "0.0", "game": ${params.id}}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + cookies.get('token')
                },
            })
                .then((response) => {
                    if (!response.ok && !cookies.get('token')) {
                        throw new Error('Failed to get statistics: ' + response.statusText);
                    }
                    window.location.href = '/congrats'
                })
        } else {
            window.location.href = '/login'
        }
    }

    return (
        <React.Fragment>
        <aside className='game-aside'>
            <div className={'game-title'}>
                <h1>
                    {game ? game.name : ''}
                </h1>
                <h2>
                    {game ? game.description : ''}
                </h2>
                {!buyed ?
                    <button className="submit-button" type='submit' onClick={BuyButton}>
                        Купить
                    </button> :
                    <div className="buyed-text">
                        Куплено
                    </div>}

            </div>
            <div className={'description-field'}>
                <div>
                    <h1 style={{"textAlign": "center"}}>
                        {game ? game.name : ''}
                    </h1>
                </div>
                <div className={'game-photo'}>
                    {
                        game ? (
                            <GameItem
                                key={game.id}
                                id={game.id}
                                photo={game.photo}
                            />
                        ) : (
                            <Loader />
                        )
                    }
                </div>
                <div>
                    <h3>
                        {game ? 'Жанр: ' + category : ''}
                    </h3>
                    <h3>
                        {game && buyed ? 'Твои достижения: ' + achievements : ''}
                    </h3>
                    <h3>
                        {game && buyed ? 'Проведено времени: ' + spentHours + ' часов' : ''}
                    </h3>
                </div>
            </div>
        </aside>
        </React.Fragment>
    );
}