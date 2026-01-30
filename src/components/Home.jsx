import "./Home.css";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  FaChurch,
  FaUsers,
  FaPray,
  FaBible,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
const [carouselItems, setCarouselItems] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/carousel")
    .then((res) => res.json())
    .then((data) => setCarouselItems(data))
    .catch(() => console.log("Failed to load carousel"));
}, []);

 const nextSlide = () => {
  if (carouselItems.length > 0) {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  }
};

const prevSlide = () => {
  if (carouselItems.length > 0) {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
  }
};

const [serviceTimes, setServiceTimes] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/service-times")
    .then((res) => res.json())
    .then((data) => setServiceTimes(data))
    .catch(() => console.log("Failed to load service times"));
}, []);


const [events, setEvents] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/events")
    .then((res) => res.json())
    .then((data) => setEvents(data));
}, []);


  return (
    <>
      <Header />

      <div className="home-container">

        {/* Hero Section */}
        <section className="hero">
          <img 
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80"
            alt="Church"
            className="hero-image"
          />
          <div className="hero-content">
            <h2>Welcome to Grace Community Church</h2>
            <p>Join us in worship and fellowship as we grow together in faith, hope, and love.</p>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="carousel-section">
          <div className="container">
            <h2 className="section-title">Weekly Updates & Announcements</h2>

            <div className="carousel-container">
              <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
                <FaChevronLeft />
              </button>

              <div className="carousel-track-container">
                <div
                  className="carousel-track"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {carouselItems.map((item) => (
                    <div className="carousel-slide" key={item.id}>
                      <div className="carousel-image-container">
                       <img src={item.image_url} alt={item.title} className="carousel-image" />
                        <div className="carousel-overlay"></div>
                      </div>
                      <div className="carousel-content">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
                <FaChevronRight />
              </button>

            </div>
          </div>
        </section>

       <section className="service-times">
  <div className="container">
    <h2 className="section-title">Service Times</h2>

    <div className="service-cards">

      {/* Always render what admin added */}
      {serviceTimes.map((item) => (
        <div className="service-card" key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.time}</p>
        </div>
      ))}

      {/* Only show these if NO admin items exist */}
      {serviceTimes.length === 0 && (
        <>
          <div className="service-card">
            <h3>Sunday Worship</h3>
            <p>9:00 AM & 11:00 AM</p>
          </div>
          <div className="service-card">
            <h3>Sunday School</h3>
            <p>10:00 AM</p>
          </div>
          <div className="service-card">
            <h3>Evening Service</h3>
            <p>6:00 PM</p>
          </div>
          <div className="service-card">
            <h3>Midweek Service</h3>
            <p>Wednesday 7:00 PM</p>
          </div>
        </>
      )}

    </div>
  </div>
</section>

        {/* Events Section */}
<section className="events">
  <div className="container">
    <h2 className="section-title">Upcoming Events</h2>

    <div className="events-container">
      {events.map((ev) => (
        <div className="event-card" key={ev.id}>
          <div className="event-date">
            <FaCalendarAlt />
            <span>{ev.date}</span>
          </div>

          <h3>{ev.title}</h3>

          <p className="event-description">
            {ev.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>



        {/* About Section */}
        <section id="about" className="about-section">
          <div className="container">
            <h2 className="section-title">About Us</h2>
            <p className="about-text">
              Grace Community Church is a place where people from all walks of life
              come together to worship God, grow in faith, and serve others.
            </p>
            <p className="about-text">
              Join us and be part of a loving family that grows together in Christ.
            </p>
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
}
