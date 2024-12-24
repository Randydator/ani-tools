import axios from 'axios';
import Cookies from 'js-cookie';
import { unreadCountQuery } from './anilikeQueries';

async function fetchFromAnilist(query: string, variables: object) {
    const accessToken = Cookies.get('access_token');

    return axios
        .post(
            'https://graphql.anilist.co',
            {
                query: query,
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
            return response.data.data;
        });
}

export async function fetchUnreadNotificationCount() {
    const rawUnreadCount = await fetchFromAnilist(unreadCountQuery, {});
    return rawUnreadCount.User.unreadNotificationCount;
}
