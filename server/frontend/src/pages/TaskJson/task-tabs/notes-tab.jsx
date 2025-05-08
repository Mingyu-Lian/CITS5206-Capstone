import React, { useState } from 'react';
import { Input, Button, List, Card, Typography, Alert } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

export default function NotePage({ noteAlert }) {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  const handleInputChange = (e) => {
    setNote(e.target.value);
  };

  const handleSubmit = () => {
    if (note.trim() !== '') {
      setNotes([note, ...notes]);
      setNote('');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: '20px', backgroundColor: '#fff' }}>
        {noteAlert.map((alert, idx) => (
        <Alert
          key={idx}
          message={<span style={{ color: '#e6b800' }}>{alert}</span>}
          type="warning"
          showIcon
          style={{ marginBottom: 8 }}
        />
      ))}
      <Title level={3}>My Notes</Title>
    
      <TextArea
        value={note}
        onChange={handleInputChange}
        rows={4}
        placeholder="Please type your note here..."
        style={{ marginBottom: 12 }}
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        disabled={!note.trim()}
        style={{ marginBottom: 24 }}
      >
        Save Note
      </Button>

      <List
        dataSource={notes}
        renderItem={(item, idx) => (
          <List.Item key={idx}>
            <Card style={{ width: '100%' }}>
              {item}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}