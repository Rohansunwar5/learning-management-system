"use client";

import React from "react";
import Heading from "../../utils/Heading";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import AdminProtected from "../../hooks/adminProtected";
import DashboardHero from "../../components/Admin/DashboardHero";
import EditFaq from "../../components/Admin/Customization/EditFaq";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Eduception - Admin"
          description="Eduception is an online learning platform to help students"
          keywords="Programming, Mern, Redux, Machine Learning"
        />
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <EditFaq />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;