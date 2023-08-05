import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminPanelGallery.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export default function AdminPanelGallery() {
    const [showMenu, setShowMenu] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);

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
    }, [showModal]);


    const toggleMenu = () => {
        setShowMenu((prevShowMenu) => !prevShowMenu);
    };

    const toggleModal = () => {
        setShowModal((prevShowModal) => !prevShowModal);
    };

    const handlePostImages = async () => {
        try {
            const formData = new FormData();
            formData.append('Admin_Id', '1');

            if (imageFile) {
                formData.append('Image', imageFile);
            } else {    
                console.error('No image selected.');
                return;
            }

            const response = await fetch('https://localhost:7108/api/Gallery', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Images posted successfully!');
                toggleModal();
                toast.success('Image posted successfully', {
                    position: 'top-right',
                    autoClose: 3000, 
                    hideProgressBar: true,
                });
            } else {
                console.error('Error posting images:', response.statusText);
                toast.error('Error posting images', {
                    position: 'top-right',
                    autoClose: 3000, 
                    hideProgressBar: true,
                });
            }
        } catch (error) {
            console.error('Error posting images:', error);
            toast.error('Error posting images', {
                position: 'top-right',
                autoClose: 3000, 
                hideProgressBar: true,
            });
        }
    };

    return (
        <div>

            <header className="header" id="header">
                <nav className="nav container">
                    <Link to="/Admin" className="nav__logo">
                        Tourism<span>Portal - Admin Panel</span>
                    </Link>

                    <div className={`nav__menu ${showMenu ? 'show-menu' : ''}`} id="nav-menu">
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

            <main className="main" id="main">
                <section
                    className="section about-hero"
                    id="hero"
                >
                    <h1 className="hero__title" style={{ color: 'black', textShadow: '5px 5px 20px rgba(0, 0, 0, 0)' }}>
                        Gallery Images
                    </h1>
                </section>

                <section
                    className="section about-hero"
                    id="hero"
                    style={{ height: '5vh' }}
                >
                    <button
                        type="button"
                        onClick={toggleModal}
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
                    >
                        Post Images
                    </button>

                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={toggleModal}>&times;</span>
                                <h2>Post Images</h2>
                                <br></br>
                                <p>Upload the Gallery Image</p>
                                <br></br>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setImageFile(file);
                                    }}
                                    style={{
                                        marginBottom: '10px',
                                        padding: '8px',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        background: '#f9f9f9',
                                        color: '#444',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        cursor: 'pointer',
                                    }}
                                />


                                <br></br>
                                <br></br>

                                <button
                                    type="button"
                                    onClick={toggleModal}
                                    style={{
                                        backgroundColor: '#778899',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '10px 20px',
                                        fontSize: '16px',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s ease',
                                        marginTop: '10px',
                                        marginLeft: '10px'
                                    }}
                                    className="filter-button"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handlePostImages}
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
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    )}

                </section>

                <br></br>
                <br></br>
                <br></br>

                <section className="section tour container">
                    <div className="tour__container">
                        {galleryImages.map((imageData, index) => (
                            <div key={index} className="tour__card">
                                {imageData.gallery_Image && (
                                    <img
                                        src={imageData.gallery_Image}
                                        alt={`Gallery Image ${index}`}
                                        className="tour__card-img"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </section>
                <ToastContainer />
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

        </div>
    );
}
