import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./login.css";
import SessionService from "../../service/SessionService.ts";
import User from "../../model/User";
import {Link, useNavigate} from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const loginService : SessionService = new SessionService();
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if(!username && !password){
            return navigate('/');
        }
        const usuario: User = new User();
        usuario.username=username;
        usuario.password=password;
        loginService.login(usuario)
            .then(response => {
                response.data == true ? navigate('/home') : navigate('/');
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div className="main">
            <div className="login-container">
                <h2 className="login-title">Sistema de Biblioteca</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Control
                        size="lg"
                        className="input-login"
                        type="text"
                        placeholder="Usuário"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <Form.Control
                        size="lg"
                        className="input-login"
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Button
                        className="btn-login"
                        variant="primary"
                        type="submit">
                        Logar
                    </Button>
                    <Link to={"register"}> Ainda não possui cadastro? Registre aqui! </Link>
                </Form>
            </div>
        </div>
    );
}

export default Login;
