import React, { useState, useEffect } from "react";
import "./Hero.css";

const images = [
  "../../../../images/image1.jpg",
  "../../../../images/image2.jpg",
  "../../../../images/image3.jpg",
];

const slideInterval = 4000;

const slideContents = [
  {
    heading: "Discover the Taste",
    tagline:
      "Indulge in our mouthwatering dishes that will leave you craving for more.",
    buttonText: "Order Now",
  },
  {
    heading: "Experience Culinary Delights",
    tagline:
      "Embark on a journey of flavors and textures that will tantalize your taste buds.",
    buttonText: "Explore Menu",
  },
  {
    heading: "Elevate Your Dining Experience",
    tagline:
      "Savor the perfect blend of artful presentation and exquisite flavors.",
    buttonText: "Book a Table",
  },
];

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(goToNextSlide, slideInterval);
    return () => clearInterval(interval);
  }, [activeSlide]);

  const goToPreviousSlide = () => {
    setActiveSlide((prevSlide) =>
      prevSlide === 0 ? images.length - 1 : prevSlide - 1
    );
  };

  const goToNextSlide = () => {
    setActiveSlide((prevSlide) =>
      prevSlide === images.length - 1 ? 0 : prevSlide + 1
    );
  };

  return (
    <div className="hero-section">
      <div className="slider-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === activeSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="slide-content">
              <h2>{slideContents[index].heading}</h2>
              <p>{slideContents[index].tagline}</p>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
              <button className="slide-button">
                {slideContents[index].buttonText}
              </button>
            </div>
            <div className="overlay"></div>
          </div>
        ))}
        <div className="previous" onClick={goToPreviousSlide}>
          &lt;
        </div>
        <div className="next" onClick={goToNextSlide}>
          &gt;
        </div>
      </div>
      <div className="dots">
        {images.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === activeSlide ? "active-dot" : ""}`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
