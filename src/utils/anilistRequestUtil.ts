import axios from 'axios';
import Cookies from 'js-cookie';
import { queryTest } from './anilistQueries';

// TODO: rename function from fetch to query. Also make change file name :&
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

export async function fetchAniListRemainingRequestLimit(): Promise<number> {
    const accessToken = Cookies.get('access_token');
    return axios
        .post(
            'https://graphql.anilist.co',
            {
                query: queryTest,
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
            return response.headers['x-ratelimit-remaining'];
        })
        .catch(error => {
            console.error(error);
            throw error;
        });

}
