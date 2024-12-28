import { useQuery } from "@tanstack/react-query"
import { fetchLikeActivities, fetchReplyActivities } from "./anilikeApi"
import LikeNotificationCard from "./NotificationCard/LikeNotificationCard";
import ReplyNotificationCard from "./NotificationCard/ReplyNotificationCard";
import { Col, Row } from "react-bootstrap";
import './anilike.css'

function AniLike() {

  const { isLoading, error, data, } = useQuery({
    queryKey: ['likeNotifications'],
    queryFn: async () => {
      const likeNotifications = await fetchLikeActivities(100)
      const replyNotifications = await fetchReplyActivities(50)
      return { likeNotifications, replyNotifications }
    },
    refetchOnWindowFocus: false,
    staleTime: 50000,
    retry: false
  });

  if (error) {
    return <div style={{ color: 'white' }}>Error: {JSON.stringify(error)}</div>
  }

  if (isLoading || data === undefined) {
    return <h1>Loading...</h1>
  }

  return (
    <div>
      <Row className="anilike-row">
        <Col className="anilike-col">
          <h1>Like Notifications</h1>
          <LikeNotificationCard notifications={data.likeNotifications} />
        </Col>
        <Col className="anilike-col">
         {/* Anilist has some api issues, I just wanna see here if I receive the correct amount*/}
          <h1>Reply Notifications{data.replyNotifications.length !== 50 ? ' (weird)' : ''}</h1>
          <ReplyNotificationCard notifications={data.replyNotifications} />
        </Col>
      </Row>
    </div>
  )
}

export default AniLike