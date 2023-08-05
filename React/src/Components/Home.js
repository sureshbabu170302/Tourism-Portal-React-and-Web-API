import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import axios from 'axios';
import Bg from '../Assets/media/makemytrip.jpg';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-spinkit';

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [tourPackages, setTourPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const navToggle = document.getElementById('nav-toggle');
    navToggle.addEventListener('click', toggleMenu);

    window.addEventListener('resize', handleResize);

    return () => {
      navToggle.removeEventListener('click', toggleMenu);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/Cards');
  };

  const toggleMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  const handleResize = () => {
    setShowMenu(window.innerWidth > 768 ? true : false);
  };

  useEffect(() => {
    axios
      .get('https://localhost:7234/api/TourPackages/GetTop3TourPackagesWithMostBookings')
      .then((response) => {
        setTourPackages(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tour packages data:', error);
        setIsLoading(false);
      });
  }, []);

  const convertToImageURL = (byteData) => {
    const binaryData = atob(byteData);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryData.length; i++) {
      uintArray[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  };

  const handleCardClick = (tourPackageId) => {
    const encryptedId = btoa(tourPackageId);
    localStorage.setItem('TP_Id', encryptedId);
    navigate('/detail');
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

          <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
            <i className="bx bx-menu"></i>
          </div>
        </nav>
      </header>

      <main className="main" id="main">
        <section className="section hero" id="hero">
          <h1 className="hero__title">
            Explore the World <br />
            - Make My Trip
          </h1>

          <button className="button button-hero" onClick={handleGetStartedClick}>
            Get Started
          </button>
        </section>

        <section className="section about container">
          <div className="about__container">
            <img
              className="about__img"
              src={Bg}
              alt=""
            />

            <div className="about__data">
              <h3 className="about__data-title">What we Expertise</h3>
              <p className="about__data-description">
                We expertise in offering places to stay, villas and apartments, rail and bus tickets, cab service, and hotel booking services on its portal. In 2012, MakeMyTrip launched travel mobile applications for Windows Phone, iPhone, Android, and Blackberry devices. MakeMyTrip route planner provides all the basic required information on more than 10 lakh (1 million) routes in India. MakeMyTrip also offer metro train tickets for Hyderabad Metro.
              </p>
              <p className="about__data-description">
                With our holiday booking app, enjoy the best vacation experiences. Manage your bookings & enjoy exclusivity on flight tickets, hotel booking, holiday packages, etc. Make your travel plan now and explore the world.
              </p>
            </div>
          </div>
        </section>

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <section className="section tour container">
          <h3 className="section-title">Our Popular Packages</h3>
          {isLoading ? (
            <div className="loading-spinner-container">
              <Spinner name="circle" fadeIn="none" className="loading-spinner" />
            </div>
          ) : (
            <div className="tour__container">
              {tourPackages.map((tourPackage) => (
                <div
                  key={tourPackage.tourPackage_Id}
                  className="tour__card"
                  onClick={() => handleCardClick(tourPackage.tourPackage_Id)}
                >
                  {tourPackage.location_Image && (
                    <img
                      src={convertToImageURL(tourPackage.location_Image)}
                      alt={tourPackage.tourPackage_Name}
                      className="tour__card-img"
                    />
                  )}
                  <div className="tour__data">
                    <h5 className="tour__data-title">{tourPackage.tourPackage_Name}</h5><span className="tour__data-subtitle">{tourPackage.tourPackage_PricePerDay} /Per Day</span>
                    <br></br>
                    <span className="tour__data-subtitle">{tourPackage.tourPackage_Location}</span>
                    <span className="tour__data-subtitle"> - {tourPackage.location_Speciality}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
