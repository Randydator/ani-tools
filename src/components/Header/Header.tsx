import './header.css';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { FaUser, FaRegTrashAlt } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';
import { login, clearCookies } from './authenticate';

function Header() {

    return <>
        <Container className='header'>
            <Row className="justify-content-md-center">
                <Col xs lg="2">
                    <Button variant="link" className="p-0 border-0 text-decoration-none login" onClick={clearCookies}>
                        <FaRegTrashAlt className="me-1" />
                        Clear all cookies
                    </Button>

                </Col>
                <Col span={8}>
                    <Link to={"/"} className='text-decoration-none'>
                        <h1 className='text'>AniTools</h1>
                    </Link>
                </Col>
                <Col xs lg="2">
                    <Button variant="link" className="p-0 border-0 text-decoration-none login" onClick={login}>
                        <FaUser className="me-1" />
                        Login
                    </Button>
                </Col>
            </Row>
        </Container>

        <main>
            <Outlet />
        </main>
    </>

}

export default Header;