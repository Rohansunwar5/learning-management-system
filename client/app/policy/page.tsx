"use client";
import React, { useState } from "react";
import Heading from "../utils/Heading";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <div>
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
      <Footer />
    </div>
  );
};

export default Page;
