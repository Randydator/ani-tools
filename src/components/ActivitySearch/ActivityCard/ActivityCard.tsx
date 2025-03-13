import { ActivityCardData, ActivityCardEntries } from '../../../utils/anilistInterfaces'
import './activityCard.css'

import { Card } from 'react-bootstrap'

// TODO: Use userPreferred for title here as well

function ActivityCard(activities: ActivityCardData) {
    const animeTitle = activities.activities.animeTitle
    const activityList: ActivityCardEntries[] = activities.activities.Page.activities

    if (activityList.length === 0) {
        return (
            <Card className='activityCard'>
                <Card.Body>
                    <Card.Title>
                        <p>No activities found for media: {animeTitle}</p>
                    </Card.Title>
                </Card.Body>
            </Card>
        )
    }

    return (
        <div className='activityBox'>
            {activityList.map(({ siteUrl, progress, status, createdAt }, index) => (
                <Card key={index} className='activityCard'
                    onClick={() => {
                        window.open(siteUrl, '_blank', 'noopener,noreferrer');
                    }}
                >
                    <Card.Body>
                        <Card.Title>
                            <p>{progress ? status + ' ' + progress : status}</p>
                        </Card.Title>
                    </Card.Body>
                    <Card.Footer className='c-footer'>
                        <p>{new Date(createdAt * 1000).toLocaleString([], {hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit'})}</p>
                    </Card.Footer>
                </Card>
            ))}
        </div>
    );
}

export default ActivityCard