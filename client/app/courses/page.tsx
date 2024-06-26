"use client";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import React, { FC, Suspense, useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import { Header } from "../components/ui/hero-parallax";
import Navbar from "../components/Navbar";
import Heading from "../utils/Heading";
import { styles } from "../styles/style";
import CourseCard from "../components/Course/CourseCard";
import Footer from "../components/Footer";

type Props = {};

const CoursesPage: FC<Props> = (props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (category === "All") {
      setCourses(data?.courses);
    }
    if (category !== "All") {
      setCourses(
        data?.courses.filter((item: any) => item.categories === category)
      );
    }
    if (search) {
      setCourses(
        data?.courses.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [data, category, search]);

  const categories = categoriesData?.LayoutData?.categories;

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Navbar
            open={open}
            route={route}
            setRoute={setRoute}
            setOpen={setOpen}
            activeItem={1}
          />
          <div className="min-h-screen">
            <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh] pt-20">
              <Heading
                title="Eduception"
                description="Eduception is a innovative learning platform for students to lern and get help from their course mentors"
                keywords="Programming, MERN, React, Nextjs, Maching Lerning/AI"
              />
              <br />
              <div className="w-full flex items-center flex-wrap pt-10">
                <div
                  className={`h-[35px] ${
                    category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
                  } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                  onClick={() => setCategory("All")}
                >
                  All
                </div>
                {categories &&
                  categories.map((item: any, index: number) => (
                    <div key={index}>
                      <div
                        className={`h-[35px] ${
                          category === item.title
                            ? "bg-[crimson]"
                            : "bg-[#5050cb]"
                        } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                        onClick={() => setCategory(item.title)}
                      >
                        {item.title}
                      </div>
                    </div>
                  ))}
              </div>
              {courses && courses.length === 0 && (
                <p
                  className={`${styles.label} justify-center min-h-[50vh] flex items-center`}
                >
                  {search
                    ? "No courses found!"
                    : "No courses found in this category. Please try another one! "}
                </p>
              )}
              <br />
              <br />
              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb:grid-cols-5 mb:gap-[45px]">
                {courses &&
                  courses.map((item: any, index: number) => (
                    <CourseCard item={item} key={index} />
                  ))}
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

const Page: FC<Props> = (props) => (
  <Suspense fallback={<Loader />}>
    <CoursesPage {...props} />
  </Suspense>
);

export default Page;
