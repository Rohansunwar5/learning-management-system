"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ/FAQ";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="FAQ - Eduception"
        description="Eduception is a innovative learning platform for students to lern and get help from their course mentors"
        keywords="Programming, MERN, React, Nextjs, Maching Lerning/AI"
      />
      <Navbar
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <div className="min-h-screen">
        <FAQ />
      </div>
      <Footer />
    </div>
  );
};

export default Page;
