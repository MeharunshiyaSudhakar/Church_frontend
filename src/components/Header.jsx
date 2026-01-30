import "./Header.css";
import { useState } from "react";
import SubscriptionsPopup from "./SubscriptionsPopup"; // 👉 Import popup

import { 
  FaChurch, FaFacebookF, FaWhatsapp, FaInstagram, FaYoutube 
} from "react-icons/fa";

export default function Header() {

  const [subOpen, setSubOpen] = useState(false); // 👉 Popup state

  return (
    <>
      <header className="header">
        <div className="container header-container">

          <div className="logo-section">
            <div className="logo"><FaChurch /></div>
            <div className="church-name">
              <h1>Grace Community Church</h1>
              <p>A Place of Worship & Community</p>
            </div>
          </div>

          <nav>
            <ul className="nav-menu">
              <li><a href="/">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="/mission">Mission</a></li>
              <li><a href="/children">Children’s Ministry</a></li>
              <li><a href="/messages">Messages</a></li>

              {/* ⭐ Subscriptions Button */}
              <li>
                <button 
                  className="subscribe-btn-nav"
                  onClick={() => setSubOpen(true)}
                >
                  Subscriptions
                </button>
              </li>
            </ul>
          </nav>

          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaWhatsapp /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
          </div>

        </div>
      </header>

      {/* ⭐ Subscriptions Popup Modal */}
      <SubscriptionsPopup isOpen={subOpen} onClose={() => setSubOpen(false)} />
    </>
  );
}
