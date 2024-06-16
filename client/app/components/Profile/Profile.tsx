"use client";
import React, { FC, useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogOutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import ProfileInfo from "../../components/Profile/ProfileInfo";
import ChangePassword from "./ChangePassword";
import { redirect } from "next/navigation";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import CourseCard from "../Course/CourseCard";

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);
  const [courses, setCourses] = useState([]);
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});

  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const logOutHandler = async () => {
    setLogout(true);
    await signOut();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  useEffect(() => {
    if (data) {
      const filteredCourses = user.courses
        .map((userCourse: any) =>
          data.courses.find((course: any) => course._id === userCourse._id)
        )
        .filter((course: any) => course !== undefined);

      setCourses(filteredCourses);
    }
  }, [data]);

  return (
    <div className="flex w-[85%] mx-auto">
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] border-[#00000053] rounded-[5px] shadow-xl dark:shadow-sm mt-[80px] mb-[80px] sticky ${
          scroll ? "top-[120px]" : "top-[30px]"
        } left-[30px]`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>
      <div className="flex flex-col w-full h-full bg-transparent mt-[80px]">
        {active === 1 && <ProfileInfo avatar={avatar} user={user} />}
        {active === 2 && <ChangePassword />}
        {active === 3 && (
          <div className="flex flex-col w-full h-full bg-transparent mt-[80px]">
            <div className="flex justify-center items-center w-full pl-7 px-2 800px:px-10 800px:pl-8">
              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-3 xl:gap-[35px]">
                {courses &&
                  courses.map((item: any, index: number) => (
                    <CourseCard item={item} key={index} isProfile={true} />
                  ))}
              </div>
              {courses.length === 0 && (
                <h1 className="text-center text-[18px] font-Poppins">
                  You don&apos;t have any purchased courses!
                </h1>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
