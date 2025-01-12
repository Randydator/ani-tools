import './header.css';
import { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Image } from 'react-bootstrap';
import { FaUser, FaRegTrashAlt } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';
import { login } from './authenticate';
import Cookies from 'js-cookie';
import { UserContext, User } from './UserContext';

import { fetchFromAnilist } from '../../utils/anilistRequestUtil';
import { getUsernameById } from '../../utils/anilistQueries';

function Header() {
    const emptyUser: User = {
        username: undefined,
        id: undefined,
        token: undefined,
        siteUrl: undefined,
        avatar: { medium: undefined },
    };
    // initialize as empty User, then runs useEffect again when cookie is there to set user
    const [user, setUser] = useState(emptyUser);

    // Setting a cookie is asynchronous, so after the redirect, the cookie isn't set yet. 
    // useEffect here runs once after the component is mounted. By that time the cookie is set.
    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get('access_token');

            // only get user query if a token exists
            if (token === undefined) return;

            const accessTokenDecoded = JSON.parse(atob(token.split('.')[1]))
            const loggedInUserId = accessTokenDecoded.sub

            const userQuery = await fetchFromAnilist(getUsernameById, { userId: loggedInUserId })
            const username = userQuery.User.name
            const siteUrl = userQuery.User.siteUrl
            const avatar = userQuery.User.avatar.medium

            const user: User = { username: username, id: loggedInUserId, token: token, siteUrl: siteUrl, avatar: { medium: avatar } };
            setUser(user)
        };

        fetchData();
    }, []);

    function clearCookies() {
        Object.keys(Cookies.get()).forEach(cookieName => {
            Cookies.remove(cookieName);
            setUser(emptyUser);
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
                        {user.username === undefined ?
                            <Button variant="link" className="p-0 border-0 text-decoration-none login" onClick={login}>
                                <FaUser className="me-1" />
                                Login
                            </Button>
                            :
                            <a href={user.siteUrl} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center">
                                <Image src={user.avatar.medium} alt="Avatar" roundedCircle className='avatar' />
                            </a>
                        }
                    </div>
                </Col>
            </Row>
        </Container>

        <main>
            <UserContext.Provider value={user} >
                <Outlet />
            </ UserContext.Provider>
        </main>
    </>

}

export default Header;
