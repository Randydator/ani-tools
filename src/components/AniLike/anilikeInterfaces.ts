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