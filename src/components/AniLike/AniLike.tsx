import { useQuery } from "@tanstack/react-query"
import { fetchUnreadNotificationCount } from "./anilikeApi"

function AniLike() {

  const { isLoading, error, data, } = useQuery({
    queryKey: ['likeNotifications'],
    queryFn: () => fetchUnreadNotificationCount(),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <h1 className="text-white text-center">Loading...</h1>
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  return (
    <div>
      <h1 className="text-white text-center">Unread Notifications: {data}</h1>
    </div>
  )
}

export default AniLike