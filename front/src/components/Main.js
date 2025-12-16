import { useEffect, useState } from 'react';
import { ajaxService } from '../services/ajaxService';
import { GameItem } from './GameItem';
import { Loader } from './loader/Loader';

export function Main() {
    const [gamesData, setGamesData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        ajaxService('/games/categories/')
            .then((data) => setCategories(data.categories || []))
            .catch((err) => setError(err.message));
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const params = [];
        const term = searchTerm.trim();
        if (selectedCategory !== 'all') {
            params.push(`category_id=${selectedCategory}`);
        }
        if (term) {
            params.push(`search=${encodeURIComponent(term)}`);
        }
        const query = params.length ? `?${params.join('&')}` : '';

        const timer = setTimeout(() => {
            ajaxService(`/games/${query}`)
                .then((data) => {
                    setGamesData(data || []);
                    setLoading(false);
                })
                .catch((err) => {
                    setGamesData([]);
                    setError(err.message);
                    setLoading(false);
                });
        }, 300);

        return () => clearTimeout(timer);
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
                {loading && (
                    <div className='loader-wrap'>
                        <Loader />
                    </div>
                )}
                {error && !loading && <div className='status-text error'>{error}</div>}
                {!loading && !error && gamesData.length === 0 && (
                    <div className='status-text'>Ничего не найдено</div>
                )}
                {!loading && !error && gamesData.map((game) => (
                    <GameItem
                        key={game.id}
                        id={game.id}
                        name={game.name}
                        photo={game.photo}
                    />
                ))}
            </div>
        </aside>
    );
}
