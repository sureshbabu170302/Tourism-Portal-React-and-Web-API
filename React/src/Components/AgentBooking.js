import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import Spinner from 'react-spinkit';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export default function AgentBooking() {
    const [showMenu, setShowMenu] = useState(false);
    const [travelAgents, setTravelAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const decryptEmail = (encryptedEmail) => {
            const bytes = CryptoJS.AES.decrypt(encryptedEmail, 'your-secret-key');
            const decryptedEmail = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedEmail;
        };

        const fetchTravelAgents = async () => {
            const encryptedEmail = localStorage.getItem('encrypted_email');
            if (encryptedEmail) {
                const decryptedEmail = decryptEmail(encryptedEmail);

                try {
                    const response = await axios.get(`https://localhost:7234/api/TravelAgents/ByEmail?email=${decryptedEmail}`);
                    setTravelAgents(response.data);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error fetching travel agent data:', error);
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        fetchTravelAgents();
    });

    const toggleMenu = () => {
        setShowMenu((prevShowMenu) => !prevShowMenu);
    };

    return (
        <div>
            <header className="header" id="header">
                <nav className="nav container">
                    <Link to="/Home" className="nav__logo">
                        Tourism<span>Portal - Agent Panel</span>
                    </Link>

                    <div className={`nav__menu ${showMenu ? 'show-menu' : ''}`} id="nav-menu">
                        <ul className="nav__list">
                            <li className="nav__item">
                                <Link to="/Agent" className="nav__link active">
                                    Packages
                                </Link>
                            </li>
                            <li className="nav__item">
                                <Link to="/AgentBooking" className="nav__link">
                                    Bookings
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
                <section className="section tour container">
                    <h3 className="section-title"
                     style={{marginTop: "170px"}}>Bookings</h3>

                     <br></br>
                     <br></br>
                     
                     {isLoading ? (
            <div className="loading-spinner-container">
              <Spinner name="circle" fadeIn="none" className="loading-spinner" />
            </div>
          ) : (
            <div className="tour__container">
              {travelAgents.tourPackages.map((tourPackage) => (
                <div
                  key={tourPackage.tourPackage_Id}
                  className="tour__card"
                  style={{
                    position: 'relative',
                    width: '300px',
                    height: '400px',
                    overflow: 'hidden',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector('.tour__buttons').style.display = 'flex';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector('.tour__buttons').style.display = 'none';
                  }}
                >
                  {tourPackage.location_Image && (
                    <img
                      alt={tourPackage.tourPackage_Name}
                      className="tour__card-img"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s',
                      }}
                    />
                  )}
                  <div
                    className="tour__data"
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      padding: '16px',
                      width: '100%',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: '#fff',
                    }}
                  >
                    <h5
                      className="tour__data-title"
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                      }}
                    >
                      {tourPackage.tourPackage_Name}
                    </h5>
                    <span
                      className="tour__data-subtitle"
                      style={{ fontSize: '14px' }}
                    >
                      {tourPackage.tourPackage_PricePerDay} /Per Day
                    </span>
                    <br />
                    <span
                      className="tour__data-subtitle"
                      style={{ fontSize: '14px' }}
                    >
                      {tourPackage.tourPackage_Location}
                    </span>
                    <span
                      className="tour__data-subtitle"
                      style={{ fontSize: '14px' }}
                    >
                      {' - '}
                      {tourPackage.location_Speciality}
                    </span>
                    <div
                      className="tour__buttons"
                      style={{
                        display: 'none',
                        position: 'absolute',
                        bottom: '16px',
                        left: '0',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: '9999',
                      }}
                    >
                    </div>
                  </div>
                  <ToastContainer />
                </div>
              ))}
            </div>
          )}
                </section>
            </main>

        </div>
    )
}
