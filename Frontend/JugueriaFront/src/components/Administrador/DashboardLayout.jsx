import Sidebar from './Siberbar';
import { Outlet } from 'react-router-dom'; 
import Header from './HeaderAdmin';   
import '../../styles/dashboard.css'; 
export default function Dashboard() {
    return (
        <div className="dashboard-layout">
            
            <Sidebar />

            <main className="main-content">
                
                <Header />
                <Outlet /> 
                
               
            </main>
        </div>
    );
}