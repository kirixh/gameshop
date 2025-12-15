import { Link } from 'react-router-dom';

export const HeaderLink = (props) => {
    const { to, children } = props;

    return (
        <Link to={to}>
            <button className="main-button">{children}</button>
        </Link>
    );
};
