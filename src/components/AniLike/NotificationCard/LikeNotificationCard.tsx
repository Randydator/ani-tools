import DOMPurify from 'dompurify';
import { Card } from 'react-bootstrap';
import { LikeNotificationCardProps, ReplyNotificationCardProps, LikeNotification } from '../anilikeInterfaces';
import { useState } from 'react';

import './notificationCard.css';

function LikeNotificationCard({ notifications }: ReplyNotificationCardProps | LikeNotificationCardProps) {
    // Loop over notifications and add users to uniqueNotifications. If notification already exists in unique, increment count 
    const uniqueNotifications: { user: LikeNotification["user"]; count: number }[] = [];
    notifications.forEach((notification) => {
        const existing = uniqueNotifications.find((n) => n.user.name === notification.user.name);
        if (existing) {
            existing.count++;
        } else {
            uniqueNotifications.push({
                user: {
                    name: DOMPurify.sanitize(notification.user.name),
                    siteUrl: DOMPurify.sanitize(notification.user.siteUrl),
                    avatar: {
                        large: DOMPurify.sanitize(notification.user.avatar.large),
                    },
                },
                count: 1,
            });
        }
    });

    const [notificationList, setNotifications] = useState(uniqueNotifications);

    return (
        <div className='notificationDiv'>
            {notificationList.map(({ user, count }, index) => (
                <Card key={index}
                    className="notificationCard"
                    onClick={() => {
                        window.open(user.siteUrl, '_blank', 'noopener,noreferrer')
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
                            <p>{user.name} {(count)}</p>
                        </Card.Title>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );


}

export default LikeNotificationCard;

