import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className=" sidebar col-2 h-100">
            <img src={logo} className="img-fluid px-3 py-4" alt="Logo" />
            <ul className="p-0 m-0">
                <li>
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                        <span className="mdi mdi-calendar-check"></span>
                        <span>Agendamentos</span>
                    </Link>
                </li>
                <li>
                    <Link to="/Clientes" className={location.pathname === '/Clientes' ? 'active' : ''}>
                        <span className="mdi mdi-account-multiple"></span>
                        <span>Clientes</span>
                    </Link>
                </li>
                <li>
                    <Link to="/Horarios" className={location.pathname === '/Horarios' ? 'active' : ''}>
                        <span className="mdi mdi-calendar-check"></span>
                        <span>Horários</span>
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
