import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import DOMPurify from 'dompurify';

function OauthCallback() {
    const navigate = useNavigate();
    const hasNavigated = useRef(false); // Ref to track navigation status

    useEffect(() => {
        if (hasNavigated.current) return; // Prevent multiple navigations

        // Extract the token from the URL fragment
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.slice(1)); // Remove the `#`
        const accessToken = params.get('access_token');

        if (accessToken) {
            const sanitizedAccessToken = DOMPurify.sanitize(accessToken);

            // Save the access token as a cookie
            Cookies.set('access_token', sanitizedAccessToken, { secure: true, sameSite: 'strict', expires: 7 });

            hasNavigated.current = true;
            navigate('/');
        } else {
            console.error('Access token not found in URL fragment');
        }
    }, []);

    return <p>Redirecting...</p>;
}

export default OauthCallback;
