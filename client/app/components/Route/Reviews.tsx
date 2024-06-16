import { styles } from "@/app/styles/style";
import { styled } from "@mui/material";
import Image from "next/image";
import React from "react";
import ReviewCard from "../Review/ReviewCard";

type Props = {};

export const reviews = [
  {
    name: "Jon Adams",
    avatar: "/avatar/1.png",
    profession: "Full Stack Developer | Ocens Ltd",
    comment:
      "This platform has provided me with valuable resources and insights, greatly enhancing my learning experience. I've discovered new techniques and gained practical knowledge that directly applies to my work as a Full Stack Developer. It's been an invaluable asset in my professional development journey.",
  },
  {
    name: "Emma Smith",
    avatar: "/avatar/2.png",
    profession: "Data Scientist | Quantum Analytics",
    comment:
      "I'm amazed by how much I've learned through this platform! It's been an indispensable tool for my professional growth. From advanced data analysis techniques to machine learning algorithms, I've acquired skills that have propelled my career as a Data Scientist. This platform is truly a game-changer.",
  },
  {
    name: "David Johnson",
    avatar: "/avatar/3.png",
    profession: "UX/UI Designer | PixelCraft Studios",
    comment:
      "I owe a lot to this platform; it's been invaluable for expanding my skillset and improving my design abilities. The UX/UI principles and best practices I've learned here have elevated the quality of my designs as a UX/UI Designer at PixelCraft Studios. It's an essential resource.",
  },
  {
    name: "Sophia Lee",
    avatar: "/avatar/4.png",
    profession: "Software Engineer | ByteTech Solutions",
    comment:
      "This platform is essential to me; I can't imagine my learning journey without it. It's my go-to resource for knowledge ",
  },
  {
    name: "Michael Brown",
    avatar: "/avatar/5.png",
    profession: "Cybersecurity Analyst | SecureNet Corp",
    comment:
      "Using this platform has transformed my approach to cybersecurity. It's been a game-changer, enhancing my skills significantly. The insights and techniques I've gained here have made me a more effective Cybersecurity Analyst at SecureNet Corp. This platform has truly shaped my professional development.",
  },
  {
    name: "Olivia Wilson",
    avatar: "/avatar/6.png",
    profession: "Machine Learning Engineer | Neural Systems Inc",
    comment:
      "The resources provided here have been instrumental in boosting my knowledge in machine learning. Highly valuable content! From fundamental concepts to advanced algorithms, I've deepened my understanding and practical skills. This platform has been indispensable in my journey as a Machine Learning Engineer.",
  },
  {
    name: "James Taylor",
    avatar: "/avatar/7.png",
    profession: "Frontend Developer | CodeSprint",
    comment:
      "The quality of content on this platform never fails to impress me. It's a constant source of inspiration and learning. From the latest frontend development trends to in-depth tutorials, I've gained valuable insights that have elevated my skills as a Frontend Developer at CodeSprint.",
  },
  {
    name: "Isabella Martinez",
    avatar: "/avatar/8.png",
    profession: "Product Manager | TechVision Ltd",
    comment:
      "Thanks to this platform, I've gained confidence in my skills as a product manager. It's been an empowering experience. From product strategy to stakeholder management, I've honed my abilities and grown as a leader. This platform has truly been a catalyst for my professional growth.",
  },
  {
    name: "William Anderson",
    avatar: "/avatar/9.png",
    profession: "DevOps Engineer | CloudOps Solutions",
    comment:
      "This platform has played a crucial role in my professional growth as a DevOps engineer. It's an indispensable resource. From infrastructure automation to cloud architecture, I've acquired essential skills that have advanced my career at CloudOps Solutions. This platform has been invaluable to me.",
  },
  {
    name: "Emily Thomas",
    avatar: "/avatar/10.png",
    profession: "Backend Developer | DataPulse Technologies",
    comment:
      "I've discovered invaluable insights here that I couldn't find elsewhere. It's been an enriching experience for me. From backend development best practices to database optimization techniques, I've expanded my knowledge and capabilities. This platform has been instrumental in my growth as a Backend Developer.",
  },
  {
    name: "Daniel Garcia",
    avatar: "/avatar/11.png",
    profession: "Software Architect | CodeCrafters Inc",
    comment:
      "Using this platform has been an excellent investment in my skills. It's helped me elevate my capabilities as a software architect. From architectural design patterns to scalability strategies, I've gained invaluable knowledge that has enhanced my role at CodeCrafters Inc. This platform is truly indispensable to me.",
  },
];

const Reviews = (props: Props) => {
  return (
    <div className="pt-20 w-full md:w-[90%] 800px:w-[85%] m-auto">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 w-full mb-6 md:mb-0">
          <Image
            src={require("../../../public/global/banner-1.png")}
            alt="business"
            width={700}
            height={700}
          />
        </div>
        <div className="md:w-1/2 w-full">
          <h3 className={`${styles.title} text-[40px]`}>
            We focus on quality{" "}
            <span className="text-purple-500">Check out</span> <br />
            what our users think About Us
          </h3>
          <p className={styles.label}>
            20+ reviews from industry experts and practitioners who have
            benefited from using our services.
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {reviews.map((item, index) => (
          <ReviewCard item={item} key={index} />
        ))}
      </div>
    </div>
  );
};
export default Reviews;
