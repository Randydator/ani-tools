import './header.css';
import { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { FaUser, FaRegTrashAlt } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';
import { login } from './authenticate';
import Cookies from 'js-cookie';


function Header() {
    const [loginAvailable, setLoginAvailable] = useState(false);

    function clearCookies() {
        console.log(Cookies.get());
        Object.keys(Cookies.get()).forEach(cookieName => {
            console.log(`Deleting cookie`);
            Cookies.remove(cookieName); // Remove cookie
        });
    }

    useEffect(() => {
        const token = Cookies.get('access_token');
        if (token) {
          setLoginAvailable(true);
        } else {
          setLoginAvailable(false);
        }
      }, [Cookies.get('access_token')]);

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
                    <Button variant="link" className="p-0 border-0 text-decoration-none login" onClick={login} disabled={loginAvailable}>
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
