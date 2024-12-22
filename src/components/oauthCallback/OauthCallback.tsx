import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import DOMPurify from 'dompurify';

function OauthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // Extract the token from the URL fragment
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.slice(1)); // Remove the `#`
        const accessToken = params.get('access_token');

        if (accessToken) {

            const sanitizezedAccessToken = DOMPurify.sanitize(accessToken);

            // Save the access token as a cookie
            Cookies.set('access_token', sanitizezedAccessToken, { secure: true, sameSite: 'strict', expires: 7});

            // Redirect to the index page
            navigate('/');
        } else {
            console.error('Access token not found in URL fragment');
        }
    }, [navigate]);

    return (
        <p>Redirecting....</p>
    )
}

export default OauthCallback