import { NavLink } from 'react-router-dom';

export default function Navigation() {
    return (
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/signin">Sign In</NavLink>
            <NavLink to="/login">Log In</NavLink>
            <NavLink to="/logout">Log Out</NavLink>
        </nav>
    );
}