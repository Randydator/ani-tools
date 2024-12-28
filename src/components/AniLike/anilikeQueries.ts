export const unreadCountQuery = `
query {
    User(name: "Rindidator") {
        unreadNotificationCount
	}
}
`

export const testQuery = `
query {
  Media(id: 1) {
    id
    title {
      english
    }
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
      }
    }
  }
}
`

export const querySearchMedia = `
query ($page: String)
{
  Media(search: $page, type:ANIME) {
    id
    title{
        english
        romaji
    }
  }

}
`

export const querySearchAnimeActivity = `
query ($page: Int, $pageNumber: Int)
{
    Page(perPage: 50) {
      activities(userId: $page, mediaId: $pageNumber) {
        ... on ListActivity {
          id
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
query ($page: String)
{
  User(search: $page){
    id
  }
}
`