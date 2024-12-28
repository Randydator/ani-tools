import { useQuery } from "@tanstack/react-query"
import { fetchLikeActivities, fetchReplyActivities } from "./anilikeApi"
import LikeNotificationCard from "./NotificationCard/LikeNotificationCard";
import ReplyNotificationCard from "./NotificationCard/ReplyNotificationCard";
import { Col, Row } from "react-bootstrap";

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
    <>
      <Row className="justify-content-md-center">
        <Col xs={5} md={4} style={{ marginLeft: '2rem', marginRight: '0rem', padding: '0' }}>
          <h1>Like Notifications</h1>
          <LikeNotificationCard notifications={data.likeNotifications} />
        </Col>
        <Col xs={5} md={4} style={{ marginLeft: '1rem', padding: '0' }}>
          {/* Anilist has some api issues, I just wanna see here if I receive the correct amount*/}
          <h1>Reply Notifications{data.replyNotifications.length !== 50 ? ' (weird)' : ''}</h1>
          <ReplyNotificationCard notifications={data.replyNotifications} />
        </Col>
      </Row>
    </>
  )
}

export default AniLike