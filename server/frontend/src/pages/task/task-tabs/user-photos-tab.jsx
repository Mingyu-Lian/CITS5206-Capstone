import React, { useState, useRef } from 'react';
import Webcam from "react-webcam";
import { UploadOutlined } from '@ant-design/icons';
import { Typography, Empty, Button, Upload, Modal } from "antd"
import loco0 from "../../../img/loco0.jpg";
import loco1 from "../../../img/loco1.jpg";
import loco2 from "../../../img/loco2.jpg";
import "./userphotostab.css";
export default function UserPhoto() {
  // State for take photo modal
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const { Title } = Typography
  const fileList = [
    {
      uid: '0',
      name: 'hatichilocomotive.png',
      status: 'done',
      url: loco0,
      thumbUrl: loco0,
      percent: 33,
    },
    {
      uid: '1',
      name: 'hatichilocomotive.png',
      status: 'done',
      url: loco1,
      thumbUrl: loco1
    },
    {
      uid: '2',
      name: 'hatichilocomotive.png',
      status: 'done',
      url: loco2,
      thumbUrl: loco2
    },

  ];


  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode: "user",
    aspectRatio: 0.6666666667

  };
  
  const handleRetake = () => {
    setImgSrc(null)
    setIsPhotoModalOpen(true)
  }
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    // fileList.push({ url: imageSrc });
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const handleSavePhoto = ()=>{
    setIsPhotoModalOpen(false)
  }  
  const handleClosePhoto = ()=>{
    // setImgSrc(null);
    setIsPhotoModalOpen(false)
  }  
  return (

    <div className='user-photos-tab'>
      <div className='user-photos-tab-title'>
        <Title level={10} style={{ color: "#FFF" }}>
          User Photos
        </Title>
      </div>
      <div className='user-photos-tab-upload-container'>
        <div className='user-photos-tab-upload'>
          <Button type="primary" style={{ marginBottom: "10px" }} icon={<UploadOutlined />} onClick={() => {

            setIsPhotoModalOpen(true)
          }}>
            Take Photo
            {/* {imgSrc ? "Take Photo": "Retake photo"} */}
          </Button>
          {
            imgSrc ? 
            <div>
            <img
              src={imgSrc}
            />   <Button onClick={handleRetake}>Retake photo</Button></div>
            : <Upload
              style={{ width: "200px" }}
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"

              listType="picture"
              defaultFileList={fileList}
            >
              <Button type="primary" icon={<UploadOutlined />}>
                Upload User Photos From Device
              </Button>
            </Upload>
          }


          <Modal title="Take Photo" open={isPhotoModalOpen} onOk={handleSavePhoto} onCancel={handleClosePhoto}


          >
            <div>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}

              />
              <Button style={{marginBottom:"6px"}} onClick={capture}>Capture photo</Button>
              {imgSrc && (
                <img
                  src={imgSrc}
                />
              )}
            </div>
          </Modal>
        </div>
      </div>
    </div >

  );
}