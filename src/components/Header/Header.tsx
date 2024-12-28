import './header.css';
import { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { FaUser, FaRegTrashAlt } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';
import { login } from './authenticate';
import Cookies from 'js-cookie';
import { TokenContext } from './TokenContext';


function Header() {
    const [token, setToken] = useState(Cookies.get('access_token'));

    // Setting a cookie is asynchronous, so after the redirect, the cookie isn't set yet. 
    // useEffect here runs once after the component is mounted. By that time the cookie is set.
    useEffect(() => {
        const token = Cookies.get('access_token');
        setToken(token);
    }, []);

    function clearCookies() {
        Object.keys(Cookies.get()).forEach(cookieName => {
            Cookies.remove(cookieName);
            setToken(undefined);
        });
    }

    return <>
        <Container fluid className='header'>
            <Row className="justify-content-md-center">
                <Col xs={2}>
                    <div className="d-flex justify-content-center">
                        <Button variant="link" className="p-0 border-0 text-decoration-none login" onClick={clearCookies}>
                            <FaRegTrashAlt className="me-1" />
                            Clear cookies
                        </Button>
                    </div>
                </Col>
                <Col xs={8}>
                    <Link to={"/"} className='text-decoration-none'>
                        <h1 className='text'>AniTools</h1>
                    </Link>
                </Col>
                <Col xs={2}>
                    <div className="d-flex justify-content-center">
                        <Button variant="link" className="p-0 border-0 text-decoration-none login" onClick={login} disabled={token !== undefined}>
                            <FaUser className="me-1" />
                            Login
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>

        <main>
            <TokenContext.Provider value={token} >
                <Outlet />
            </ TokenContext.Provider>
        </main>
    </>

}

export default Header;
