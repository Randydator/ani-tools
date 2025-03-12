export enum MediaType {
    MANGA = 'MANGA',
    ANIME = 'ANIME',
}

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