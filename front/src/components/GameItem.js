import { Link } from 'react-router-dom';
import { css, StyleSheet } from "aphrodite";
import { MEDIA_BASE } from '../services/config';

export function GameItem({ id, name, photo, showTitle = true }) {
    const basePhoto = photo ? photo : '';
    let bg = '';

    if (basePhoto) {
        if (basePhoto.startsWith('http')) {
            bg = basePhoto;
        } else {
            const normalized = basePhoto
                .replace(/^\/?media\//, '')
                .replace(/^\/+/, '');
            bg = `${MEDIA_BASE}/${normalized}`;
        }
    }

    const styles = StyleSheet.create({
        game: {
            position: "relative",
            width: "350px",
            height: "300px",
            backgroundColor: "grey",
            marginBottom: "10px",
            background: bg ? `url(${bg})` : "grey",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end"
        }
    });

    return (
        <Link className='game-link' to={`/games/${id}`}>
            <section className={'roundable ' + css(styles.game)}>
                {
                    name && showTitle ?
                    <div className={'title-field'}>
                        <h1>{name}</h1>
                    </div> : ''
                }
            </section>
        </Link>
    );
}
