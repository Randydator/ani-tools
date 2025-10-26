import { FormGroup, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaQuestionCircle } from "react-icons/fa";
import { UserContext } from "../../components/Header/UserContext";
import { useContext } from "react";

function UserNameInput() {
    const user = useContext(UserContext);
    return (
        <div>
            <FormGroup controlId="usernameInput">
                <div className="iconLabel">
                    <Form.Label>Username:</Form.Label>
                    <Form.Label style={{ flex: 1 }} />
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip>
                                Leaving this empty will search with your username.
                            </Tooltip>
                        }
                    >
                        <Form.Label>
                            <FaQuestionCircle className="icon" />
                        </Form.Label>
                    </OverlayTrigger>
                </div>

                <Form.Control name="username" type="text" placeholder={user?.username || ""} required={!user?.username} className="aniInput">
                </Form.Control>
            </FormGroup>
        </div>
    );
}

export default UserNameInput;