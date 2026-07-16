import React from 'react';

const DarkModeToggle = ({ darkMode, setDarkMode, visible = false }) => {
  if (!visible) return null;
  return (
    <button 
      onClick={() => setDarkMode(!darkMode)} 
      className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${darkMode ? 'bg-purple-600' : 'bg-gray-300'}`}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 ease-in-out ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );
};

export default DarkModeToggle;
