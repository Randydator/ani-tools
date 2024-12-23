import axios from 'axios';
import Cookies from 'js-cookie';
import { unreadCountQuery, testQuery } from './anilikeQueries';

export function fetchUnreadNotificationCount() {
    const variables = {
        // Something here at some point
    };

    const accessToken = Cookies.get('access_token');

    axios
        .post(
            'https://graphql.anilist.co',
            {
                query: unreadCountQuery,
                variables: variables
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        .then(response => {
            console.log(response.data);
            response.data;
        })
        .catch(error => {
            console.error('Error:', error.response ? error.response.data : error.message);
        });
}
