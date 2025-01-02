import { fetchFromAnilist } from '../../utils/anilistRequestUtil';
import { unreadCountQuery, likeActivityQuery, allReplyNotificationsQuery } from '../../utils/anilistQueries';
import { LikeNotification, ReplyNotification } from './anilikeInterfaces';

const pageSize = 50 // Anilist maximum page size

export async function fetchUnreadNotificationCount() {
    const rawUnreadCount = await fetchFromAnilist(unreadCountQuery, {});
    return rawUnreadCount.User.unreadNotificationCount;
}

export async function fetchLikeActivities(notificationCount: number) {
    const pageCount = Math.ceil(notificationCount / 50)
    const requestArray = []

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        // If this is last request, find out how many perPage entries to get to match notificationCount
        const currentPageSize = (pageIndex === pageCount - 1) ? notificationCount % pageSize || pageSize : pageSize

        requestArray.push(fetchFromAnilist(likeActivityQuery, { page: pageIndex + 1, perPage: currentPageSize }))
    }
    const result = await Promise.all(requestArray)
    const resultArray: LikeNotification[] = result.flatMap((response) => response.Page.notifications);
      return resultArray;
}

export async function fetchReplyActivities(notificationCount: number) {
    const pageCount = Math.ceil(notificationCount / 50)
    const requestArray = []

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        // If this is last request, find out how many perPage entries to get to match notificationCount
        const currentPageSize = (pageIndex === pageCount - 1) ? notificationCount % pageSize || pageSize : pageSize

        requestArray.push(fetchFromAnilist(allReplyNotificationsQuery, { page: pageIndex + 1, perPage: currentPageSize }))
    }

    const result = await Promise.all(requestArray)
    const resultArray: ReplyNotification[] = result.flatMap((response) => response.Page.notifications);
    return resultArray;
}