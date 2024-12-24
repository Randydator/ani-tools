import './header.css';
import { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { FaUser, FaRegTrashAlt } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';
import { login } from './authenticate';
import Cookies from 'js-cookie';


function Header() {
    const [token, setToken] = useState(Cookies.get('access_token'));

    // Setting a cookie is asynchronous, so after the redirect, the cookie isn't set yet. 
    // useEffect here runs once after the component is mounted. By that time the cookie is set.
    useEffect(() => {
        const token = Cookies.get('access_token');
        setToken(token);
    }, []);

    // Figure out Context so multiple parts of the app can check if access token is there. 
    // also needed in home bcs aniLike dies without access token 

    function clearCookies() {
        Object.keys(Cookies.get()).forEach(cookieName => {
            Cookies.remove(cookieName);
            setToken(undefined);
        });
    }

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
                    <Button variant="link" className="p-0 border-0 text-decoration-none login" onClick={login} disabled={token !== undefined}>
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
