import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useTabQuery(defaultTab = 'account') {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || defaultTab;
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setTabValue(params.get('tab') || defaultTab);
  }, [location.search, defaultTab]);

  return [tabValue, setTabValue];
}