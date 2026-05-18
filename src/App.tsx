import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";


function App() {

  return (
    <BrowserRouter>
      <MainLayout>   
          <Routes>
            // Public routes
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/register" element={<RegisterPage/>}/>
              <Route path="/" element={<HomePage/>} />
            </Route>

            // Protected routes
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            
          </Routes>
        </MainLayout>
    </BrowserRouter>
  );
}

export default App
