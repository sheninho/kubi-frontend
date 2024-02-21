"use client"
// components/Layout.js
import React from 'react';
import Sidebar from './SideBar2'; // Assurez-vous que le chemin d'accès est correct

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;
