import Cookies from "universal-cookie";
import React, {useEffect, useState} from 'react';
import {GameItem} from "./GameItem";
import {ajaxService} from "../services/ajaxService";

export const cookies = new Cookies();

export function MyGames() {
    const [games, setGames] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        ajaxService('/statistics/user/', {
            headers: {'Authorization': 'Token ' + cookies.get('token')}
        })
            .then((data) => {
                setBalance(data.balance ?? 0);
                const ownedGames = data.games || [];
                setGames(ownedGames);
                const wishlistGames = (data.wishlist || []).map((item) => item.game);
                setWishlist(wishlistGames);
            })
            .catch(() => {
                if (cookies.get('token')) {
                    // stay on page, optionally show message
                } else {
                    window.location.href = '/';
                }
            });
    }, []);

    return (
        <React.Fragment>
            <div className="profile-section">
                <div className="profile-balance">
                    Баланс: {balance} ₽
                </div>
            </div>

            <div className="profile-section">
                <h3 className="profile-heading">Купленные игры</h3>
                <div className="game-grid">
                    {games.length === 0 && <div className='status-text'>Пока нет купленных игр</div>}
                    {games.map((game) => (
                        <GameItem
                            key={game.id}
                            id={game.id}
                            name={game.name}
                            photo={game.photo}
                        />
                    ))}
                </div>
            </div>

            <div className="profile-section">
                <h3 className="profile-heading">Список желаемого</h3>
                <div className="game-grid">
                    {wishlist.length === 0 && <div className='status-text'>Пока пусто</div>}
                    {wishlist.map((game) => (
                        <GameItem
                            key={game.id}
                            id={game.id}
                            name={game.name}
                            photo={game.photo}
                        />
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
}

export function MyProfile() {
    return <aside className='main-aside'><MyGames/></aside>;
}
