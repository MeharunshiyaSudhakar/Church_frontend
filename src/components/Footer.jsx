import "./Footer.css";
import { FaFacebookF, FaWhatsapp, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div>
          <h3>Grace Community Church</h3>
          <p>Building faith, love & hope together in Christ.</p>
        </div>

        <div>
          <h3>Contact</h3>
          <p><FaMapMarkerAlt /> 123 Faith Avenue, Hope City</p>
          <p><FaPhone /> (123) 456-7890</p>
          <p><FaEnvelope /> info@gracecommunity.org</p>
          
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaWhatsapp /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Grace Community Church | All Rights Reserved</p>
      </div>
    </footer>
  );
}
