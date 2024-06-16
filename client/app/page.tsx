"use client";

import React, { FC, useState, useEffect } from "react";
import Heading from "./utils/Heading";
import Navbar from "./components/Navbar";
import { HeroSection } from "./components/Route/HeroSection";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import FAQ from "./components/FAQ/FAQ";
import Footer from "./components/Footer";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  const { data, refetch } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    if (data) {
      // Do something with data
    }
  }, [data]);

  return (
    <div>
      <Heading
        title="Eduception"
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
      <HeroSection />
      <Courses />
      <Reviews />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Page;
