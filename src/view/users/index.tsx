import "./users.css"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import UserRole from "../../model/UserRole.ts";
import RoleService from "../../service/RoleService.ts";
import UserService from "../../service/UserService.ts";
import {useNavigate} from "react-router-dom";
import User from "../../model/User.ts";
import {Col, Row, Table} from "react-bootstrap";
import SessionService from "../../service/SessionService.ts";
import Session from "../../model/Session.ts";

function Users(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [id, setId] = useState<string | null>("");
    const [roles, setRoles] = useState<UserRole[]>([]);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [userList, setUserList] = useState<User[]>([]);
    const [session, setSession] = useState<Session>();
    const roleService : RoleService = new RoleService();
    const userService : UserService = new UserService();
    const sessionService : SessionService = new SessionService();
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
        if(isEdit){
            userToSave.id = id;
            userService.updateUser(userToSave).then(response => {
                setIsEdit(false);
                resetFields();
                fetchUsers()
            })
        } else{
            userService.createUser(userToSave).then(response => {
                fetchUsers();
                resetFields();
            })
        }

    };

    function resetFields(){
        setPassword("");
        setUsername("");
        setSelectedRole(null)
    }

    function isAdmin() : boolean{
        return session?.user.userRoles[0]?.name == "Admin";
    }

    function getRole(){
        roleService.getAllRoles().then(response => {
            setRoles(response.data);
        })
    }

    function loadUserEdit( user : User){
        setUsername(user.username);
        setId(user.id);
        setSelectedRole(user.userRoles[0]);
        setIsEdit(true);
    }

    function getSession(){
        sessionService.getSession().then(r => setSession(r.data))
            .catch(error => {
                console.error(error)
                navigate('/');
            });
    }

    function fetchUsers(){
        userService.getAllUsers().then(response => {
            setUserList(response.data);
        })
    }

    useEffect(() => {
        getRole()
        getSession()
        fetchUsers()
    }, []);

    function deleteUser(id : string){
        userService.deleteUser(id).then(response => {
            console.log(response.data);
        })
    }

    const handleConfirm = (id : string) => {
        const isConfirmed = confirm('Você quer continuar?');
        if (isConfirmed) {
            deleteUser(id)
            alert('Usuário deletado"');
            fetchUsers();
        } else {
            alert('Exclusão cancelada"');
        }
    };

    return (
        <div className="container">
            <h1>Administrador</h1>
            <Form onSubmit={handleSubmit} className="form">
                <Row>
                    <Col>
                        <Form.Control
                            size="lg"
                            className="input-register"
                            type="text"
                            placeholder="Usuário"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            size="lg"
                            className="input-register"
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </Col>
                    <Col>
                        <Form.Select className="select-form"
                                     onChange={handleRoleChange}
                        >
                            <option>Selecione uma role</option>
                            {roles.map((role) => (
                                <option value={role.id}>{role.name}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col>
                        {isEdit ?
                            <Button
                                className="btn-form"
                                variant="success"
                                type="submit">
                                Editar
                            </Button> :
                            <Button
                                className="btn-form"
                                variant="success"
                                type="submit">
                                Cadastrar
                            </Button>
                        }
                    </Col>
                </Row>
            </Form>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Nome</th>
                    <th>Role</th>
                    <th>
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody>
                {userList.map((user : User) => {
                    return (
                        <tr>
                            <td>{user.id?.toString()}</td>
                            <td>{user.username}</td>
                            <td>{user.userRoles[0].name}</td>
                            <td>
                                {isAdmin() ?
                                    <div>
                                        <Button variant="warning" className="btn-table"  onClick={() => {
                                             setIsEdit(true)
                                             loadUserEdit(user)
                                        }}>Editar</Button>
                                        <Button variant="danger" className="btn-table" onClick={ () => user.id != null ? handleConfirm(user.id) : null}>Excluir</Button>
                                    </div> : null
                                }
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
        </div>
    )
}

export default Users;