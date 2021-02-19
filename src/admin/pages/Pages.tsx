import React from "react";
import { Row, Col } from "react-bootstrap"
import { PageList, PageEdit, ApiHelper, PageInterface, UserHelper, Header } from "./components"

export const Pages = () => {
    const [pages, setPages] = React.useState<PageInterface[]>([]);
    const [currentPage, setCurrentPage] = React.useState<PageInterface>(null);

    const loadData = () => { ApiHelper.get("/pages", "StreamingLiveApi").then(data => setPages(data)); }
    const loadPage = (id: string) => { ApiHelper.get("/pages/" + id + "?include=content", "StreamingLiveApi").then(data => setCurrentPage(data)); }
    const handleUpdate = () => { setCurrentPage(null); loadData(); }
    const handleAdd = () => { setCurrentPage({ churchId: UserHelper.currentChurch.id, lastModified: new Date(), name: "" }) }
    const handleEdit = (page: PageInterface) => { loadPage(page.id); }

    React.useEffect(() => { loadData(); }, []);

    const getEdit = () => {
        if (currentPage !== null) return <PageEdit page={currentPage} updatedFunction={handleUpdate} />;
    }

    return (
        <>
            <Header />
            <div className="container">
                <Row style={{ marginBottom: 25 }}>
                    <div className="col"><h1 style={{ borderBottom: 0, marginBottom: 0 }}><i className="fas fa-code"></i> Pages</h1></div>
                </Row>
                <Row>
                    <Col md={8}>
                        <PageList pages={pages} addFunction={handleAdd} editFunction={handleEdit} />
                    </Col>
                    <Col md={4}>
                        {getEdit()}
                    </Col>
                </Row>
            </div>
        </>
    );
}
