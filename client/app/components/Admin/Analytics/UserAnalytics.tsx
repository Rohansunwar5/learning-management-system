import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";

type Props = {
  isDashboard?: boolean;
};
// const analyticsData = [
//   { name: "January 2023", count: 400 },
//   { name: "February 2023", count: 350 },
//   { name: "March 2023", count: 420 },
//   { name: "April 2023", count: 380 },
//   { name: "May 2023", count: 410 },
//   { name: "June 2023", count: 390 },
//   { name: "July 2023", count: 450 },
//   { name: "August 2023", count: 480 },
//   { name: "September 2023", count: 500 },
//   { name: "October 2023", count: 520 },
//   { name: "November 2023", count: 480 },
// ];

const UserAnalytics = ({ isDashboard }: Props) => {
  const { data, isLoading } = useGetUsersAnalyticsQuery({});

  const analyticsData: any = [];

  data &&
    data.users.last12Months.forEach((item: any) => {
      analyticsData.push({ name: item.month, count: item.count });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className={`${
            !isDashboard
              ? "mt-[50px]"
              : "mt-[50px] dark:bg-[#111C43] shadow-sm pb-5 rounded-sm"
          } pl-10`}
        >
          <div className={`${isDashboard ? "!ml-8 mb-5" : ""}`}>
            <h1
              className={`${styles.title} ${
                isDashboard && "!text-[20px]"
              } px-5 !text-start`}
            >
              User Analytics
            </h1>
            {!isDashboard && (
              <p className={`${styles.label} px-5`}>
                Last 12 months analytics data{" "}
              </p>
            )}
          </div>
          <div
            className={`w-full ${
              isDashboard ? "h-[30vh]" : "h-screen"
            } flex items-center justify-center`}
          >
            <ResponsiveContainer
              width={isDashboard ? "100%" : "90%"}
              height={!isDashboard ? "50%" : "100%"}
            >
              <AreaChart
                data={analyticsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#4d62d49"
                  fill="#4d62d9"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAnalytics;
