import {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./register.css";
import UserRole from "../../model/UserRole.ts";
import RoleService from "../../service/RoleService.ts";
import UserService from "../../service/UserService.ts";
import User from "../../model/User.ts";
import {useNavigate} from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [roles, setRoles] = useState<UserRole[]>([]);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const roleService : RoleService = new RoleService();
    const userService : UserService = new UserService();
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleRoleChange = (event) => {
        const selectedRoleId = event.target.value;
        const role = roles.find(role => role.id === selectedRoleId);
        setSelectedRole(role || null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const userToSave : User = new User();
        userToSave.username=username;
        userToSave.password=password;
        if (selectedRole) {
            userToSave.userRoles.push(selectedRole)
        }
        userService.createUser(userToSave).then(response => {
            console.log(response);
        })
        navigate('/');
    };

    async function getRole(){
        roleService.getAllRoles().then(response => {
            setRoles(response.data);
        })
    }

    useEffect(() => {
        getRole()
    }, []);

    return (
        <div className="main">
            <div className="register-container">
                <h2 className="register-title">Registro de usuário</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Control
                        size="lg"
                        className="input-register"
                        type="text"
                        placeholder="Usuário"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <Form.Control
                        size="lg"
                        className="input-register"
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Form.Select className="input-register"
                    onChange={handleRoleChange}
                    >
                        <option>Selecione uma role</option>
                        {roles.map((role) => (
                            <option value={role.id}>{role.name}</option>
                        ))}
                    </Form.Select>
                    <Button
                        className="btn-login"
                        variant="primary"
                        type="submit">
                        Cadastrar
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default Register;
