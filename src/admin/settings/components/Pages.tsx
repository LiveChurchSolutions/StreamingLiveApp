import React from "react";
import { PageList, PageEdit, ApiHelper, PageInterface, UserHelper } from "./"

export const Pages: React.FC = () => {
    const [pages, setPages] = React.useState<PageInterface[]>([]);
    const [currentPage, setCurrentPage] = React.useState<PageInterface>(null);

    const loadData = () => { ApiHelper.get("/pages", "StreamingLiveApi").then(data => setPages(data)); }
    const loadPage = (id: string) => { ApiHelper.get("/pages/" + id, "StreamingLiveApi").then(data => setCurrentPage(data)); }
    const handleUpdate = () => { setCurrentPage(null); loadData(); }
    const handleAdd = () => { setCurrentPage({ churchId: UserHelper.currentChurch.id, lastModified: new Date(), name: "" }) }
    const handleEdit = (page: PageInterface) => { loadPage(page.id); }

    React.useEffect(() => { loadData(); }, []);

    const getContent = () => {
        if (currentPage !== null) return <PageEdit page={currentPage} updatedFunction={handleUpdate} />;
        else return <PageList pages={pages} addFunction={handleAdd} editFunction={handleEdit} />
    }

    return (<>{getContent()}</>);
}
