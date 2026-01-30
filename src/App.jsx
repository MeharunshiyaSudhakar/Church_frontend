import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./components/Home";
import Mission from "./pages/Mission";
import ChildrenMinistry from "./pages/ChildrenMinistry";
import SubscriptionsPopup from "./components/SubscriptionsPopup";
// Admin content pages
import AdminCarousel from "./pages/admin/AdminCarousel";
import AdminServiceTimes from "./pages/admin/AdminServiceTimes";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMission from "./pages/admin/AdminMission";
import AdminChildren from "./pages/admin/AdminChildren";
import AdminChildrenFolders from "./pages/admin/AdminChildrenFolders";
import ChildrenFolder from "./pages/ChildrenFolder";
import Messages from "./pages/Messages";
import MessageFolder from "./pages/MessageFolder";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";




export default function App() {
  const [subOpen, setSubOpen] = useState(false);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home openSubscriptions={() => setSubOpen(true)} />} />
          <Route path="/mission" element={<Mission openSubscriptions={() => setSubOpen(true)} />} />
          <Route path="/children" element={<ChildrenMinistry openSubscriptions={() => setSubOpen(true)} />} />
            {/* Admin contaent editors */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/carousel" element={<AdminCarousel />} />
        <Route path="/admin/service-times" element={<AdminServiceTimes />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/mission" element={<AdminMission />} />
        <Route path="/admin/children" element={<AdminChildren />} />
        <Route path="/admin/children-folders" element={<AdminChildrenFolders />} />
        <Route path="/children/folder/:id" element={<ChildrenFolder />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messagefolder" element={<MessageFolder />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
        </Routes>
      </Router>

      {/* Subscriptions Popup Global */}
      <SubscriptionsPopup 
        isOpen={subOpen} 
        onClose={() => setSubOpen(false)} 
      />
    </>
  );
}
