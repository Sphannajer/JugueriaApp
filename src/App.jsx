import { Routes, Route } from "react-router-dom";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Inicio from "./features/products/pages/Home.jsx";
import Visitanos from "./features/common/pages/Visitanos.jsx";
import Contactanos from "./features/common/pages/Contactanos.jsx";
import Nosotros from './features/common/pages/Nosotros.jsx';
import "./styles/App.css";
import Menu from "./features/products/pages/Menu.jsx";
import LoginGuard from "./features/guards/loginGuard.jsx";
import PantallaVerificacionCorreo from "./features/auth/pages/PantallaVerificacionCorreo.jsx";
import SlideCart from "./components/Slide-Cart/Slide-Cart.jsx";

import DashboardLayout from './components/Administrador/DashboardLayout.jsx';

import DashboardView from './features/common/pages/Dashboard.jsx'; 
import VentasAdminView from './features/common/pages/VentasAdmin.jsx';
import InventarioAdminView from './features/common/pages/InventarioAdmin.jsx';
import MenuProducAdminView from './features/common/pages/MenuProducAdmin.jsx';
import ClientesAdminView from './features/common/pages/ClientesAdmin.jsx';
import FinanzasAdminView from './features/common/pages/FinanzasAdmin.jsx';
import PromocionesAdminView from './features/common/pages/PromocionesAdmin.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginGuard><Login /></LoginGuard>} />
        <Route path="/register" element={<LoginGuard><Register /></LoginGuard>} />
        <Route path="/" element={<Inicio />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/visitanos" element={<Visitanos />} />
        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/pantalla" element={<PantallaVerificacionCorreo />} />

        <Route path="/admin" element={<DashboardLayout />}>


          <Route index element={<DashboardView />} />

          {/* Ruta Hija 2: VENTAS (/administrativo/ventas) */}
          <Route path="ventas" element={<VentasAdminView />} />

          {/* Ruta Hija 3: INVENTARIO (/administrativo/inventario) */}
          <Route path="inventario" element={<InventarioAdminView />} />

          {/* Ruta Hija 4: MENÚ DE PRODUCTOS (/administrativo/productos) */}
          <Route path="productos" element={<MenuProducAdminView />} />

          {/* Ruta Hija 5: CLIENTES (/administrativo/clientes) */}
          <Route path="clientes" element={<ClientesAdminView />} />

          {/* Ruta Hija 6: FINANZAS (/administrativo/finanzas) */}
          <Route path="finanzas" element={<FinanzasAdminView />} />

          {/* Ruta Hija 7: PROMOCIONES (/administrativo/promociones) */}
          <Route path="promociones" element={<PromocionesAdminView />} />

          {/* Puedes agregar una ruta para Configuración si tienes un componente de vista */}
          <Route path="configuracion" element={<div>Configuración View</div>} />

        </Route>
      </Routes>
      
      <SlideCart />
    </>
  );
}

export default App;
