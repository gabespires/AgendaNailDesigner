import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Agendamentos from './pages/Agendamentos';
import Clientes from './pages/Clientes';

const AppRoutes = () => {
    return (
        <>
            <Header />
            <div className="container-fluid h-100" style={{ backgroundColor: '#FFF8F2' }}>
                <div className="row h-100">
                    <Router>
                        <Sidebar />
                        <Routes>
                            <Route path="/" exact element={<Agendamentos />} />
                            <Route path="/Clientes" exact element={<Clientes />} />
                        </Routes>
                    </Router>
                </div>
            </div>
        </>
    );
};

export default AppRoutes;
