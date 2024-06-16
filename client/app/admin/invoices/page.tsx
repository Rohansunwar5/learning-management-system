"use client";

import React, { FC } from "react";
// import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import OrderAnalytics from "../../components/Admin/Analytics/OrderAnalytics";
import AllInvoices from "@/app/components/Admin/Order/AllInvoices";

type Props = {};

const pages = (props: Props) => {
  return (
    <div>
      <Heading
        title="Eduception"
        description="Eduception is a innovative learning platform for students to lern and get help from their course mentors"
        keywords="Programming, MERN, React, Nextjs, Maching Lerning/AI"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHero />
          <AllInvoices />
        </div>
      </div>
    </div>
  );
};

export default pages;
