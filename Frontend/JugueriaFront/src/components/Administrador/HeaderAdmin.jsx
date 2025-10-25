export default function HeaderAdmin() {
    return (
        <header className="main-header">
            <div className="header-controls">
                <div className="search-bar">
                    <input type="text" placeholder='search' className='search-input' />
                </div>

                <div className="user-profile">
                    <i className="icon-user-admin">[I]</i> {/* Ícono Placeholder */}
                    <span className="user-name">Nombre Admin</span>
                </div>
            </div>
        </header>
    );
}