import axios from 'axios';
import Cookies from 'js-cookie';

export async function fetchFromAnilist(query: string, variables: object) {
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
                    // only send the access token if its cookie exists
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
                }
            }
        )
        .then(response => {
            return response.data.data;
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}
