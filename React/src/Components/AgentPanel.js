import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AgentPanel.css';
import axios from 'axios';
import Spinner from 'react-spinkit';
import CryptoJS from 'crypto-js';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export default function AgentPanel() {
  const [showMenu, setShowMenu] = useState(false);
  const [travelAgents, setTravelAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const [formValues, setFormValues] = useState({
    tourPackage_Name: '',
    tourPackage_Location: '',
    tourPackage_HotelName: '',
    tourPackage_PricePerDay: 0,
    location_Speciality: '',
    spots_Nearby: '',
    locationImageFile: null,
    hotelImageFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setFormValues({ ...formValues, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const decryptEmail = (encryptedEmail) => {
      const bytes = CryptoJS.AES.decrypt(encryptedEmail, 'your-secret-key');
      const decryptedEmail = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedEmail;
    };
  
    try {
      // Fetch travel agent data using the decrypted email
      const encryptedEmail = localStorage.getItem('encrypted_email');
      if (encryptedEmail) {
        const decryptedEmail = decryptEmail(encryptedEmail);
        const response = await axios.get(`https://localhost:7234/api/TravelAgents/ByEmail?email=${decryptedEmail}`);
        
        if (response.status === 200) {
          const travelAgentData = response.data;
          // Get the travelAgent_Id and administrator's admin_Id from the response data
          const { travelAgent_Id } = travelAgentData;
          const { admin_Id } = travelAgentData.administrator;
  
          // Create a new FormData and append the form values and IDs
          const formData = new FormData();
          formData.append('tourPackage_Name', formValues.tourPackage_Name);
          formData.append('tourPackage_Location', formValues.tourPackage_Location);
          formData.append('tourPackage_HotelName', formValues.tourPackage_HotelName);
          formData.append('tourPackage_PricePerDay', formValues.tourPackage_PricePerDay);
          formData.append('location_Speciality', formValues.location_Speciality);
          formData.append('spots_Nearby', formValues.spots_Nearby);
          formData.append('locationImageFile', formValues.locationImageFile);
          formData.append('hotelImageFile', formValues.hotelImageFile);
          formData.append('travelAgent.travelAgent_Id', travelAgent_Id);
          formData.append('administrator.admin_Id', admin_Id);
  
          // Submit the form data using fetch
          const postResponse = await fetch('https://localhost:7234/api/TourPackages', {
            method: 'POST',
            body: formData,
          });
  
          if (postResponse.ok) {
            console.log('Tour package added successfully!');
            toast.success('Package Posted Successfully', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
            });
            toggleModal();
            setIsFormSubmitted(true);
          } else {
            console.error('Error adding tour package:', postResponse.statusText);
            toast.error('Error posting images', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
            });
          }
        } else {
          console.error('Error fetching travel agent data:', response.statusText);
          toast.error('Error posting images', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
          });
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error adding tour package:', error);
      toast.error('Error posting images', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };
  
  useEffect(() => {
    const navToggle = document.getElementById('nav-toggle');
    navToggle.addEventListener('click', toggleMenu);

    window.addEventListener('resize', handleResize);

    return () => {
      navToggle.removeEventListener('click', toggleMenu);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  const handleResize = () => {
    setShowMenu(window.innerWidth > 768 ? true : false);
  };

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
  }, [isFormSubmitted, isDeleteSuccess]);

  const handleDeleteTourPackage = async (tourPackageId) => {
    try {
      await axios.delete(`https://localhost:7234/api/TourPackages/${tourPackageId}`);
      console.log('Tour package deleted successfully!');
      setIsDeleteSuccess(true);
      toast.success('Package deleted successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error('Error deleting tour package:', error);
    }
  };

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

  const handleBookingsClick = (tourPackageId) => {
    const encryptedId = btoa(tourPackageId);
    localStorage.setItem('TP_Id', encryptedId);
    navigate('/AgentBooking');
  };

  const navigate = useNavigate();

  const toggleModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  return (
    <>
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
            </ul>
          </div>

          <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
            <i className="bx bx-menu"></i>
          </div>
        </nav>
      </header>

      <main className="main" id="main">

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <section className="section tour container">
          <h3 className="section-title">Tour Packages</h3>
          <button
            type="button"
            style={{
              backgroundColor: 'hsla(241, 63%, 50%, 1)',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              marginTop: '10px',
              marginLeft: '20px'
            }}
            className="filter-button"
            onClick={toggleModal}
          >
            Add Tour Packages
          </button>

          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={toggleModal}>&times;</span>
                <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Enter Package Details</h2>
                <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
                  <label style={{ display: 'block', marginBottom: '10px' }}>
                    Tour Package Name:
                    <input
                      type="text"
                      name="tourPackage_Name"
                      value={formValues.tourPackage_Name}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </label>

                  <label style={{ display: 'block', marginBottom: '10px' }}>
                    Tour Package Location:
                    <input
                      type="text"
                      name="tourPackage_Location"
                      value={formValues.tourPackage_Location}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </label>

                  <label style={{ display: 'block', marginBottom: '10px' }}>
                    Tour Package Hotel Name:
                    <input
                      type="text"
                      name="tourPackage_HotelName"
                      value={formValues.tourPackage_HotelName}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </label>

                  <label style={{ display: 'block', marginBottom: '10px' }}>
                    Tour Package Price Per Day:
                    <input
                      type="number"
                      name="tourPackage_PricePerDay"
                      value={formValues.tourPackage_PricePerDay}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </label>

                  <label style={{ display: 'block', marginBottom: '10px' }}>
                    Location Speciality:
                    <input
                      type="text"
                      name="location_Speciality"
                      value={formValues.location_Speciality}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </label>

                  <label style={{ display: 'block', marginBottom: '10px' }}>
                    Spots Nearby:
                    <input
                      type="text"
                      name="spots_Nearby"
                      value={formValues.spots_Nearby}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </label>

                  <label style={{ display: 'block', marginBottom: '10px' }}>
                    Location Image:
                    <input
                      type="file"
                      name="locationImageFile"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </label>

                  <label style={{ display: 'block', marginBottom: '20px' }}>
                    Hotel Image:
                    <input
                      type="file"
                      name="hotelImageFile"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </label>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <button type="button" onClick={toggleModal} style={{ backgroundColor: '#778899', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>Cancel</button>
                    <button type="submit" style={{ backgroundColor: 'hsla(241, 63%, 50%, 1)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>Add Package</button>
                  </div>
                </form>
                <ToastContainer />
              </div>
            </div>
          )}

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
                      src={convertToImageURL(tourPackage.location_Image)}
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
                      <button
                        style={{
                          backgroundColor: '#f5c71a',
                          color: '#000000',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          margin: '0 5px 120px',
                          fontSize: '14px',
                          transition: 'background-color 0.3s',
                        }}
                      >
                        Update
                      </button>
                      <button
                        style={{
                          backgroundColor: '#e60026',
                          color: '#fff',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          margin: '0 5px 120px',
                          fontSize: '14px',
                          transition: 'background-color 0.3s',
                        }}
                        onClick={() => handleDeleteTourPackage(tourPackage.tourPackage_Id)}
                      >
                        Delete
                      </button>
                      <button
                        style={{
                          backgroundColor: '#0000FF',
                          color: '#fff',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          margin: '0 5px 120px',
                          fontSize: '14px',
                          transition: 'background-color 0.3s',
                        }}
                        onClick={() => handleBookingsClick(tourPackage.tourPackage_Id)}
                      >
                        Bookings
                      </button>
                    </div>
                  </div>
                  <ToastContainer />
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
