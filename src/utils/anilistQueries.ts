export const unreadCountQuery = `
query {
    User(name: "Rindidator") {
        unreadNotificationCount
	}
}
`

export const queryTest = `
query {
  Media(id: 1) {
    id
  }
}
`

export const likeActivityQuery = `
query ($page: Int, $perPage: Int)
{
    Page(page: $page, perPage: $perPage)
    {
        notifications(type: ACTIVITY_LIKE)
        {
            ...on ActivityLikeNotification
            {
                user
                {	
                    name, siteUrl, avatar{large}					
                }
            }
        }
    }
}
`;

export const replyActivityQuery = `
query ($page: Int, $perPage: Int)
{
	Page(page: $page, perPage: $perPage) {
		notifications(type: ACTIVITY_REPLY) {
			... on ActivityReplyNotification {
                createdAt,
				user {
					name
					siteUrl
					avatar {
						large
					}
				}, activity{ ...on TextActivity{siteUrl}, ...on ListActivity{siteUrl}, ...on MessageActivity{siteUrl}}
			}
		}
	}
}

`

export const subscribedActivityQuery = `
query ($page: Int, $perPage: Int)
{
	Page(page: $page, perPage: $perPage) {
		notifications(type: ACTIVITY_REPLY_SUBSCRIBED) {
			... on ActivityReplySubscribedNotification {
                createdAt,
				user {
					name
					siteUrl
					avatar {
						large
					}
				}
				activity {
					... on TextActivity {
						siteUrl
					}
					... on ListActivity {
						siteUrl
					}
					... on MessageActivity {
						siteUrl
					}
				}
			}
		}
	}
}

`

export const mentionActivityQuery = `
query ($page: Int, $perPage: Int)
{
	Page(page: $page, perPage: $perPage) {
		notifications(type: ACTIVITY_MENTION) {
			... on ActivityMentionNotification {
				createdAt,
				user {
					name
					siteUrl
					avatar {
						large
					}
				}
				activity {
					... on TextActivity {
						siteUrl
					}
					... on MessageActivity {
						siteUrl
					}
					... on ListActivity {
						siteUrl
					}
				}
			}
		}
	}
}
`

export const allReplyNotificationsQuery = `
query ($page: Int, $perPage: Int) {
  Page(perPage: $perPage, page: $page) {
    notifications(
      type_in: [ACTIVITY_REPLY, ACTIVITY_MENTION, ACTIVITY_REPLY_SUBSCRIBED]
    ) {
      ... on ActivityReplyNotification {
        user {
          name
          avatar {
            large
          }
        }
        activity {
          ... on TextActivity {
            siteUrl
          }
          ... on MessageActivity {
            siteUrl
          }
          ... on ListActivity {
            siteUrl
          }
        }
        createdAt
      }
      ... on ActivityMentionNotification {
        user {
          name
          avatar {
            large
          }
        }
        activity {
          ... on TextActivity {
            siteUrl
          }
          ... on MessageActivity {
            siteUrl
          }
          ... on ListActivity {
            siteUrl
          }
        }
        createdAt
      }
      ... on ActivityReplySubscribedNotification {
        user {
          name
          avatar {
            large
          }
        }
        activity {
          ... on TextActivity {
            siteUrl
          }
          ... on MessageActivity {
            siteUrl
          }
          ... on ListActivity {
            siteUrl
          }
        }
        createdAt
      }
    }
  }
}
`

export const querySearchMedia = `
query ($title: String, $type: MediaType)
{
  Media(search: $title, type:$type) {
    id
    title{
        english
        romaji
    }
  }

}
`

export const querySearchAnimeActivity = `
query ($userId: Int, $mediaId: Int)
{
    Page(perPage: 50) {
      activities(userId: $userId, mediaId: $mediaId, sort:ID) {
        ... on ListActivity {
          siteUrl
          createdAt
          status
          progress
        }
      }
    }
  }
  
`

export const querySearchUsername = `
query ($username: String)
{
  User(search: $username){
    id
    name
  }
}
`

export const getUsernameById = `
query ($userId: Int)
{
  User(id: $userId){
    id
    name
    siteUrl
    avatar {
      medium
    }
  }
}
`

export const querySearchMediaPreview = `
query ($searchTerm: String, $type: MediaType)
{
  Page (perPage: 20) {
    media (search:$searchTerm, type:$type) {
      title {
        userPreferred
      }
      id
      coverImage {
        medium
      }
      type
      episodes
      chapters
    }
  }
}
`

export const querySearchMediaPreviewUntyped = `
query ($searchTerm: String)
{
  Page (perPage: 20) {
    media (search:$searchTerm) {
      title {
        userPreferred
      }
      id
      coverImage {
        medium
      }
      type
      episodes
      chapters
    }
  }
}
`

export const queryMediaListEntryUserStats = `
query ($mediaId: Int, $userId: Int){
  MediaList(mediaId: $mediaId, userId: $userId) {
    private
    repeat
    progress
    status
    media {
      episodes
      chapters
    }
  }
}
`

export const mutationSaveMediaListEntry = `
mutation($mediaId: Int, $status: MediaListStatus, $progress: Int, $private: Boolean){
  SaveMediaListEntry(mediaId: $mediaId, status: $status, progress: $progress, private: $private) {
    status,
    repeat,
    mediaId,
    progress,
    private
  }
}
`
export const queryUserOptions = `
query ($userId: Int) {
  User(id: $userId){
    options{
      activityMergeTime
    }
  }
}
`

export const mutationUserOptions = `
mutation ($activityMergeTime:Int) {
  UpdateUser(
    activityMergeTime: $activityMergeTime
  ) {
    id
  }
}
`

export const mutationPrivateMediaEntry = `
mutation($mediaId: Int, $private: Boolean){
  SaveMediaListEntry(mediaId: $mediaId, private: $private) {
    status,
    repeat,
    mediaId,
    progress,
    private
  }
}
`