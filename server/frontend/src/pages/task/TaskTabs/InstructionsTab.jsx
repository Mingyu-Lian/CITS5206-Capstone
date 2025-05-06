
import React, { useState, useRef } from 'react';

import { Typography, List, Carousel, Button } from "antd"
import { UserOutlined, FileTextOutlined, PictureOutlined, InfoCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import loco0 from "../../../img/loco0.jpg";
import loco1 from "../../../img/loco1.jpg";
import loco2 from "../../../img/loco2.jpg";



import "./instruction.css";
const InstructionsTab = () => {
  const { Text, Paragraph } = Typography
  const images = [
    {
      id: 0,
      url:loco0,
      thumbnail:loco0,
      // url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Crect x='100' y='50' width='200' height='100' fill='%23ccc'/%3E%3Crect x='125' y='175' width='150' height='75' fill='%23999'/%3E%3Ccircle cx='150' cy='80' r='20' fill='%23666'/%3E%3Ccircle cx='250' cy='80' r='20' fill='%23666'/%3E%3Ctext x='200' y='160' font-family='Arial' font-size='16' text-anchor='middle' fill='%23333'%3ELocomotive%3C/text%3E%3C/svg%3E",
      // thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Crect x='25' y='20' width='50' height='30' fill='%23ccc'/%3E%3Crect x='30' y='60' width='40' height='20' fill='%23999'/%3E%3Ccircle cx='35' cy='30' r='5' fill='%23666'/%3E%3Ccircle cx='65' cy='30' r='5' fill='%23666'/%3E%3C/svg%3E",
    },
    {
      id: 1,
      url:loco1,
      thumbnail:loco1,
      // url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Crect x='75' y='75' width='250' height='150' fill='%23ddd'/%3E%3Ccircle cx='150' cy='125' r='30' fill='%23999'/%3E%3Ccircle cx='250' cy='125' r='30' fill='%23999'/%3E%3Crect x='125' y='200' width='150' height='25' fill='%23666'/%3E%3Ctext x='200' y='160' font-family='Arial' font-size='16' text-anchor='middle' fill='%23333'%3EEngine Detail%3C/text%3E%3C/svg%3E",
      // thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Crect x='20' y='25' width='60' height='40' fill='%23ddd'/%3E%3Ccircle cx='35' cy='40' r='8' fill='%23999'/%3E%3Ccircle cx='65' cy='40' r='8' fill='%23999'/%3E%3Crect x='30' y='65' width='40' height='7' fill='%23666'/%3E%3C/svg%3E",
    },
    {
      id: 2,
      url:loco2,
      thumbnail:loco2,
      // url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Cpath d='M100,200 L300,200 L250,100 L150,100 Z' fill='%23bbb'/%3E%3Ccircle cx='150' cy='225' r='25' fill='%23666'/%3E%3Ccircle cx='250' cy='225' r='25' fill='%23666'/%3E%3Ctext x='200' y='160' font-family='Arial' font-size='16' text-anchor='middle' fill='%23333'%3EWorksite View%3C/text%3E%3C/svg%3E",
      // thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M25,65 L75,65 L65,35 L35,35 Z' fill='%23bbb'/%3E%3Ccircle cx='35' cy='75' r='7' fill='%23666'/%3E%3Ccircle cx='65' cy='75' r='7' fill='%23666'/%3E%3C/svg%3E",
    }
  ];
  const instructionsData = [
    {
      id: 1,
      text: "Inspect Locomotive entry points",
    },
    {
      id: 2,
      text: "Ensure Roads are locked out and the Locomotive isolated.",
      note: "(Locomotive can be moved or enter the rolling stock work area)",
      noteColor: "#4a90e2",
    },
    {
      id: 3,
      text: "Ensure that safe working protection is in place.",
      note: "(Trips and falls can occur whilst boarding Locomotive, unwanted movement of walkways can occur)",
      noteColor: "#4a90e2",
    },
    {
      id: 4,
      text: "Refer to isolation matrix for lockout points.",
    },
    {
      id: 5,
      text: "Ensure entry walkways are properly secured with straps, and barriers are across any gaps.",
      note: "(Falling down to the pit can occur)",
      noteColor: "#4a90e2",
    },
  ]
  const carouselRef = useRef();

  // Handle carousel navigation
  const nextSlide = () => {
    carouselRef.current.next();
  };

  const prevSlide = () => {
    carouselRef.current.prev();
  };
  const contentStyle = {
    margin: 0,
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
  return (
    <div className="instruction-container">


      <div className="instruction-content">
        <div className="">
          <div className="" style={{color: "#fcf003", fontSize:16 }}>
            Ask your Permit Isolation Officer or Administrator if unsure of isolation
          </div>
        </div>

        <List
          dataSource={instructionsData}
          renderItem={(item) => (
            <List.Item className="">
              <div>
                <div className="instruction-text" style={{ color: "#fff" }}>
                  {item.id}. {item.text}
                </div>
                {item.note && (
                  <div className="instruction-note">
                    <Text style={{ color: item.noteColor }}>{item.note}</Text>
                  </div>
                )}
              </div>
            </List.Item>
          )}
        />
      </div>
      <div className="instruction-photo">
        <div className="photo-viewer-container">
       

          <div className="carousel-container">
            <Button
              className="carousel-button prev-button"
              icon={<LeftOutlined />}
              onClick={prevSlide}
            />
            <Carousel ref={carouselRef} className="photo-carousel">
              {images.map((image) => (
                <div key={image.id} className="carousel-item">
                  <img src={image.url} alt="Locomotive" className="carousel-image" />
                </div>
              ))}
            </Carousel>

            <Button
              className="carousel-button next-button"
              icon={<RightOutlined />}
              onClick={nextSlide}
            />
          </div>

          <div className="thumbnail-gallery">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="thumbnail"
                onClick={() => carouselRef.current.goTo(index)}
              >
                <img src={image.thumbnail} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
export default InstructionsTab;