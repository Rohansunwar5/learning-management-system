"use client";

import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/app/utils/cn";
import Link from "next/link";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineUserCircle } from "react-icons/hi2";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/global/avatar.png";
import { useSession } from "next-auth/react";
import {
  useLogOutQuery,
  useSocailAuthMutation,
} from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Navbar = ({
  className,
  open,
  setOpen,
  setRoute,
  activeItem,
  route,
}: Props & { className?: string }) => {
  const [active, setActive] = useState<string | null>(null);
  const { user } = useSelector((state: any) => state.auth); // getting logged in user data
  const {
    data: userData,
    isLoading,
    refetch,
  } = useLoadUserQuery(undefined, {});
  const { data } = useSession(); //for social authentication
  const [socialAuth, { isSuccess, error }] = useSocailAuthMutation();
  const [logout, setLogout] = useState(false);
  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!userData) {
        if (data) {
          socialAuth({
            email: data?.user?.email,
            name: data?.user?.name,
            avatar: data.user?.image,
          });
        }
      }
      if (data === null) {
        if (isSuccess) {
          toast.success("Login Successfull");
        }
      }
      if (data === null && !isLoading && !userData) {
        // when session is removed
        setLogout(true);
      }
    }
  }, [data, isLoading, userData]);

  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <Link href={"/"}>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Home"
          ></MenuItem>
        </Link>
        <Link href={"/courses"}>
          <MenuItem setActive={setActive} active={active} item="Courses">
            <div className="  text-sm grid grid-cols-2 gap-10 p-4">
              <ProductItem
                title="Mern Stack"
                href="https://algochurn.com"
                src="https://assets.aceternity.com/demos/algochurn.webp"
                description="Prepare for tech interviews like never before."
              />
              <ProductItem
                title="Tailwind Master"
                href="https://tailwindmasterkit.com"
                src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
                description="Production ready Tailwind css components for your next project"
              />
              <ProductItem
                title="Advance JavaScript"
                href="https://gomoonbeam.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
                description="Never write from scratch again. Go from idea to blog in minutes."
              />
              <ProductItem
                title="Scaling large projects "
                href="https://userogue.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
                description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
              />
            </div>
          </MenuItem>
        </Link>
        <Link href={"/about"}>
          <MenuItem setActive={setActive} active={active} item="About">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/faq">FAQ</HoveredLink>
              <HoveredLink href="/courses">Policy</HoveredLink>
              <HoveredLink href="/courses">Our Team</HoveredLink>
              <HoveredLink href="/courses">Contact Us</HoveredLink>
            </div>
          </MenuItem>
        </Link>
        {userData ? (
          <Link href={"/profile"}>
            <Image
              src={userData.avatar ? userData.avatar.url : avatar}
              alt=""
              width={30}
              height={30}
              className="w-[30px] h-[30px] rounded-full cursor-pointer"
              style={{
                border: activeItem === 3 ? "2px solid #37a39a" : "none",
              }}
            />
          </Link>
        ) : (
          <HiOutlineUserCircle
            size={25}
            className=" 800px:block cursor-pointer dark:text-white text-black"
            onClick={() => setOpen(true)}
          />
        )}
        <ThemeSwitcher />
      </Menu>
      {route === "Login" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
              refetch={refetch}
            />
          )}
        </>
      )}
      {route === "Sign-Up" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
        </>
      )}
      {route === "Verification" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Navbar;
