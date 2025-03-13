export enum MediaType {
    MANGA = 'MANGA',
    ANIME = 'ANIME',
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
  