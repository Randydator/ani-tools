import './header.css';
import { useState, useEffect, useRef } from 'react';
import { Container, Button, Row, Col, Image, Dropdown } from 'react-bootstrap';
import { FaUser, FaGithub } from 'react-icons/fa';
import { Link, Outlet, useLocation } from 'react-router-dom';
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
    const location = useLocation();
    const [title, setTitle] = useState('AniTools');
    const [showDropdown, setShowDropdown] = useState(false);
    const hideTimeoutRef = useRef<number | null>(null);

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

    useEffect(() => {
        const pathname = location.pathname || '/';
        const getTitleFromPath = (p: string) => {
            if (p === '/' || p === '') return 'AniTools';
            if (p.startsWith('/AniLike')) return 'AniLike';
            if (p.startsWith('/ActivitySearch')) return 'Activity Search';
            if (p.startsWith('/OauthCallback') || p.startsWith('/oauthCallback')) return 'Callback';
            return 'AniTools';
        }
        setTitle(getTitleFromPath(pathname));
    }, [location]);

    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
                hideTimeoutRef.current = null;
            }
        };
    }, []);

    function clearCookies() {
        Object.keys(Cookies.get()).forEach(cookieName => {
            Cookies.remove(cookieName);
            setUser(emptyUser);
        });
    }

    return <>
        <Container fluid className='header'>
            <div className="header-flex">
                <div className="brand">
                    <Link to={"/"} className='text-decoration-none'>
                        <h1 className='text'>{title}</h1>
                    </Link>
                </div>

                <div className="actions d-flex align-items-center">
                    {user.username === undefined ? (
                        <Button variant="link" className="p-0 border-0 text-decoration-none login" onClick={login}>
                            <FaUser className="me-1" />
                            Login
                        </Button>
                    ) : (
                        // hoverable dropdown: we control show state so it opens on hover and stays open
                        <div
                            onMouseEnter={() => {
                                if (hideTimeoutRef.current) {
                                    clearTimeout(hideTimeoutRef.current);
                                    hideTimeoutRef.current = null;
                                }
                                setShowDropdown(true);
                            }}
                            onMouseLeave={() => {
                                if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
                                hideTimeoutRef.current = window.setTimeout(() => {
                                    setShowDropdown(false);
                                    hideTimeoutRef.current = null;
                                }, 250);
                            }}
                        >
                            <Dropdown align="end" show={showDropdown} onToggle={(nextShow) => setShowDropdown(nextShow)}>
                                <Dropdown.Toggle variant="link" className="p-0 border-0 avatar-toggle" id="avatar-dropdown" aria-haspopup="true" aria-expanded={showDropdown}>
                                    {user.avatar.medium ? (
                                        <Image src={user.avatar.medium} alt="Avatar" roundedCircle className='avatar' />
                                    ) : (
                                        <div className="avatar-fallback" aria-hidden="true"><FaUser /></div>
                                    )}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="header-dropdown-menu" onMouseEnter={() => {
                                    if (hideTimeoutRef.current) {
                                        clearTimeout(hideTimeoutRef.current);
                                        hideTimeoutRef.current = null;
                                    }
                                    setShowDropdown(true);
                                }} onMouseLeave={() => {
                                    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
                                    hideTimeoutRef.current = window.setTimeout(() => {
                                        setShowDropdown(false);
                                        hideTimeoutRef.current = null;
                                    }, 250);
                                }}>
                                    <Dropdown.Item href={user.siteUrl} target="_blank" rel="noopener noreferrer">Profile</Dropdown.Item>
                                    <Dropdown.Item onClick={clearCookies}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    )}
                </div>
            </div>
        </Container>

        <main>
            <UserContext.Provider value={user} >
                <Outlet />
            </ UserContext.Provider>
        </main>

        <a href="https://github.com/Randydator/ani-tools" target="_blank" rel="noopener noreferrer" className="github-fab" aria-label="ani-tools on GitHub" title="View project on GitHub">
            <FaGithub />
        </a>
    </>

}

export default Header;
