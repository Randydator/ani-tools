export enum MediaType {
    MANGA = 'MANGA',
    ANIME = 'ANIME',
    BOTH = 'BOTH',
}

// search Activity
export interface ActivitySearchVariables {
    username: string,
    title: string,
    type: MediaType
}

export interface ActivityCardData {
    activities: {
        animeTitle: string;
        Page: {
            activities: ActivityCardEntries[];
        };
    };
}

export interface ActivityCardEntries {
    siteUrl: string;
    createdAt: number;
    status: string;
    progress: string;
}


// preview media search
export interface MediaPreview {
    id: number;
    title: {
        userPreferred: string;
    };
    coverImage: {
        medium: string;
    };
    type: string;
    episodes: number | null;
    chapters: number | null;
    progress: number | null;
}


// AniLike
export interface LikeNotification {
    user: {
        name: string;
        siteUrl: string;
        avatar: {
            large: string;
        };
    };
}

export interface ReplyNotification {
    createdAt: number;
    user: {
        name: string;
        siteUrl: string;
        avatar: {
            large: string;
        };
    },
    activity: {
        siteUrl: string;
    };
}

export interface LikeNotificationCardProps {
    notifications: LikeNotification[];
}
export interface ReplyNotificationCardProps {
    notifications: ReplyNotification[];
}

// Activity Creator
export enum MediaStatus {
    CURRENT = 'CURRENT',
    PLANNING = 'PLANNING',
    COMPLETED = 'COMPLETED',
    DROPPED = 'DROPPED',
    PAUSED = 'PAUSED',
    REPEATING = 'REPEATING',
}

export interface MediaEntry {
    mediaId: number;
    private: boolean;
    progress: number;
    status: MediaStatus;
}

export interface ActivityCreatorSearchVariables {
    title: string,
    status: MediaStatus,
    progress: number | string
    noMerge: Boolean
    type: MediaType
}


