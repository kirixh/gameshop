import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ajaxService } from '../services/ajaxService';
import { GameItem } from './GameItem';
import { Loader } from './loader/Loader';
import { cookies } from "./MyProfile";
import { API_BASE } from "../services/config";

export function Game() {
    const params = useParams();
    const [game, setGame] = useState(null);
    const [category, setCategory] = useState(null);
    const [achievements, setAchievements] = useState(null);
    const [spentHours, setSpentHours] = useState(null);
    const [buyed, setBuyed] = useState(false);
    const [balance, setBalance] = useState(0);
    const [wishlistItemId, setWishlistItemId] = useState(null);
    const [error, setError] = useState(null);

    const token = cookies.get('token');

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
        if (!token) return;

        ajaxService(`/statistics/${params.id}/game/`, {
            headers: {'Authorization': 'Token ' + token},
        })
            .then((data) => {
                if (data.statistic) {
                    setAchievements(data.statistic.achievements);
                    setSpentHours(data.statistic.spent_hours);
                    setBuyed(true);
                } else {
                    setBuyed(false);
                }
            })
            .catch(() => {});
    }, [params.id, token]);

    useEffect(() => {
        if (!token) return;
        ajaxService('/profile/', {headers: {'Authorization': 'Token ' + token}})
            .then((data) => {
                setBalance(data.balance ?? 0);
                const wish = (data.wishlist || []).find((item) => item.game.id === Number(params.id));
                setWishlistItemId(wish ? wish.id : null);
            })
            .catch(() => {});
    }, [params.id, token]);

    function handleBuy(event) {
        event.preventDefault();
        if (!token) {
            window.location.href = '/login';
            return;
        }
        setError(null);
        fetch(`${API_BASE}/statistics/`, {
            method: 'POST',
            body: `{"achievements": "[]", "spent_hours": "0.0", "game": ${params.id}}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.detail || 'Не удалось купить игру');
                }
                window.location.href = '/congrats';
            })
            .catch((err) => setError(err.message));
    }

    function handleWishlist() {
        if (!token) {
            window.location.href = '/login';
            return;
        }
        setError(null);

        if (wishlistItemId) {
            ajaxService(`/wishlist/by-game/${params.id}/`, {
                method: 'DELETE',
                headers: {'Authorization': 'Token ' + token}
            }).then(() => setWishlistItemId(null))
                .catch(() => setError('Не удалось удалить из желаемого'));
        } else {
            ajaxService('/wishlist/', {
                method: 'POST',
                headers: {'Authorization': 'Token ' + token},
                body: JSON.stringify({game: Number(params.id)}),
            }).then((data) => setWishlistItemId(data.id))
                .catch(() => setError('Не удалось добавить в желаемое'));
        }
    }

    return (
        <React.Fragment>
            <aside className='game-aside'>
                <div className={'game-title'}>
                    <h1>{game ? game.name : ''}</h1>
                    <h2>{game ? game.description : ''}</h2>
                    {game && <h3>Цена: {game.price} ₽</h3>}
                    {token && <div className="profile-balance">Баланс: {balance} ₽</div>}
                    <div className="game-actions">
                        {!buyed ? (
                            <button className="submit-button" type='submit' onClick={handleBuy}>
                                Купить
                            </button>
                        ) : (
                            <div className="buyed-text">Куплено</div>
                        )}
                        <button className="submit-button" type='button' onClick={handleWishlist}>
                            {wishlistItemId ? 'Убрать из желаемого' : 'В желаемое'}
                        </button>
                    </div>
                    {error && <div className="status-text error">{error}</div>}
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
                                showTitle={false}
                                name={game.name}
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
                            {game && buyed ? 'Затрачено времени: ' + spentHours + ' часов' : ''}
                        </h3>
                    </div>
                </div>
            </aside>
        </React.Fragment>
    );
}
