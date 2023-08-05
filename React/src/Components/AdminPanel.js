import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminPanel.css';
import axios from 'axios';

export default function AdminPanel() {
    const [showMenu, setShowMenu] = useState(false);
    const [tourPackages, setTourPackages] = useState([]);
    const [tourPackages1, setTourPackages1] = useState([]);
    const [tourPackages2, setTourPackages2] = useState([]);

    const toggleMenu = () => {
        setShowMenu((prevShowMenu) => !prevShowMenu);
    };

    const fetchAllTourPackages = async () => {
        try {
            const response1 = await axios.get('https://localhost:7234/api/Administrators/UnapprovedTravelAgents');
            const response2 = await axios.get('https://localhost:7234/api/Administrators/ApprovedTravelAgents');
            const response3 = await axios.get('https://localhost:7234/api/Administrators/DeclinedTravelAgents');
            setTourPackages(response1.data);
            setTourPackages1(response2.data);
            setTourPackages2(response3.data);
        } catch (error) {
            console.error('Error fetching Agents data:', error);
        }
    };
    
    const handleApprove = async (id) => {
        try {
            await axios.put(`https://localhost:7234/api/Administrators/UpdateApprovalStatus/${id}`, "Approved", {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchAllTourPackages();
        } catch (error) {
            console.error('Error updating approval status:', error);
        }
    };
    
    const handleDecline = async (id) => {
        try {
            await axios.put(`https://localhost:7234/api/Administrators/UpdateApprovalStatus/${id}`, "Declined", {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchAllTourPackages();
        } catch (error) {
            console.error('Error updating approval status:', error);
        }
    };
    
    useEffect(() => {
        fetchAllTourPackages();
    }, []);
    
    return (
        <>
            <header className="header" id="header">
                <nav className="nav container">
                    <Link to="#" className="nav__logo">
                        Tourism<span>Portal - Admin Panel</span>
                    </Link>

                    <div className={`nav__menu ${showMenu ? 'show-menu' : ''}`} id="nav-menu" >
                        <ul className="nav__list">
                            <li className="nav__item">
                                <Link to="/Admin" className="nav__link active">
                                    Requests
                                </Link>
                            </li>
                            <li className="nav__item">
                                <Link to="/AdminGallery" className="nav__link">
                                Gallery
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
                <br></br>
                <br></br>

                <section className="section tour container">
                    <h3 className="section-title">Pending Requests - Agents</h3>

                    <div className="tour__container">
                        {tourPackages.map((tourPackage) => (
                            <div
                                key={tourPackage.travelAgent_Id}
                                className="tour__card tour__card-hover"
                                style={{ backgroundColor: 'hsla(36, 90%, 55%, 1)' }}
                            >
                                <img
                                    className="tour__card-img"
                                    style={{ width: '325px', height: '334px' }}
                                />
                                <div className="tour__data">
                                    <h5
                                        className="tour__data-title"
                                        style={{ color: 'black', fontSize: '2.1rem' }}
                                    >
                                        Agent Name: {tourPackage.travelAgent_Username}
                                    </h5>
                                    <span
                                        className="tour__data-subtitle"
                                        style={{ color: 'black', fontSize: '2.1rem' }}
                                    >
                                        Status: {tourPackage.travelAgent_IsApproved}
                                    </span>
                                    <br></br>
                                    <br></br>
                                </div>
                                <div className="tour__buttons">
                                    <button className="tour__button" onClick={() => handleApprove(tourPackage.travelAgent_Id)} style={{ marginRight: '70px', background: 'green', color: 'white', border: '2px solid green' }}>Approve</button>
                                    <button className="tour__button" onClick={() => handleDecline(tourPackage.travelAgent_Id)} style={{ marginRight: '30px', background: 'red', color: 'white', border: '2px solid red' }}>Decline</button>
                                </div>
                            </div>
                        ))}
                    </div>

                </section>

                <br></br>

                <section className="section tour container">
                    <br></br>
                    <br></br>
                    <h3 className="section-title">Approved Requests - Agents</h3>

                    <div className="tour__container">
                        {tourPackages1.map((tourPackage1) => (
                            <div key={tourPackage1.travelAgent_Id} className="tour__card tour__card-hover"
                                style={{ backgroundColor: '#4BAC3F' }}>
                                <img
                                    className="tour__card-img"
                                    style={{ width: '325px', height: '334px' }}
                                />
                                <div className="tour__data">
                                    <h5
                                        className="tour__data-title"
                                        style={{ color: 'black', fontSize: '2.1rem' }}
                                    >Agent Name: {tourPackage1.travelAgent_Username}</h5>
                                    <span
                                        className="tour__data-subtitle"
                                        style={{ color: 'black', fontSize: '2.1rem' }}
                                    >Status: {tourPackage1.travelAgent_IsApproved}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="section tour container">
                    <br></br>
                    <br></br>
                    <h3 className="section-title">Declined Requests - Agents</h3>

                    <div className="tour__container">
                        {tourPackages2.map((tourPackage2) => (
                            <div key={tourPackage2.travelAgent_Id} className="tour__card tour__card-hover"
                                style={{ backgroundColor: '#F51720' }}>
                                <img
                                    className="tour__card-img"
                                    style={{ width: '325px', height: '334px' }}
                                />
                                <div className="tour__data">
                                    <h5
                                        className="tour__data-title"
                                        style={{ color: 'black', fontSize: '2.1rem' }}
                                    >Agent Name: {tourPackage2.travelAgent_Username}</h5>
                                    <span
                                        className="tour__data-subtitle"
                                        style={{ color: 'black', fontSize: '2.1rem' }}
                                    >Status: {tourPackage2.travelAgent_IsApproved}</span>
                                </div>
                            </div>
                        ))}
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
