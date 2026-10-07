import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Playroom from "./pages/Playroom.jsx";

import "./App.css";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/playroom"
                    element={<Playroom />}
                />

                <Route
                    path="*"
                    element={
                        <Navigate to="/login" />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;