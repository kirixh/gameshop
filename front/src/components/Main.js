import { useEffect, useState } from 'react';
import { ajaxService } from '../services/ajaxService';
import { GameItem } from './GameItem'

export function Main() {
    const [games, setGames] = useState(null);

    useEffect(() => {
        ajaxService('/games/').then((data) => {
            const games = [];
            data.forEach((game) => {
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
        });
    }, []);

    return <aside className='main-aside'>{games}</aside>;
}
