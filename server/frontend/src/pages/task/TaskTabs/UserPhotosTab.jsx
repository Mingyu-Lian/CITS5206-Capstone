import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Typography, Button, Upload } from "antd";
import loco0 from "../../../img/loco0.jpg";
import loco1 from "../../../img/loco1.jpg";
import loco2 from "../../../img/loco2.jpg";
import "./userphotostab.css";

const { Title } = Typography;

const fileList = [
  {
    uid: '0',
    name: 'loco0.jpg',
    status: 'done',
    url: loco0,
    thumbUrl: loco0,
  },
  {
    uid: '1',
    name: 'loco1.jpg',
    status: 'done',
    url: loco1,
    thumbUrl: loco1,
  },
  {
    uid: '2',
    name: 'loco2.jpg',
    status: 'done',
    url: loco2,
    thumbUrl: loco2,
  },
];

const UserPhotosTab = () => (
  <div className='user-photos-tab'>
    <div className='user-photos-tab-title'>
      <Title level={4} style={{ color: "#FFF" }}>
        User Photos
      </Title>
    </div>
    <div className='user-photos-tab-upload-container'>
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture"
        defaultFileList={fileList}
        className='user-photos-tab-upload'
      >
        <Button type="primary" icon={<UploadOutlined />}>
          Upload User Photos
        </Button>
      </Upload>
    </div>
  </div>
);

export default UserPhotosTab;
