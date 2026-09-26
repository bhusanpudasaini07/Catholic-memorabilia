import { BreadCrumbImage } from "@/shared/lib/image-config";
import Image from "next/image";
import React, { useState } from "react";

const Footer = () => {

  return (
    <div className="relative">
     <footer 
      style={{ backgroundImage: `url(${BreadCrumbImage})` }}
      className="bg-cover bg-center bg-no-repeat"
     >

     </footer>
      
    </div>
  );
};

export default Footer;
