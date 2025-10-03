import logoJugueria from '../../../public/images/logo.png';
import { Link } from 'react-router-dom';

// La lista de enlaces de navegación
const navLinks = [
    { name: 'Dashboard', path: '/admin', isActive: true }, // Usamos 'path' en lugar de 'href'
    { name: 'Ventas', path: '/admin/ventas' },
    { name: 'Inventario', path: '/admin/inventario' },
    { name: 'Menú de Productos', path: '/admin/productos' },
    { name: 'Clientes', path: '/admin/clientes' },
    { name: 'Finanzas', path: '/admin/finanzas' },
    { name: 'Promociones', path: '/admin/promociones' },
    { name: 'Configuración', path: '/admin/configuracion' },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-placeholder">
                    <img src={logoJugueria} alt="logoOficial" className="logo-img" />
                </div>
            </div>

            <nav className="main-navigation">
                <ul className="nav-list">
                    {navLinks.map((link, index) => (
                        <li key={index} className={`nav-item ${link.isActive ? 'active' : ''}`}>
                           
                            <Link to={link.path}>{link.name}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}