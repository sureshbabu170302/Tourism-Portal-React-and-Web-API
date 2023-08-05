//eslint-disable
import { Link } from 'react-router-dom';
import aboutBgImage from '../Assets/media/bg-about.jpg';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cards.css';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-spinkit';

export default function Cards() {
  const [showMenu, setShowMenu] = useState(false);
  const [tourPackages, setTourPackages] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searched, setSearched] = useState(false);
  const [location, setLocation] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [nearbySpots, setNearbySpots] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [tourPackagesNew, setTourPackagesNew] = useState([]);
  const [isLowToHighClicked, setIsLowToHighClicked] = useState(false);
  const [tourPackagesNew1, setTourPackagesNew1] = useState([]);
  const [isLowToHighClicked1, setIsLowToHighClicked1] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNoResults, setShowNoResults] = useState(false);

  useEffect(() => {
    const navToggle = document.getElementById('nav-toggle');
    navToggle.addEventListener('click', toggleMenu);

    return () => {
      navToggle.removeEventListener('click', toggleMenu);
    };
  }, []);

  useEffect(() => {
    axios.get('https://localhost:7234/api/TourPackages')
      .then((response) => {
        setTourPackages(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tour packages data:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    axios.get('https://localhost:7234/api/TourPackages/GetTourPackagesByPriceAscending')
      .then((response) => {
        setTourPackagesNew(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tour packages data:', error);
        setIsLoading(false);
      });
  }, []);

  const handleLowToHighClick = () => {
    const sortedTourPackages = [...tourPackages].sort(
      (a, b) => a.tourPackage_PricePerDay - b.tourPackage_PricePerDay
    );
    setTourPackages(sortedTourPackages);
    setIsLowToHighClicked(true);
    setIsLowToHighClicked1(false);
    setSearchResults([]);
    setShowResults(false);
  };

  useEffect(() => {
    axios.get('https://localhost:7234/api/TourPackages/GetTourPackagesByPriceDescending')
      .then((response) => {
        setTourPackagesNew1(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tour packages data:', error);
        setIsLoading(false);
      });
  }, []);

  const handleHighToLowClick = () => {
    const sortedTourPackages = [...tourPackages].sort(
      (a, b) => b.tourPackage_PricePerDay - a.tourPackage_PricePerDay
    );
    setTourPackages(sortedTourPackages);
    setIsLowToHighClicked(false); 
    setIsLowToHighClicked1(true);
    setSearchResults([]); 
    setShowResults(false);
  };

  const toggleMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  const navigate = useNavigate();

  const handleCardClick = (tourPackageId) => {
    const encryptedId = btoa(tourPackageId);
    localStorage.setItem('TP_Id', encryptedId);
    navigate('/detail');
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setSearched(true);

    const apiUrl = `https://localhost:7234/api/TourPackages/GetTourPackagesByFilters?locationName=${location}&pricePerDay=${pricePerDay}&speciality=${speciality}&nearbySpots=${nearbySpots}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setSearchResults([]);
          setShowNoResults(true); 
        } else {
          setSearchResults(data);
          setShowNoResults(false);
        }
        setShowResults(true);
      })
      .catch((error) => console.error('Error fetching data:', error));
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
          <h1 className="hero__title">Our Tour Packages</h1>
        </section>

        <br></br>

        <>
          <h1 className="hero__title" style={{ color: 'black', textShadow: '2px 2px 4px #ccc' }}>Search Filter</h1>
          <section className="section about container">
            <div style={{ margin: 0, padding: 0, boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', backgroundColor: '#f7f7f7', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '8vh' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', width: '100%', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
                <form onSubmit={handleFormSubmit}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <input type="text" placeholder="  Location" value={location} onChange={(e) => setLocation(e.target.value)} style={{ flex: 1, border: '1px solid #ccc', outline: 'none', padding: '10px', margin: '5px', fontSize: '16px', borderRadius: '20px', width: 'calc(25% - 20px)', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }} />
                    <input type="number" placeholder="  Price/Day" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} style={{ flex: 1, border: '1px solid #ccc', outline: 'none', padding: '10px', margin: '5px', fontSize: '16px', borderRadius: '20px', width: 'calc(25% - 20px)', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }} />
                    <input type="text" placeholder="  Speciality" value={speciality} onChange={(e) => setSpeciality(e.target.value)} style={{ flex: 1, border: '1px solid #ccc', outline: 'none', padding: '10px', margin: '5px', fontSize: '16px', borderRadius: '20px', width: 'calc(25% - 20px)', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }} />
                    <input type="text" placeholder="  Nearby Spots" value={nearbySpots} onChange={(e) => setNearbySpots(e.target.value)} style={{ flex: 1, border: '1px solid #ccc', outline: 'none', padding: '10px', margin: '5px', fontSize: '16px', borderRadius: '20px', width: 'calc(25% - 20px)', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }} />
                  </div>
                  <button type="submit" style={{ backgroundColor: '#ff6600', color: '#fff', border: 'none', padding: '10px 20px', fontSize: '16px', borderRadius: '20px', cursor: 'pointer', transition: 'background-color 0.2s ease', marginTop: '10px' }} className="filter-button">Search</button>
                </form>
              </div>
            </div>
          </section>

          {showResults && (
            <section className="section about-hero" id="hero">
              <h1 className="hero__title" style={{ color: 'black', textShadow: '2px 2px 4px #ccc', textAlign: 'center', marginBottom: '0px' }}>Results</h1>
              {searched && searchResults.length === 0 && showNoResults ? (
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <br></br>
                  <br></br>
                  <p>Sorry! No packages match your requirements.</p>
                </div>
              ) : null}
            </section>
          )}

          {isLoading ? ( 
            <div className="loading-spinner-container">
              <Spinner name="circle" fadeIn="none" className="loading-spinner" color="#ff6600" />
            </div>
          ) : showResults ? ( 
            <section className="section tour container">
              <div className="tour__container">
                {searchResults.map((result) => (
                  <div
                    key={result.tourPackage_Id}
                    className="tour__card"
                    onClick={() => handleCardClick(result.tourPackage_Id)}
                  >
                    {result.location_Image && (
                      <img
                        src={convertToImageURL(result.location_Image)}
                        alt={result.tourPackage_Name}
                        className="tour__card-img"
                      />
                    )}
                    <div className="tour__data">
                      <h5 className="tour__data-title">{result.tourPackage_Name}</h5>
                      <span className="tour__data-subtitle">{result.tourPackage_PricePerDay} /Per Day</span>
                      <br />
                      <span className="tour__data-subtitle">{result.tourPackage_Location}</span>
                      <span className="tour__data-subtitle"> - {result.location_Speciality}</span>
                    </div>
                  </div>
                ))}
              </div>
              <br></br>
            </section>
          ) : (
            <p>
            <br></br>
            <br></br>
            <br></br>  
              No search results found.
            </p>
          )}

        </>
        <br></br>
        <br></br>
        <section className="section tour container">
          <section
            className="section about-hero"
            id="hero"
          >
            <h1 className="hero__title" style={{ color: 'black', textShadow: '2px 2px 4px #ccc' }}>All Packages</h1>
          </section>
          <h5 className="tour__data-title">Sort By Price

            <button
              type="submit"
              style={{
                backgroundColor: '#ff6600',
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
              onClick={handleLowToHighClick}
            >
              Low to High
            </button>

            <button
              type="submit"
              style={{
                backgroundColor: '#ff6600',
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
              onClick={handleHighToLowClick}
            >
              High to Low
            </button>

          </h5>

          <div className="tour__container">
            {isLowToHighClicked ? (
              tourPackagesNew.map((tourPackageNew) => (
                <div
                  key={tourPackageNew.tourPackage_Id}
                  className="tour__card"
                  onClick={() => handleCardClick(tourPackageNew.tourPackage_Id)}
                >
                  {tourPackageNew.location_Image && (
                    <img
                      src={convertToImageURL(tourPackageNew.location_Image)}
                      alt={tourPackageNew.tourPackage_Name}
                      className="tour__card-img"
                    />
                  )}
                  <div className="tour__data">
                    <h5 className="tour__data-title">{tourPackageNew.tourPackage_Name}</h5>{' '}
                    <span className="tour__data-subtitle">
                      {tourPackageNew.tourPackage_PricePerDay} /Per Day
                    </span>
                    <br />
                    <span className="tour__data-subtitle">{tourPackageNew.tourPackage_Location}</span>
                    <span className="tour__data-subtitle"> - {tourPackageNew.location_Speciality}</span>
                  </div>
                </div>
              ))
            ) : isLowToHighClicked1 ? (
              tourPackagesNew1.map((tourPackageNew1) => (
                <div
                  key={tourPackageNew1.tourPackage_Id}
                  className="tour__card"
                  onClick={() => handleCardClick(tourPackageNew1.tourPackage_Id)}
                >
                  {tourPackageNew1.location_Image && (
                    <img
                      src={convertToImageURL(tourPackageNew1.location_Image)}
                      alt={tourPackageNew1.tourPackage_Name}
                      className="tour__card-img"
                    />
                  )}
                  <div className="tour__data">
                    <h5 className="tour__data-title">{tourPackageNew1.tourPackage_Name}</h5>{' '}
                    <span className="tour__data-subtitle">
                      {tourPackageNew1.tourPackage_PricePerDay} /Per Day
                    </span>
                    <br />
                    <span className="tour__data-subtitle">{tourPackageNew1.tourPackage_Location}</span>
                    <span className="tour__data-subtitle"> - {tourPackageNew1.location_Speciality}</span>
                  </div>
                </div>
              ))
            ) : (
              tourPackages.map((tourPackage) => (
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
                    <h5 className="tour__data-title">{tourPackage.tourPackage_Name}</h5>{' '}
                    <span className="tour__data-subtitle">
                      {tourPackage.tourPackage_PricePerDay} /Per Day
                    </span>
                    <br />
                    <span className="tour__data-subtitle">{tourPackage.tourPackage_Location}</span>
                    <span className="tour__data-subtitle"> - {tourPackage.location_Speciality}</span>
                  </div>
                </div>
              ))
            )}
          </div>

        </section>
      </main>

      <footer className="footer">
        <h3 className="footer__title">Follow Us</h3>
        <div className="footer__social">
          <a href="#" className="footer__social-link">
            <i className="bx bxl-facebook"></i>
          </a>
          <a href="#" className="footer__social-link">
            <i className="bx bxl-instagram"></i>
          </a>
          <a href="#" className="footer__social-link">
            <i className="bx bxl-tiktok"></i>
          </a>
        </div>
      </footer>
    </>
  );
}
