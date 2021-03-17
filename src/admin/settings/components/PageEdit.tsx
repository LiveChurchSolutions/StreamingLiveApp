import React from "react";
import { FormGroup } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { PageInterface, ApiHelper, InputBox, UniqueIdHelper } from "./"


interface Props { page: PageInterface, updatedFunction: () => void }

export const PageEdit: React.FC<Props> = (props) => {
    const [page, setPage] = React.useState<PageInterface>(null);
    const [editorState, setEditorState] = React.useState<EditorState>(EditorState.createEmpty());

    const handleDelete = () => {
        if (window.confirm("Are you sure you wish to permanently delete this page?")) {
            ApiHelper.delete("/pages/" + page.id, "StreamingLiveApi").then(() => { setPage(null); props.updatedFunction(); });
        }
    }
    const checkDelete = () => { if (!UniqueIdHelper.isMissing(page?.id)) return handleDelete; else return null; }
    const handleCancel = () => { props.updatedFunction(); }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const val = e.currentTarget.value;
        var p = { ...page };
        switch (e.currentTarget.name) {
            case "name": p.name = val; break;
            //case "type": t.tabType = val; break;
            //case "page": t.tabData = val; break;
            //case "url": t.url = val; break;
        }
        setPage(p);
    }

    const handleSave = () => {
        var content = editorState.getCurrentContent();
        page.content = draftToHtml(convertToRaw(content));

        ApiHelper.post("/pages/write/", page, "StreamingLiveApi").then(page => {
            ApiHelper.post("/pages", [page], "StreamingLiveApi").then(props.updatedFunction);
            props.updatedFunction();
        })
    }

    const handleEditorChange = (e: EditorState) => {
        setEditorState(e);
    }

    const init = () => {
        setPage(props.page);
        const content = props.page?.content;
        if (content !== undefined && content !== null) {
            const draft = htmlToDraft(props.page?.content)
            setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(draft.contentBlocks)));
        }
        else setEditorState(EditorState.createWithContent(ContentState.createFromText("")));
    }

    React.useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.page]);

    return (
        <InputBox headerIcon="fas fa-code" headerText="Edit Page" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={checkDelete()} >
            <FormGroup>
                <label>Page Name</label>
                <input type="text" className="form-control" name="name" value={page?.name} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
                <label>Contents</label>
                <Editor editorState={editorState} onEditorStateChange={handleEditorChange} editorStyle={{ height: 400 }} />
            </FormGroup>
        </InputBox>
    );
}
