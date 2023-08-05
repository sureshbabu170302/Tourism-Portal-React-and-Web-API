import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Detail.css';
import axios from 'axios';

export default function Detail() {
  const [showMenu, setShowMenu] = useState(false);
  const [tourPackage, setTourPackage] = useState(null);

  useEffect(() => {
    const navToggle = document.getElementById('nav-toggle');
    navToggle.addEventListener('click', toggleMenu);

    const encryptedTP_Id = localStorage.getItem('TP_Id');
    const decryptedTP_Id = atob(encryptedTP_Id);

    axios.get(`https://localhost:7234/api/TourPackages/${decryptedTP_Id}`)
      .then((response) => {
        setTourPackage(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tour package details:', error);
      });

    return () => {
      navToggle.removeEventListener('click', toggleMenu);
    };
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

      <main className="container" style={{ marginTop: "120px" }}>
        <section className="detail">
          {tourPackage && (
            <div className="detail__card card">
              <div className="detail__card-title">
                <h4 style={{ fontSize: '24px' }}><b>{tourPackage.tourPackage_Name}</b></h4>
                <h5 style={{ fontSize: '20px' }}>Rs. {tourPackage.tourPackage_PricePerDay}/Day</h5>
                <h4 style={{ fontSize: '24px', whiteSpace: 'nowrap', display: 'block' }}><b>Speciality: {tourPackage.location_Speciality}</b></h4>
                <h4 style={{ fontSize: '24px', whiteSpace: 'nowrap', display: 'block' }}><b>Hotel Name: {tourPackage.tourPackage_HotelName}</b></h4>
                <h4 style={{ fontSize: '24px', whiteSpace: 'nowrap', display: 'block' }}><b>Spots Nearby: {tourPackage.spots_Nearby}</b></h4>
              </div>
              <br></br>
              <img
                src={convertToImageURL(tourPackage.location_Image)}
                alt={tourPackage.tourPackage_Name}
                className="detail__card-img"
              />
              <div className="detail__card-title">

              </div>
              <br></br>
              <div className="detail__card-title">
              </div>
              <div className="detail__card-img-list">
                <img
                  src={convertToImageURL(tourPackage.hotel_Image)}
                  alt={tourPackage.tourPackage_HotelName}
                  className="detail__card-img"
                />
              </div>
              <div className="detail__card-data">
                <div className="detail__card-title">
                </div>
                <p className="detail__card-description">
                  {tourPackage.tourPackage_Description}
                </p>
              </div>
            </div>
          )}
          <div className="detail__form card">
            <h4 className="detail__form-title">Book Now</h4>
            <form action="">
              <div className="form__group">
                <input
                  className="form__group-input"
                  type="text"
                  placeholder="Enter Number Of Days"
                />
              </div>
              <div className="form__group">
                <input
                  className="form__group-input"
                  type="email"
                  placeholder="Enter the Trip Date"
                />
              </div>
              <div className="form__group">
                <button className="button button-detail">Submit</button>
              </div>
            </form>
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
