import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import AdminLayout from "./layouts/AdminLayout";

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
import AdminRoute from "./routes/AdminRoute";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminPlaceholderPage from "./components/admin/AdminPlaceholderPage";


function App() {

  return (
    <BrowserRouter>
      <Routes>

        {/* Public profile & card routes */}
        <Route element={<PublicLayout />}>
          <Route path="/public/:profileId" element={<PublicProfilePage />} />
          <Route path="/cards/:card_code" element={<PublicCardPage />} />
        </Route>

      {/* Standard application routes */}
      <Route element={<MainLayout />}>   
            {/* Public Only routes */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/register" element={<RegisterPage/>}/>
              <Route path="/" element={<HomePage/>} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/profiles/:profileId" element={<ProfileManagementPage />} />
              <Route path="/activate-card/:cardCode" element={<ActivateCardPage />} />
              <Route path="/profiles/new" element={<CreateProfilePage />} />
            </Route>

        </Route>
        {/* Admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />

                <Route path="users" element={<AdminPlaceholderPage title="Users" description="Manage TapIt user accounts and account status." />} />
                <Route path="profiles" element={<AdminPlaceholderPage title="Profiles" description="Manage TapIt user profiles." />} />
                <Route path="cards" element={<AdminPlaceholderPage title="Cards" description="Manage TapIt cards." />} />
                <Route path="feedback" element={<AdminPlaceholderPage title="Beta Feedback" description="Manage beta feedback submitted by users." />} />
                <Route path="card-requests" element={<AdminPlaceholderPage title="Card Requests" description="Manage card requests submitted by users." />} />
                <Route path="analytics" element={<AdminPlaceholderPage title="Analytics" description="View analytics and insights for the TapIt platform." />} />
                <Route path="system" element={<AdminPlaceholderPage title="System" description="Monitor and manage system health and settings." />} />
              </Route>
            </Route>
          </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App
