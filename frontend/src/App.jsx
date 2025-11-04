import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage.jsx";
import CreatePost from "./pages/home/CreatePost.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import NotificationsPage from "./pages/notification/NotificationPage.jsx";
import EditProfileModal from "./pages/profile/EditProfileModal.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default App;
