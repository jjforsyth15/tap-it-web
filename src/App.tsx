import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import ActivateCardPage from "./pages/ActivateCardPage";
import PublicCardPage from "./pages/PublicCardPage";
import ProfileManagementPage from "./pages/ProfileManagementPage";
import CreateProfilePage from "./pages/CreateProfilePage";
import PublicLayout from "./layouts/PublicLayout";


function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route element={<PublicLayout />}>
          <Route path="/public/:profileId" element={<PublicProfilePage />} />
          <Route path="/cards/:card_code" element={<PublicCardPage />} />
        </Route>

      <Route element={<MainLayout />}>   
            {/* // Public Only routes */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/register" element={<RegisterPage/>}/>
              <Route path="/" element={<HomePage/>} />
            </Route>

            <Route path="/activate-card/:cardCode" element={<ActivateCardPage />} />

            {/* // Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/profiles/:profileId" element={<ProfileManagementPage />} />
              <Route path="/profiles/new" element={<CreateProfilePage />} />
            </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
