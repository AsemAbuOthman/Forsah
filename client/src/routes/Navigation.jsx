import { NavLink } from 'react-router-dom';

export default function Navigation() {
    return (
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/signin">Sign In</NavLink>
            <NavLink to="/login">Log In</NavLink>
            <NavLink to="/logout">Log Out</NavLink>

            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/profile/:id">Some Profile</NavLink>
            <NavLink to="/account_analytics">Account Analytics</NavLink>
            
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/freelancers">Freelancers</NavLink>
            <NavLink to="/messages">Messages</NavLink>
            <NavLink to="/dashboard_page">Dashboard Page</NavLink>

            <NavLink to="/favorite_page">Favorite Page</NavLink>
            <NavLink to="/post_project">Post Project</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/proposals">Proposals</NavLink>

            <NavLink to="/payment">Payment</NavLink>
            <NavLink to="/projects_table">Projects Table</NavLink>
            <NavLink to="/rating">Rating</NavLink>
            <NavLink to="/transaction_history">Transaction History</NavLink>
            
        </nav>
    );
}



{/* <Link to="/"></Link>
<Link to="/signin"></Link>
<Link to="/login"></Link>
<Link to="/dashboard"></Link>
<Link to="/profile"></Link>
<Link to="/profile/:id"></Link>
<Link to="/account_analytics"></Link>
<Link to="/projects"></Link>
<Link to="/freelancers"></Link>
<Link to="/messages"></Link>
<Link to="/dashboard_page"></Link>
<Link to="/favorite_page"></Link>
<Link to="/post_project"></Link>
<Link to="/projects"></Link>
<Link to="/proposals"></Link>
<Link to="/payment"></Link>
<Link to="/projects_table"></Link>
<Link to="/rating"></Link> */}