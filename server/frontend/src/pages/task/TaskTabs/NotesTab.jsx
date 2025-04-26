import React, { useState } from 'react';
import { Input, Button, List, Card, Typography } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

export default function NotesTab() {
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
    <div style={{ maxWidth: 500, margin: '40px auto', padding: '20px',backgroundColor:'#fff' }}>
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
        locale={{ emptyText: 'No notes yet' }}
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