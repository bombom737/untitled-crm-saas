import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logOut } from '../services/axios-api';

interface Props {
  username: string;
}

const NavbarDarkExample: React.FC<Props> = ({ username }) => {
  const navigate = useNavigate();

  // Manage the dropdown state individually using an id
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  function showDropdown(id: string) {
    setOpenDropdown(id);
  }

  function hideDropdown() {
    setOpenDropdown(null);
  }


  async function handleLogOut() {
    const canLogOut = await logOut();
    if (canLogOut === true) {
      navigate('/')
    } else {
      console.log('Error logging out');
    }
  }
  


  return (
    <Navbar variant="dark" bg="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand>CRM-Saas</Navbar.Brand>
        <Navbar.Collapse id="navbar-dark-example">
          <Nav>
            <NavDropdown
              id="nav-dropdown-dark-example-1"
              title="Dashboard"
              menuVariant="dark"
              show={openDropdown === 'dashboard'}
              onMouseEnter={() => showDropdown('dashboard')}
              onMouseLeave={hideDropdown}
              onClick={() => {navigate('/dashboard')}}
            >
              <NavDropdown.Item>Action</NavDropdown.Item>
              <NavDropdown.Item>Another action</NavDropdown.Item>
              <NavDropdown.Item>Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavDropdown
              id="nav-dropdown-dark-example-2"
              title="Customers"
              menuVariant="dark"
              show={openDropdown === 'customers'}
              onMouseEnter={() => showDropdown('customers')}
              onMouseLeave={hideDropdown}
              onClick={() => {navigate('/customers')}}
            >
              <NavDropdown.Item>Action</NavDropdown.Item>
              <NavDropdown.Item>Another action</NavDropdown.Item>
              <NavDropdown.Item>Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavDropdown
              id="nav-dropdown-dark-example-3"
              title="Sales"
              menuVariant="dark"
              show={openDropdown === 'sales'}
              onMouseEnter={() => showDropdown('sales')}
              onMouseLeave={hideDropdown}
              onClick={() => {navigate('/sales')}}
            >
              <NavDropdown.Item>Action</NavDropdown.Item>
              <NavDropdown.Item>Another action</NavDropdown.Item>
              <NavDropdown.Item>Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavDropdown
              id="nav-dropdown-dark-example-4"
              title="Tasks"
              menuVariant="dark"
              show={openDropdown === 'tasks'}
              onMouseEnter={() => showDropdown('tasks')}
              onMouseLeave={hideDropdown}
              onClick={() => {navigate('/tasks')}}
            >
              <NavDropdown.Item>Action</NavDropdown.Item>
              <NavDropdown.Item>Another action</NavDropdown.Item>
              <NavDropdown.Item>Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavDropdown
              id="nav-dropdown-dark-example-5"
              title={`Hello ${username}`}
              menuVariant="dark"
              show={openDropdown === 'user'}
              onMouseEnter={() => showDropdown('user')}
              onMouseLeave={hideDropdown}
            >
              <NavDropdown.Item onClick={handleLogOut}>Log Out</NavDropdown.Item>
            </NavDropdown>
            <Navbar.Brand>FIX DROPDOWN</Navbar.Brand>
          </Nav>
          <button onClick={handleLogOut}></button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarDarkExample;
