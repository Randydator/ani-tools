import { useQuery } from "react-query"
import { fetchUnreadNotificationCount } from "./anilikeApi"

function AniLike() {

  const {
    status,
    error,
  } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: fetchUnreadNotificationCount,
  })

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'error') {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  return (
    <h1>AniLike</h1>


  )
}

export default AniLike