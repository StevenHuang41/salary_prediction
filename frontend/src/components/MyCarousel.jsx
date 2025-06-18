import React from "react";
import { Carousel } from 'react-bootstrap';
// import { useState } from "react";
import './MyCarousel.css';

const MyCarousel = ({
  images,
  alts,
}) => {

  return (<>
    <Carousel interval={7000} controls={true} indicators={true}>
      {images.map((element, idx) => (
      <Carousel.Item key={`img${idx}`}>
        <img
          className="d-block w-100"
          src={element || null}
          alt={alts[idx] || null}
        />
      </Carousel.Item>
      ))}
    </Carousel>
  </>)
};

export default MyCarousel;
