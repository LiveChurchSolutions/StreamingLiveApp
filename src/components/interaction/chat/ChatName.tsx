import React from "react";
import { UserInterface, ApiHelper } from "../../../helpers";
import { Row, Col, InputGroup } from "react-bootstrap"

interface Props {
    user: UserInterface,
    updateFunction: (displayName: string) => void,
    promptName: boolean
}

export const ChatName: React.FC<Props> = (props) => {
  const [edit, setEdit] = React.useState(false);
  const [displayName, setDisplayName] = React.useState("");

  const editMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setEdit(true);
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.currentTarget.value);
  }

  const handleUpdate = (e: React.MouseEvent) => {
    e.preventDefault();
    if (displayName.trim() === "") {
      alert("Please enter a name");
      setDisplayName("");
      return;
    }
    if (ApiHelper.isAuthenticated) ApiHelper.post("/users/setDisplayName", { displayName: displayName.trim() }, "AccessApi");
    props.updateFunction(displayName);
    setEdit(false);
  }

  React.useEffect(() => { setEdit(props.promptName); }, [props.promptName]);

  if (!edit) return (<a href="about:blank" className="nav-link" onClick={editMode}>Change Name</a>);
  else return (
    <Row style={{ marginRight: 0 }}>
      <Col>
        <InputGroup size="sm">

          <input id="nameText" type="text" className="form-control form-control-sm" placeholder="Display name" value={displayName} onChange={handleChange} />
          <InputGroup.Append>
            <button id="setNameButton" className="btn btn-primary btn-sm" onClick={handleUpdate}>Update</button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
    </Row>

  );
}

