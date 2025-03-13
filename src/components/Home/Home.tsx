import './home.css';
import { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { UserContext } from '../Header/UserContext';
import PreviewSearch from '../pageElements/previewSearch/previewSearch';
import { MediaPreview, MediaType } from '../../utils/anilistInterfaces';

function Home() {
    const user = useContext(UserContext)

    function log(item: MediaPreview) {
        console.log(item.id)
    }

    return (
        <div className="homeBody">
            <Link to="/AniLike" className="p-0 border-0 text-decoration-none" style={{pointerEvents: user?.token === undefined ? 'none' : 'auto', opacity: user?.token === undefined ? 0.5 : 1}}>
                <Card className='home-card'>
                    <Card.Body>
                        <Card.Title>AniLike{user?.token === undefined ? ' - LOGIN REQUIRED' : ''}</Card.Title>
                        <Card.Text>
                            A tool designed to view and like notifications in an easier way.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Link>

            <Link to="/ActivitySearch" className="p-0 border-0 text-decoration-none">
                <Card className='home-card'>
                    <Card.Body>
                        <Card.Title>Activity Search</Card.Title>
                        <Card.Text>
                            Find all activities of a anime or manga.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Link>

            <div style={{width: '30em'}}>
                <PreviewSearch type={MediaType.ANIME} onPreviewClicked={log}/>
            </div>
        </div>
    );
}
export default Home;
