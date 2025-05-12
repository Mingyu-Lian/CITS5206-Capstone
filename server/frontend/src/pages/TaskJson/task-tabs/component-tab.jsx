import React, { useState } from 'react';
import { Input, List, Card, Typography, Alert, Empty } from 'antd';

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function ComponentsPage({ components }) {


  return (
    <div >
      <Title level={3} style={{ color: '#fff' }}>Components</Title>
      <div style={{ display: "flex", justifyContent: "Center" }}>

        {components ?
          <List
            dataSource={components}
            renderItem={(item, idx) => (
              <List.Item style={{ color: '#fff', border: 'none', padding: 8 }}>
                <Text style={{ color: '#fff', fontSize: "16px" }}> {item}</Text>
              </List.Item>
            )}
            style={{ background: 'none' }}
          /> :
          <Empty/>
        }

      </div>
    </div >

  );
}