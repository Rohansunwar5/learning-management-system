"use client";
import React, { FC, useState } from "react";
import Protected from "../hooks/useProtected";
import Heading from "../utils/Heading";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile/Profile";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";

type Props = {};

const Page: FC<Props> = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(3);
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: any) => state.auth);

  return (
    <div className="min-h-screen">
      <Protected>
        {" "}
        {/* checking if the user is authenticated before redirecting to the profile page*/}
        <Heading
          title={`${user?.name} profile - Eduception`}
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
          <Profile user={user} />
        </div>
        <Footer />
      </Protected>
    </div>
  );
};

export default Page;
