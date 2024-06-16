"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Navbar from "../components/Navbar";
import About from "./About";
import Footer from "../components/Footer";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen">
      <Heading
        title="About us - Eduception"
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
        <About />
      </div>
      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default Page;
