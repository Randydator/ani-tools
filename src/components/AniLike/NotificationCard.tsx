import DOMPurify from 'dompurify';
import { Card } from 'react-bootstrap';
import { NotificationCardProps, Notification } from './AniLike';
import React from 'react';

function NotificationCard({ notifications }: NotificationCardProps) {
    // Loop over notifications and add users to uniqueNotifications. If notification already exists in unique, increment count 
    const uniqueNotifications: { user: Notification["user"]; count: number }[] = [];
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

    const [notif, setNotifications] = React.useState(uniqueNotifications);

    return (
        <div className="d-flex flex-wrap justify-content-center">
            {notif.map(({ user, count }, index) => (
                <Card key={index}
                    className="m-2 text-decoration-none"
                    as="a" href={user.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '18rem' }}
                    onClick={() => setNotifications(notif.filter((n, i) => i !== index))}
                >
                    <div style={{ height: '20rem', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Card.Img
                            variant="top"
                            src={user.avatar.large}
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                        />
                    </div>
                    <Card.Body>
                        <Card.Title className="text-center">
                            <p>{user.name} ({count})</p>
                        </Card.Title>
                    </Card.Body>
                </Card>

            ))}
        </div>
    );


}

export default NotificationCard;

