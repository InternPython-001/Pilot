import { useState, useEffect } from 'react';

const CONFIG_URL = 'https://raw.githubusercontent.com/InternPython-001/Pilot/main/constants/apiUrl.json';

const useApi = () => {
  const [API_URL, setApiUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(CONFIG_URL);
        const config = await res.json();
        setApiUrl(config.API_URL);
      } catch (err) {
        console.error('Failed to load API config:', err);
        setError('Could not load API URL');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { API_URL, loading, error };
};

export default useApi;
