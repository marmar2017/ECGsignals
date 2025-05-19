import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the ECG App</h1>
      <p className="text-lg mb-8">This is a simple ECG application.</p>
      <a
        href="/ecgchart"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Go to ECG Chart
      </a>
    </div>
  );
};

export default Home;
