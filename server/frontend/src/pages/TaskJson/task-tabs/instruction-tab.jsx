
import React, { useState, useRef } from 'react';

import { Typography, List, Carousel, Button,Alert } from "antd"
import { UserOutlined, FileTextOutlined, PictureOutlined, InfoCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import loco0 from "../../../img/loco0.jpg";
import loco1 from "../../../img/loco1.jpg";
import loco2 from "../../../img/loco2.jpg";



import "./instruction.css";
const InstructionsTab = ({instructionData}) => {
  console.log("instructionData", instructionData)
  const { Text, Paragraph } = Typography
  const images = [
    {
      id: 0,
      url: loco0,
      thumbnail: loco0,
    },
    {
      id: 1,
      url: loco1,
      thumbnail: loco1,
    },
    {
      id: 2,
      url: loco2,
      thumbnail: loco2,
    }
  ];

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
          <div className="" style={{ color: "#fcf003", fontSize: 16 }}>
            Ask your Permit Isolation Officer or Administrator if unsure of isolation
          </div>
        </div>

        <Alert
          message={<span style={{ color: '#e6b800', fontWeight: 600 }}>Ask your Permit Isolation Officer or Administrator if unsure of isolation</span>}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <List
          dataSource={instructionData}
          renderItem={(item, idx) => (
            <List.Item style={{ color: '#fff', border: 'none', padding: 8 }}>
              <Text style={{ color: '#fff' }}>{idx + 1}. {item}</Text>
            </List.Item>
          )}
          style={{ background: 'none' }}
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