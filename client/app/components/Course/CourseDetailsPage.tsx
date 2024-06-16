import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Navbar from "../Navbar";
import CourseDetails from "./CourseDetails";
import Footer from "../Footer";
import {
  useCreatePaymentIntentMutation,
  useGetStripePublishablekeyQuery,
} from "@/redux/features/orders/ordersApi";
import { loadStripe } from "@stripe/stripe-js";

type Props = {
  id: string;
};

const CourseDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { data, isLoading } = useGetCourseDetailsQuery(id);
  const { data: config } = useGetStripePublishablekeyQuery({});
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [createPaymentIntent, { data: paymentIntentData }] =
    useCreatePaymentIntentMutation({});

  useEffect(() => {
    if (config) {
      const publishablekey = config?.publishableKey;
      setStripePromise(loadStripe(publishablekey));
    }
    if (data) {
      const amount = Math.round(data.course.price * 100);
      createPaymentIntent(amount);
    }
  }, [config, data]);

  useEffect(() => {
    if (paymentIntentData) {
      setClientSecret(paymentIntentData?.client_secret);
    }
  }, [paymentIntentData]);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      // Scrolling down
      setShowNavbar(false);
    } else {
      // Scrolling up
      setShowNavbar(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data.course.name + "- Eduception"}
            description={
              "Eduception is an education platform which aims to provide quality education resources and courses for students."
            }
            keywords={data?.course?.tags}
          />
          {showNavbar && (
            <Navbar
              route={route}
              setRoute={setRoute}
              open={open}
              setOpen={setOpen}
              activeItem={1}
            />
          )}
          {stripePromise && (
            <CourseDetails
              data={data.course}
              setRoute={setRoute}
              setOpen={setOpen}
              stripePromise={stripePromise}
              clientSecret={clientSecret}
            />
          )}
          <Footer />
        </div>
      )}
    </>
  );
};

export default CourseDetailsPage;
