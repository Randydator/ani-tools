import { useQuery } from "@tanstack/react-query"
import { fetchLikeActivities } from "./anilikeApi"
import NotificationCard from "./NotificationCard";
import { Col, Row } from "react-bootstrap";

export interface Notification {
  user: {
      name: string;
      siteUrl: string;
      avatar: {
          large: string;
      };
  };
}

export interface NotificationCardProps {
  notifications: Notification[];
}


function AniLike() {

  const { isLoading, error, data, } = useQuery({
    queryKey: ['likeNotifications'],
    queryFn: async () => {
      const a = await fetchLikeActivities(100)
      return a
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading || data === undefined) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  return (
    <Row className="justify-content-md-center">
      <Col md={4}>
        <h1>Like Notifications</h1>
        <NotificationCard notifications={data} />
      </Col>
      <Col md={4}>
        <h1>Reply Notifications</h1>
        <NotificationCard notifications={data} />
      </Col>
    </Row>
  )
}

export default AniLike