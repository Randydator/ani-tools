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
      const replyNotifications = await fetchReplyActivities(15)
      return { likeNotifications, replyNotifications }
    },
    refetchOnWindowFocus: false,
    staleTime: 50000 
  });

  if (isLoading || data === undefined) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  return (
    <>
      <Row className="justify-content-md-center">
        <Col md={4}>
          <h1>Like Notifications</h1>
          <LikeNotificationCard notifications={data.likeNotifications} />
        </Col>
        <Col md={4}>
          <h1>Reply Notifications</h1>
          <ReplyNotificationCard notifications={data.replyNotifications} />
        </Col>
      </Row>
    </>
  )
}

export default AniLike