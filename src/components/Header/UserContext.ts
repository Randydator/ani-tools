import { createContext } from 'react';

export interface User {
    username: string | undefined;
    id: number | undefined;
    token: string | undefined;
    siteUrl: string | undefined;
    avatar: {
        medium: string | undefined;
    };

}

export const UserContext = createContext<User | undefined>(undefined);