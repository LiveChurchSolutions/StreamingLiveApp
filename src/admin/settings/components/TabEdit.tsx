import React, { useState } from "react";
import { InputBox, LinkInterface, ApiHelper, PageInterface, EnvironmentHelper, ErrorMessages } from "."

interface Props { currentTab: LinkInterface, updatedFunction?: () => void }

export const TabEdit: React.FC<Props> = (props) => {
  const [currentTab, setCurrentTab] = useState<LinkInterface>(null);
  const [pages, setPages] = useState<PageInterface[]>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to delete this tab?")) {
      ApiHelper.delete("/links/" + currentTab.id, "StreamingLiveApi").then(() => { setCurrentTab(null); props.updatedFunction(); });
    }
  }

  const checkDelete = currentTab?.id ? handleDelete : undefined;
  const handleCancel = () => { props.updatedFunction(); }
  const loadPages = () => { ApiHelper.get("/pages/", "StreamingLiveApi").then((data: PageInterface[]) => setPages(data)) }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.currentTarget.value;
    let t = { ...currentTab };
    switch (e.currentTarget.name) {
      case "text": t.text = val; break;
      case "type": t.linkType = val; break;
      case "page": t.linkData = val; break;
      case "url": t.url = val; break;
    }
    setCurrentTab(t);
  }

  const handleSave = () => {
    let errors: string[] = [];

    if (!currentTab.text) errors.push("Please enter valid text");
    if (currentTab?.linkType === "page" && pages.length === 0) errors.push("No page! Please create one before adding it to tab");
    if (currentTab?.linkType === "url" && !currentTab.url) errors.push("Enter a valid URL");

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    if (currentTab.linkType === "page") currentTab.url = currentTab.linkData + "?ts=" + new Date().getTime().toString();
    else if (currentTab.linkType !== "url") currentTab.url = "";
    ApiHelper.post("/links", [currentTab], "StreamingLiveApi").then(props.updatedFunction);
  }

  const initIcon = (e: React.MouseEvent) => {
    e.preventDefault();
    let target: any = $(e.currentTarget);
    target.iconpicker()
      .on("change", (e: any) => {
        let t = { ...currentTab };
        t.icon = e.icon;
        setCurrentTab(t);
      });
    target.click();
  }

  const getUrl = () => {
    if (currentTab?.linkType === "url") {
      return (
        <div className="form-group">
          <label>Url</label>
          <input type="text" className="form-control" name="url" value={currentTab?.url} onChange={handleChange} />
        </div>
      );
    } else return null;
  }

  const getPage = () => {
    if (currentTab?.linkType === "page") {
      let options: JSX.Element[] = [];
      if (pages === null) loadPages();
      else {
        options = [];
        pages.forEach(page => options.push(<option value={EnvironmentHelper.ContentRoot + "/" + page.path} key={page.id}>{page.name}</option>));
        if (currentTab.linkData === "") currentTab.linkData = pages[0]?.path;
      }
      return (
        <div className="form-group">
          <label>Page</label>
          <select className="form-control" name="page" value={currentTab?.linkData} onChange={handleChange}>
            {options}
          </select>
        </div>
      );
    } else return null;
  }

  React.useEffect(() => { setCurrentTab(props.currentTab); }, [props.currentTab]);

  return (
    <InputBox headerIcon="fas fa-folder" headerText="Edit Tab" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={checkDelete}>
      <ErrorMessages errors={errors} />
      <div className="form-group">
        <label>Text</label>
        <div className="input-group">
          <input type="text" className="form-control" name="text" value={currentTab?.text} onChange={handleChange} />
          <div className="input-group-append">
            <button className="btn btn-secondary iconpicker dropdown-toggle" name="TabIcon" id="TabIcon" data-icon={currentTab?.icon} data-iconset="fontawesome5" onClick={initIcon}>
              <i className={currentTab?.icon}></i>
              <span className="caret"></span>
            </button>
          </div>
        </div>
        <input type="hidden" asp-for="TabId" />
      </div>
      <div className="form-group">
        <label>Type</label>
        <select className="form-control" name="type" value={currentTab?.linkType} onChange={handleChange}>
          <option value="url">External Url</option>
          <option value="page">Page</option>
          <option value="chat">Chat</option>
          <option value="prayer">Prayer</option>
        </select>
      </div>
      {getUrl()}
      {getPage()}
    </InputBox>
  );
}
