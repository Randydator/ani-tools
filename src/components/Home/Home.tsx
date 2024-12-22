import './home.css';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="homeBody">
            <Link to="/AniLike" className="p-0 border-0 text-decoration-none">
                <Card>
                    <Card.Body>
                        <Card.Title>AniLike</Card.Title>
                        <Card.Text>
                            A tool designed to view and like notifications in an easier way.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Link>


            <Link to="/ActivitySearch" className="p-0 border-0 text-decoration-none">
                <Card>
                    <Card.Body>
                        <Card.Title>Activity Search</Card.Title>
                        <Card.Text>
                            Find all activities of a anime or manga.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Link>
        </div>
    );
}
export default Home;
