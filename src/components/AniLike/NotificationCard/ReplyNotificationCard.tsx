import DOMPurify from 'dompurify';
import { Card } from 'react-bootstrap';
import { ReplyNotificationCardProps } from '../anilikeInterfaces';
import { useState } from 'react';

import './notificationCard.css';

function ReplyNotificationCard({ notifications }: ReplyNotificationCardProps) {
    const sortedNotifications = notifications
        .filter((notification) => notification.activity !== null)
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((notification) => {
            const sanitizedUser = {
                name: DOMPurify.sanitize(notification.user.name),
                avatar: {
                    large: DOMPurify.sanitize(notification.user.avatar.large),
                },
            };

            const sanitizedActivity = {
                siteUrl: DOMPurify.sanitize(notification.activity.siteUrl),
            };

            return {
                user: sanitizedUser,
                activity: sanitizedActivity,
            };
        });

    const [notificationList, setNotifications] = useState(sortedNotifications);

    // IDEA: expand button next to name (where count normally is) 
    // when pressed, you can preview the activity text, maybe even comments??

    return (
        <div className='notificationDiv'>
            {notificationList.map(({ user, activity }, index) => (
                <Card key={index}
                    className="notificationCard"
                    onClick={() => {
                        window.open(activity.siteUrl, '_blank', 'noopener,noreferrer')
                        setNotifications(notificationList.filter((_, i) => i !== index))
                    }}
                >
                    <div className="cardBodyDiv">
                        <Card.Img
                            variant="top"
                            src={user.avatar.large}
                            className="cardImg"
                        />
                    </div>
                    <Card.Body>
                        <Card.Title className="cardTitle">
                            <p>{user.name}</p>
                        </Card.Title>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );


}

export default ReplyNotificationCard;

