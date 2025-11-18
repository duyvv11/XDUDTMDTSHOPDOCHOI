import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";

const PublicLayout = () => {
  return (
    <>
      <Header />
      <Menu />
      <Outlet /> 
      <Footer />
    </>
  );
};

export default PublicLayout;