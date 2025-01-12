import './activityCard.css'

import { Card } from 'react-bootstrap'

interface ActivityCardEntries {
    siteUrl: string;
    createdAt: number;
    status: string;
    progress: string;
}

function ActivityCard(activities: any) {
    // TODO: type any here is bad but I'm too lazy to do it properly right now
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
        <div>
            {activityList.map(({ siteUrl, progress, status }, index) => (
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
                </Card>
            ))}
        </div>
    );
}

export default ActivityCard