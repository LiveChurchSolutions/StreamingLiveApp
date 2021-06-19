import React, { useState } from "react";
import { FormGroup } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { PageInterface, ApiHelper, InputBox, UniqueIdHelper, LinkInterface, ErrorMessages } from "./"
import { EnvironmentHelper } from "../../components";

interface Props { page: PageInterface, updatedFunction: () => void }

export const PageEdit: React.FC<Props> = (props) => {
  const [page, setPage] = useState<PageInterface>(null);
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
  const [errors, setErrors] = useState<string[]>([]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this page?")) {
      ApiHelper.delete("/pages/" + page.id, "StreamingLiveApi").then(() => { setPage(null); props.updatedFunction(); });
    }
  }
  const checkDelete = page?.id ? handleDelete : undefined;
  const handleCancel = () => { props.updatedFunction(); }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.currentTarget.value;
    let p = { ...page };
    switch (e.currentTarget.name) {
      case "name": p.name = val; break;
            //case "type": t.tabType = val; break;
            //case "page": t.tabData = val; break;
            //case "url": t.url = val; break;
    }
    setPage(p);
  }

  const handleSave = async () => {
    let errors: string[] = [];

    if (!page?.name) errors.push("Page must have a name");

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    let content = editorState.getCurrentContent();
    page.content = draftToHtml(convertToRaw(content));

    const pages: PageInterface[] = await ApiHelper.post("/pages", [page], "StreamingLiveApi");
    await updateTabs(EnvironmentHelper.ContentRoot + "/" + pages[0].path);
    props.updatedFunction();
  }

  const updateTabs = async (fullPath: string) => {
    const newPath = fullPath + "?ts=" + new Date().getTime().toString();
    const tabs = await ApiHelper.get("/links?category=tab", "StreamingLiveApi");
    tabs.forEach((t: LinkInterface) => {
      if (t.linkData === fullPath) {
        t.url = newPath;
        ApiHelper.post("/links", [t], "StreamingLiveApi");
      }
    });
  }

  const handleEditorChange = (e: EditorState) => {
    setEditorState(e);
  }

  const init = () => {
    setPage(props.page);

    if (UniqueIdHelper.isMissing(props.page.id)) setEditorState(EditorState.createWithContent(ContentState.createFromText("")));
    else {
      const path = `${EnvironmentHelper.ContentRoot}/${props.page.churchId}/pages/${props.page.id}.html`;
      console.log(path);
      fetch(path)
        .then(response => response.text())
        .then(content => {
          console.log(content);
          const draft = htmlToDraft(content)
          setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(draft.contentBlocks)));
        })
    }

  }

  React.useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.page]);

  return (
    <InputBox headerIcon="fas fa-code" headerText="Edit Page" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={checkDelete}>
      <FormGroup>
        <label>Page Name</label>
        <input type="text" className="form-control" name="name" value={page?.name} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <label>Contents</label>
        <Editor editorState={editorState} onEditorStateChange={handleEditorChange} editorStyle={{ height: 400 }} />
      </FormGroup>
      <ErrorMessages errors={errors} />
    </InputBox>
  );
}
