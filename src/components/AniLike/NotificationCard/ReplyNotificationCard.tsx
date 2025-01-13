import DOMPurify from 'dompurify';
import { Card } from 'react-bootstrap';
import { ReplyNotificationCardProps } from '../anilikeInterfaces';
import { useState } from 'react';

import './notificationCard.css';


function removeDuplicateNotications(notifications: any[]) {
    // input is sorted by createdAt. Loop through and compare back to back notifications for same createdAt, siteUrl and username
    const uniqueNotifications = [...notifications];
    for (let i = 0; i < uniqueNotifications.length - 1; i++) {
        const currActivity = uniqueNotifications[i];
        const nextActivity = uniqueNotifications[i + 1];
        if (currActivity.createdAt === nextActivity.createdAt
            && currActivity.activity.siteUrl === nextActivity.activity.siteUrl
            && currActivity.user.username === nextActivity.user.username) 
            {
            uniqueNotifications.splice(i, 1);
        }
    }
    return uniqueNotifications;
}

// TODO: Reply and mention causes duplicate notifications; make them unique
function ReplyNotificationCard({ notifications }: ReplyNotificationCardProps) {
    const sortedNotifications = notifications
        .filter((notification) => notification.activity !== null)
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

            const sanatizedCreatedAt = DOMPurify.sanitize(notification.createdAt.toString());

            return {
                user: sanitizedUser,
                activity: sanitizedActivity,
                createdAt: sanatizedCreatedAt
            };
        });
    
    // if somebody e.g. mentions you in a reply, it would show up as 2 different notification types
    const uniqueNotifications = removeDuplicateNotications(sortedNotifications);

    const [notificationList, setNotifications] = useState(uniqueNotifications);

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

