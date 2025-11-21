import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="app-container">
            <header className="app-header">
                <nav>
                    <div className="logo">Land Roys</div>
                    <div className="nav-links">
                        <a href="/">Home</a>
                        <a href="/bikes">Bikes</a>
                        <a href="/parts">Parts</a>
                        <a href="/contact">Contact</a>
                    </div>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>

            <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <p>&copy; 2024 Land Roys. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default MainLayout;
