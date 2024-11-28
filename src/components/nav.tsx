import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "./nav.css"
import {useEffect, useState} from "react";
import {Session} from "../model/Session.ts";
import SessionService from "../service/SessionService.ts";
import {useNavigate} from "react-router-dom";

function NavbarCustom(){
  const [session, setSession] = useState<Session>();
  const sessionService: SessionService = new SessionService();
  const navigate = useNavigate();

  function getSession(){
    sessionService.getSession()
        .then(response => {
          setSession(response.data);
        }).catch(error => {
          console.error(error);
          navigate('/');
    });
  }

  useEffect(() => {
    getSession()
  }, [])

  return (
    <Navbar expand="lg" className="bg-body-tertiary nav-custom" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/home">Sistema de Biblioteca</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/rental">Livros</Nav.Link>
            {session != undefined ? session.user.userRoles
                .filter((role) => role.name === "Admin")
                .map((role, index) => (
                    <Nav.Link key={index} href="/administrador">Admin</Nav.Link>
                )) : null
            }
          </Nav>
        </Navbar.Collapse>
        {
          session != undefined ?
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                  Logado como: <a href="/">{session.user.username}</a>
                </Navbar.Text>
              </Navbar.Collapse>
              : null
        }
      </Container>
    </Navbar>
  );
}

export default NavbarCustom;