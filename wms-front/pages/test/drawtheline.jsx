// pages/index.js
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the KonvaStage component to avoid server-side rendering issues
const LineCreate = dynamic(() => import('/components/LineCreate.jsx'), { ssr: false });

const Home = () => {
  return (
    <div>
      <LineCreate />
    </div>
  );
};

export default Home;
