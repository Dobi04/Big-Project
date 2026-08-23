import { useEffect, useState } from 'react';
import { apiClient } from './api/client';

function App() {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    apiClient.get('/weatherforecast')
      .then(() => setStatus('✅ Backend connected'))
      .catch((err) => setStatus('❌ Connection failed: ' + err.message));
  }, []);

  return (
    <div>
      <h1>ExcursionSaaS</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;