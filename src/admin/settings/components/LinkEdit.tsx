import React, { useState } from "react";
import { InputBox, LinkInterface, ApiHelper, ErrorMessages } from "."

interface Props { currentLink: LinkInterface, updatedFunction?: () => void }

export const LinkEdit: React.FC<Props> = (props) => {
  const [currentLink, setCurrentLink] = useState<LinkInterface>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleDelete = () => { ApiHelper.delete("/links/" + currentLink.id, "StreamingLiveApi").then(() => { setCurrentLink(null); props.updatedFunction(); }); }
  const checkDelete = currentLink?.id ? handleDelete : undefined;
  const handleCancel = () => { props.updatedFunction(); }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    let l = { ...currentLink };
    switch (e.currentTarget.name) {
      case "text": l.text = val; break;
      case "url": l.url = val; break;
    }
    setCurrentLink(l);
  }

  const handleSave = () => {
    let errors: string[] = [];
    if (!currentLink.text.trim()) errors.push("Please enter valid text");
    if (!currentLink.url.trim()) errors.push("Please enter link");

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    ApiHelper.post("/links", [currentLink], "StreamingLiveApi").then(() => props.updatedFunction());
  }

  React.useEffect(() => { setCurrentLink(props.currentLink); }, [props.currentLink]);

  return (
    <InputBox headerIcon="fas fa-link" headerText="Edit Link" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={checkDelete}>
      <ErrorMessages errors={errors} />
      <div className="form-group">
        <label>Text</label>
        <input type="text" className="form-control" name="text" value={currentLink?.text} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Url</label>
        <input type="text" className="form-control" name="url" value={currentLink?.url} onChange={handleChange} />
      </div>
    </InputBox>
  );
}
