import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import aboutBgImage from '../Assets/media/bg-about.jpg';
import pexels from '../Assets/media/pexelsnew.jpg';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './About.css';
import './carousel.css';

export default function About() {
  const [showMenu, setShowMenu] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide index

  useEffect(() => {
    const navToggle = document.getElementById('nav-toggle');
    navToggle.addEventListener('click', toggleMenu);

    return () => {
      navToggle.removeEventListener('click', toggleMenu);
    };
  }, []);

  useEffect(() => {
    fetch('https://localhost:7108/api/Gallery')
      .then((response) => response.json())
      .then((data) => setGalleryImages(data))
      .catch((error) => console.error('Error fetching images:', error));
  }, []);

  const handleAutoPlay = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % galleryImages.length);
  };

  useEffect(() => {
    const interval = setInterval(handleAutoPlay, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [galleryImages]);

  const toggleMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  return (
    <>
      <header className="header" id="header">
        <nav className="nav container">
          <Link to="/Home" className="nav__logo">
            Tourism<span>Portal</span>
          </Link>

          <div className={`nav__search ${showMenu ? 'show-menu' : ''}`}>
            <input type="text" placeholder="Search" />
            <button type="button">Search</button>
          </div>

          <div className={`nav__menu ${showMenu ? 'show-menu' : ''}`} id="nav-menu">
            <ul className="nav__list">
              <li className="nav__item">
                <Link to="/Home" className="nav__link active">
                  Home
                </Link>
              </li>
              <li className="nav__item">
                <Link to="/Cards" className="nav__link">
                  Tour Packages
                </Link>
              </li>
              <li className="nav__item">
                <Link to="/about" className="nav__link">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="nav__toggle" id="nav-toggle">
            <i className="bx bx-menu"></i>
          </div>
        </nav>
      </header>

      <main className="main" id="main">
        <section
          className="section about-hero"
          style={{ backgroundImage: `url(${aboutBgImage})` }}
          id="hero"
        >
          <h1 className="hero__title">About Us</h1>
        </section>

        <section className="section about container">
          <div className="about__container">
            <img
              className="about__img"
              src={pexels}
              alt=""
            />

            <div className="about__data">
              <h3 className="about__data-title">Make My Trip since 2008</h3>
              <p className="about__data-description">
                MakeMyTrip is the super travel app to book hotels, flight tickets, buses, train tickets, etc. We are the largest online travel booking company catering to travelers for more than 2 decades.
              </p>
              <p className="about__data-description">
                With our holiday booking app, enjoy the best vacation experiences. Manage your bookings & enjoy exclusivity on flight tickets, hotel booking, holiday packages, etc. Make your travel plan now and explore the world.
              </p>
            </div>
          </div>
        </section>

        <br></br>
        <br></br>

        <section className="section about container">
          <div className="about__container">
            <center>
              <div className="carousel-container">
                <Carousel
                  autoPlay={false}
                  infiniteLoop
                  showThumbs={false}
                  stopOnHover={false}
                  selectedItem={currentSlide}
                >
                  {galleryImages.map((imageData) => (
                    <div key={imageData.image_Id}>
                      <img
                        className="about__img"
                        src={imageData.gallery_Image}
                        alt={`Image ${imageData.image_Id}`}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </center>
          </div>
        </section>
      </main>

      <footer className="footer">
        <h3 className="footer__title">Follow Us</h3>

        <div className="footer__social">
          <Link to="#" className="footer__social-link">
            <i className="bx bxl-facebook"></i>
          </Link>
          <Link to="#" className="footer__social-link">
            <i className="bx bxl-instagram"></i>
          </Link>
          <Link to="#" className="footer__social-link">
            <i className="bx bxl-tiktok"></i>
          </Link>
        </div>
      </footer>
    </>
  );
}
