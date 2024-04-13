"use client";
import React from "react";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import Heading from "../../../app/utils/Heading";
import CreateCourse from "../../components/Admin/Course/CreateCourse";
import DashboardHeader from "@/app/components/Admin/DashboardHeader";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Heading
        title="Eduception -admin"
        description="Eduception is a innovative learning platform for students to lern and get help from their course mentors"
        keywords="Programming, MERN, React, Nextjs, Maching Lerning/AI"
      />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHeader />
          <CreateCourse />
        </div>
      </div>
    </div>
  );
};

export default page;
