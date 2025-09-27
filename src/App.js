import "./App.css";
import ProtectedRoute from "./Component/protectedRoute";
import MUIRegistrationForm from "./Component/RegistrationForm";
import Registrationnipamform from "./Component/Registrationnipamform";
import Register from "./auth/Register";
import Login from "./auth/Login";
import AdminPage from "./Component/Tables/adminPage";
import Navbar from "./Component/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Eventlist from "./Component/Tables/Eventlist";
import Layout from "./Component/Tables/Layout";

function App() {
  return (
    <div>
      <Router>
        {/* ✅ Navbar fixed at top */}
        {/* <Navbar /> */}

        {/* ✅ Add padding so content doesn’t hide under navbar */}
        <div style={{ paddingTop: "5px" }}>
          <Routes>
            <Route path="/" element={<MUIRegistrationForm />} />
           
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route path="/register/:schoolmail" element={<MUIRegistrationForm />} />

            {/* Pledge List */}
  <Route
    path="/Eventlist"
    element={
      <ProtectedRoute>
        <Layout>
          <Eventlist />
        </Layout>
      </ProtectedRoute>
    }
  />

          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
