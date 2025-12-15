import { useEffect, useState } from 'react';
import { ajaxService } from '../services/ajaxService';
import { GameItem } from './GameItem'

export function Main() {
    const [games, setGames] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        ajaxService('/games/categories/').then((data) => {
            setCategories(data.categories || []);
        });
    }, []);

    useEffect(() => {
        const params = [];
        if (selectedCategory !== 'all') {
            params.push(`category_id=${selectedCategory}`);
        }
        if (searchTerm.trim()) {
            params.push(`search=${encodeURIComponent(searchTerm.trim())}`);
        }
        const query = params.length ? `?${params.join('&')}` : '';

        ajaxService(`/games/${query}`).then((data) => {
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
    }, [selectedCategory, searchTerm]);

    function handleCategoryChange(event) {
        setSelectedCategory(event.target.value);
    }

    return (
        <aside className='main-aside'>
            <div className='filters-bar'>
                <div className='filter-item'>
                    <span className='filter-label'>Категория</span>
                    <select value={selectedCategory} onChange={handleCategoryChange}>
                        <option value='all'>Все</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.title}</option>
                        ))}
                    </select>
                </div>
                <div className='filter-item'>
                    <span className='filter-label'>Поиск</span>
                    <input
                        type='text'
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder='Введите название'
                    />
                </div>
            </div>
            <div className='game-grid'>
                {games}
            </div>
        </aside>
    );
}
