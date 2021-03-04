import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./UserContext"
import { Routing } from "./Routing";

const App: React.FC = () => {
    //const getHandler = () => { return (ApiHelper.jwt === "") ? <Unauthenticated /> : <Authenticated />; }

    return (
        <UserProvider>
            <Router>
                <Routing />
            </Router>
        </UserProvider>
    );
}
export default App;

