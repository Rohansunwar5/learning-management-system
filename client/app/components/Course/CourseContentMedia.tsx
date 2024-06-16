import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import {
  useAddAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyInReviewMutation,
  useAddReviewInCourseMutation,
  useGetCourseDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import Image from "next/image";
import { format } from "timeago.js";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import Ratings from "@/app/utils/Ratings";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  data: any;
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: any;
  refetch: any;
};

const CourseContentMedia = ({
  data,
  id,
  activeVideo,
  setActiveVideo,
  user,
  refetch,
}: Props) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [isReviewReply, setIsReviewReply] = useState(false);
  const [reply, setReply] = useState("");
  const [reviewId, setReviewId] = useState("");

  const [
    addNewQuestion,
    { isSuccess, error, isLoading: questionCreationLoading },
  ] = useAddNewQuestionMutation();

  const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(
    id,
    { refetchOnMountOrArgChange: true }
  );

  const course = courseData?.course;

  const [
    addReplyInReview,
    {
      isSuccess: replySuccess,
      error: replyError,
      isLoading: replyCreationLoading,
    },
  ] = useAddReplyInReviewMutation();

  const [
    addReviewInCourse,
    {
      isSuccess: reviewSuccess,
      error: reviewError,
      isLoading: reviewCreationLoading,
    },
  ] = useAddReviewInCourseMutation();

  const [
    addAnswerInQuestion,
    {
      isSuccess: answerSuccess,
      error: answerError,
      isLoading: answerCreationLoading,
    },
  ] = useAddAnswerInQuestionMutation();

  const isReviewExists = course?.reviews?.find(
    (item: any) => item.user._id === user._id
  );

  const handleQuestion = () => {
    if (question.length === 0) {
      toast.error("Questions can't be empty");
    } else {
      addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]._id,
      });
    }
  };

  const handleAnswerSubmit = () => {
    addAnswerInQuestion({
      answer,
      courseId: id,
      contentId: data[activeVideo]._id,
      questionId: questionId,
    });
  };

  const handleReviewSubmit = async () => {
    if (review.length === 0) {
      toast.error("Review can't be empty");
    } else {
      addReviewInCourse({ review, rating, courseId: id });
    }
  };

  const handleReviewReplySubmit = () => {
    if (!replyCreationLoading) {
      if (reply === "") {
        toast.error("Reply can't be empty");
      } else {
        addReplyInReview({ comment: reply, courseId: id, reviewId });
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
      refetch();

      toast.success("Question added successfully");
      socketId.emit("notification", {
        title: "New Question Recieved ",
        message: `You have a new question in ${data[activeVideo].title}`,
        userId: user._id,
      });
    }
    if (answerSuccess) {
      setAnswer("");
      refetch();
      toast.success("Answer added successfully");
      if (user.role === "admin") {
        socketId.emit("notification", {
          title: "New Reply Recieved ",
          message: `You have a new question in ${data[activeVideo].title}`,
          userId: user._id,
        });
      }
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage?.data?.message);
      }
    }
    if (answerError) {
      if ("data" in answerError) {
        const errorMessage = error as any;
        toast.error(errorMessage?.data?.message);
      }
    }
    if (reviewSuccess) {
      setReview("");
      setRating(1);
      courseRefetch();
      toast.success("Review added successfully");
      socketId.emit("notification", {
        title: "New Question Recieved ",
        message: `You have a new question in ${data[activeVideo].title}`,
        userId: user._id,
      });
    }

    if (reviewError) {
      if ("data" in reviewError) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
    if (replySuccess) {
      setReply("");
      courseRefetch();
      toast.success("Reply added successfully");
    }
    if (replyError) {
      if ("data" in replyError) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [
    isSuccess,
    error,
    answerError,
    answerSuccess,
    reviewSuccess,
    reviewError,
    replyError,
    replySuccess,
  ]);

  return (
    <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
      <CoursePlayer
        title={data[activeVideo]?.title}
        videoUrl={data[activeVideo]?.videoUrl}
      />
      <div className="w-full flex items-center justify-between my-3">
        <div
          className={`${styles.button} !w-[unset] !min-h-[40px] !py-[unset] ${
            activeVideo === 0 && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
          }
        >
          <AiOutlineArrowLeft className="ml-2" />
          Prev Lesson
        </div>
        <div
          className={`${styles.button} !w-[unset] !min-h-[40px] !py-[unset] ${
            data.length - 1 === activeVideo && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(
              data && data.length - 1 === activeVideo
                ? activeVideo
                : activeVideo + 1
            )
          }
        >
          Next Lesson
          <AiOutlineArrowRight className="ml-2" />
        </div>
      </div>
      <h1 className="dark:text-white text-black pt-2 text-[25px] font-[600]">
        {data[activeVideo].title}
      </h1>
      <br />
      <div className="w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
          <h5
            key={index}
            className={`800px:text-[20px]  cursor-pointer ${
              activeBar == index ? "text-red-500" : "dark:text-white text-black"
            }`}
            onClick={() => setActiveBar(index)}
          >
            {text}
          </h5>
        ))}
      </div>
      <br />
      {activeBar === 0 && (
        <p className="dark:text-white text-black text-[18px] whitespace-pre-line mb-3">
          {data[activeVideo]?.description}
        </p>
      )}
      {activeBar === 1 && (
        <div>
          {data[activeVideo]?.links.map((item: any, index: number) => (
            <div className="mb-5" key={index}>
              <h2 className="800px:text-[20px] 800px:inline-block dark:text-white text-black">
                {item.title && item.title + " :"}
              </h2>
              <a
                className="inline-block text-[#4395c4] 800px:text-[20px] 800px:pl-2"
                href={item.url}
              >
                {item.url}
              </a>
            </div>
          ))}
        </div>
      )}

      {activeBar === 2 && (
        <>
          <div className="flex w-full">
            <Image
              src={
                user.avatar
                  ? user.avatar.url
                  : "https://res.cloudinary.com/drxtkystg/image/upload/v1707845624/samples/man-portrait.jpg"
              }
              width={50}
              height={50}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <textarea
              name=""
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              id=""
              cols={40}
              rows={5}
              placeholder="Write your question...."
              className="outline-name bg-transparent ml-3 border dark:text-white text-black border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins"
            ></textarea>
          </div>
          <div className="w-full flex justify-end">
            <div
              className={`${
                styles.button
              } !w-[120px] !h-[40px] text-[18px] mt-5 ${
                questionCreationLoading && "cursor-not-allowed"
              }`}
              onClick={questionCreationLoading ? () => {} : handleQuestion}
            >
              Submit
            </div>
          </div>
          <div className="w-full rounded-xl h-[1px] bg-[#8f8f8f3b]"></div>
          <CommentReply
            data={data}
            activeVideo={activeVideo}
            answer={answer}
            setAnswer={setAnswer}
            handleAnswerSubmit={handleAnswerSubmit}
            user={user}
            setQuestionId={setQuestionId}
            answerCreationLoading={answerCreationLoading}
          />
          <br />
        </>
      )}

      {activeBar === 3 && (
        <div className="w-full">
          <>
            {!isReviewExists && (
              <>
                <div className="flex w-full">
                  <Image
                    src={
                      user.avatar
                        ? user.avatar.url
                        : "https://res.cloudinary.com/drxtkystg/image/upload/v1707845624/samples/man-portrait.jpg"
                    }
                    width={50}
                    height={50}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                  <div className="w-full">
                    <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black">
                      Give a Rating <span className="text-red-500"> ⭐ </span>
                    </h5>
                    <div className="flex w-full ml-2 pb-3">
                      {[1, 2, 3, 4, 5].map((i) =>
                        rating >= i ? (
                          <AiFillStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiOutlineStar
                            key={i}
                            className="mr-1 cursor-pointer"
                            color="rgb(246,186,0)"
                            size={25}
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                    </div>
                    <textarea
                      name=""
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      id=""
                      cols={40}
                      rows={5}
                      placeholder="Write your Review...."
                      className="outline-name bg-transparent ml-3 border border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins dark:text-white text-black"
                    ></textarea>
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <div
                    className={`${
                      styles.button
                    } !w-[120px] !h-[40px] text-[18px] mt-5 800px:mr-0 mr-2 ${
                      reviewCreationLoading && "cursor-no-drop"
                    }`}
                    onClick={
                      reviewCreationLoading ? () => {} : handleReviewSubmit
                    }
                  >
                    Submit
                  </div>
                </div>
              </>
            )}
            <br />
            <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
            <div className="w-full">
              {(course?.reviews && [...course.reviews].reverse()).map(
                (item: any, index: number) => (
                  <div className="w-full my-5" key={index}>
                    <div className="w-full flex">
                      <div>
                        <Image
                          src={
                            item.user.avatar
                              ? item.user.avatar.url
                              : "https://res.cloudinary.com/drxtkystg/image/upload/v1707845624/samples/man-portrait.jpg"
                          }
                          width={50}
                          height={50}
                          alt=""
                          className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-2 dark:text-white text-black">
                        <h1 className="text-[18px]">{item?.user.name}</h1>
                        <Ratings rating={item.rating} />
                        <p>{item.comment}</p>
                        <small className="text-[#ffffff83]">
                          {format(item.createdAt)} •
                        </small>
                      </div>
                    </div>
                    {user.role === "admin" &&
                      item.commmentReplies.length === 0 && (
                        <span
                          className={`${styles.label} !ml-12 cursor-pointer`}
                          onClick={() => {
                            setIsReviewReply(true);
                            setReviewId(item._id);
                          }}
                        >
                          Add Reply
                        </span>
                      )}
                    {isReviewReply && reviewId === item._id && (
                      <div className="w-full flex relative dark:text-white text-black">
                        <input
                          type="text"
                          placeholder="Enter your reply..."
                          value={reply}
                          onChange={(e: any) => setReply(e.target.value)}
                          className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#fff] p-[5px] w-[95%]"
                        />
                        <button
                          type="submit"
                          className="dark:text-white text-black absolute right-0 bottom-1"
                          onClick={handleReviewReplySubmit}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                    {item.commentReplies.map((i: any, index: number) => (
                      <div className="w-full flex 800px:ml-16 my-5" key={index}>
                        <div className="w-[50px] h-[50px]">
                          <Image
                            src={
                              i.user.avatar
                                ? i.user.avatar.url
                                : "https://res.cloudinary.com/drxtkystg/image/upload/v1707845624/samples/man-portrait.jpg"
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                        </div>
                        <div className="pl-2">
                          <div className="flex items-center dark:text-white text-black">
                            <h5 className="text-[20px]">{i.user.name}</h5>
                            {i.user.role === "admin" && (
                              <VscVerifiedFilled className="text-[#50c750] ml-2 text-[20px]" />
                            )}
                          </div>
                          <p className="dark:text-white text-black">
                            {i.comment}
                          </p>
                          <small className="text-[#ffffff83]">
                            {format(i.createdAt)} •
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </>
        </div>
      )}
    </div>
  );
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  setQuestionId,
  questionId,
  answerCreationLoading,
}: any) => {
  return (
    <>
      <div className="w-full my-3">
        {data[activeVideo].questions.map((item: any, index: any) => (
          <CommentItem
            key={index}
            data={data}
            activeVideo={activeVideo}
            item={item}
            index={index}
            answer={answer}
            questionId={questionId}
            setQuestionId={setQuestionId}
            handleAnswerSubmit={handleAnswerSubmit}
            setAnswer={setAnswer}
            answerCreationLoading={answerCreationLoading}
          />
        ))}
      </div>
    </>
  );
};

const CommentItem = ({
  setQuestionId,
  item,
  answer,
  setAnswer,
  handleAnswerSubmit,
  questionId,
  answerCreationLoading,
}: any) => {
  console.log(item);
  const [replyActive, setreplyActive] = useState(false);
  return (
    <>
      <div className="my-6">
        <div className="flex mb-2">
          <div className="m-2">
            <Image
              src={
                item.user.avatar
                  ? item.user.avatar.url
                  : "https://res.cloudinary.com/drxtkystg/image/upload/v1707845624/samples/man-portrait.jpg"
              }
              width={50}
              height={50}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </div>
          <div className="pl-3">
            <h5 className="text-[20px] dark:text-white text-black">
              {item.user.name}
            </h5>
            <p className="text-[#fffefe83]">{item.question}</p>
            <small className="text-[#fffefe83]">
              {!item.createdAt ? " " : format(item.createdAt)} •
            </small>
          </div>
        </div>
        <div className="w-full flex pl-20">
          <span
            className="800px:pl-16 text-black cursor-pointer mr-2 dark:text-[#ffffff83]"
            onClick={() => {
              setreplyActive(!replyActive), setQuestionId(item._id);
            }}
          >
            {!replyActive
              ? item.questionReplies.length !== 0
                ? "All Replies"
                : "Add Reply"
              : "Hide Replies"}
          </span>
          <div className="pt-1">
            <BiMessage size={20} className="cursor-pointer" fill="#ffffff83" />
          </div>
          <span className="pl-2 pt-1 mt-[-4px] cursor-pointer text-[#ffffff83] ">
            {item.questionReplies?.length}
          </span>
        </div>
        {replyActive && questionId === item._id && (
          <>
            {item.questionReplies.map((item: any, index: number) => (
              <div
                className="w-full flex 800px:ml-16 my-5 text-black dark:text-white"
                key={index}
              >
                <div>
                  <Image
                    src={
                      item.user.avatar
                        ? item.user.avatar.url
                        : "https://res.cloudinary.com/drxtkystg/image/upload/v1707845624/samples/man-portrait.jpg"
                    }
                    width={50}
                    height={50}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                </div>
                <div className="pl-2">
                  <div className="flex items-center">
                    <h5 className="text-[20px]">{item.user.name}</h5>
                    {item.user.role === "admin" && (
                      <VscVerifiedFilled className="text-[#50c750] ml-2 text-[20px]" />
                    )}
                  </div>
                  <p>{item.answer}</p>
                  <small className="text-[#ffffff83]">
                    {format(item.createdAt)} •
                  </small>
                </div>
              </div>
            ))}
            <div className="w-full flex relative">
              <input
                type="text"
                placeholder="Enter your reply..."
                value={answer}
                onChange={(e: any) => setAnswer(e.target.value)}
                className={`block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#00000027] dark:text-white text-black dark:border-[#fff] p-[5px] w-[85%] ${
                  answer === "" ||
                  (answerCreationLoading && "cursor-not-allowed")
                }`}
              />
              <button
                type="submit"
                className="dark:text-white text-black absolute right-8 bottom-1"
                onClick={handleAnswerSubmit}
                disabled={answer === "" || answerCreationLoading}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
//TODO FIX THE REPLY
export default CourseContentMedia;
