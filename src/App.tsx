import './App.css';
import Login from "./view/login";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import Home from "./view/home";
import Rental from "./view/rental";
import Register from "./view/register";
import NavbarCustom from "./components/nav.tsx";
import Users from "./view/users";

function App() {
    const location = useLocation();

    const isLoginRoute = location.pathname === "/";

    return (
        <div>
            {!isLoginRoute && <NavbarCustom />}
            <Routes>
                <Route path="home" element={<Home />} />
                <Route path="/" element={<Login />} />
                <Route path="rental" element={<Rental />} />
                <Route path="register" element={<Register />} />
                <Route path="administrador" element={<Users />} />
            </Routes>
        </div>
    );
}

export default function AppWrapper() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}
