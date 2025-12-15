import { Link } from 'react-router-dom';
import { css, StyleSheet } from "aphrodite";

export function GameItem({ id, name, photo }) {
    const basePhoto = photo ? photo : '';
    const bg = basePhoto
        ? (basePhoto.startsWith('http') ? basePhoto : 'http://127.0.0.1:8000' + basePhoto)
        : '';

    const styles = StyleSheet.create({
        game: {
            position: "relative",
            width: "350px",
            height: "350px",
            backgroundColor: "grey",
            marginBottom: "10px",
            background: bg ? `url(${bg})` : "grey",
            backgroundPosition: "center",
            backgroundSize: "cover"
        }
    });

    return (
        <Link className='game-link' to={`/games/${id}`}>
            <section className={'roundable ' + css(styles.game)}>
                {
                    name ?
                    <div className={'title-field'}>
                        <h1>{name}</h1>
                    </div> : ''
                }
            </section>
        </Link>
    );
}
