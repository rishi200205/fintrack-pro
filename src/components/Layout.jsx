import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <nav>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/transactions">Transactions</Link>
                <Link to="/analytics">Analytics</Link>
                <Link to="/settings">Settings</Link>
            </nav>

            <main>
                <Outlet />
            </main>
        </>
    );
}