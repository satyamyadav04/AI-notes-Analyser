import { Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import NotesAnalysisPage from "./pages/NotesAnalysisPage";
import ChatWithNotesPage from "./pages/ChatWithNotesPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes/:id"
        element={
          <ProtectedRoute>
            <NotesAnalysisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes/:id/chat"
        element={
          <ProtectedRoute>
            <ChatWithNotesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Route>
  </Routes>
);

export default App;
