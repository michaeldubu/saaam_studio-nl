import React, { useEffect } from 'react';
import SaaamApp from './SaaamApp';

const SaaamStudioDemo = () => {
  // Log when the demo is loaded
  useEffect(() => {
    console.log('SAAAM Studio Demo loaded');
  }, []);

  return (
    <div className="h-screen w-full bg-gray-900">
      <SaaamApp />
    </div>
  );
};

export default SaaamStudioDemo;
