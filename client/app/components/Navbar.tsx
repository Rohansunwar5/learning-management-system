"use client";

import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/app/utils/cn";
import Link from "next/link";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
// import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { HiOutlineUserCircle } from "react-icons/hi2";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
};

const Navbar = ({ className, open, setOpen, activeItem }: Props & { className?: string }) => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <Link href={'/'}>
          <MenuItem setActive={setActive} active={active} item="Home"></MenuItem>
        </Link>
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
        <Link href={'/about'}>
          <MenuItem setActive={setActive} active={active} item="About">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/courses">FAQ</HoveredLink>
            <HoveredLink href="/courses">Policy</HoveredLink>
            <HoveredLink href="/courses">Our Team</HoveredLink>
            <HoveredLink href="/courses">Contact Us</HoveredLink>
          </div>
          </MenuItem>
        </Link>
        {/* <Link href={'/policy'}>
          <MenuItem setActive={setActive} active={active} item="Policy"></MenuItem>
        </Link> */}
        {/* <Link href={'/faq'}>
          <MenuItem setActive={setActive} active={active} item="FAQ"></MenuItem>
        </Link> */}
        <HiOutlineUserCircle
          size={25}
          className="cursor-pointer dark:text-white text-black"
          onClick={() => setOpen(true)} // Toggle the open state
        />
        <ThemeSwitcher />
        {/* only for mobile */}
        {/* <div className="80px:hidden">
            <HiOutlineMenuAlt3 
              size={25}
              className="cursor-pointer dark:text-white text-black"
              onClick={() => setOpenSider(true)}
            />
          </div> */}
      </Menu>
    </div>
  );
};

export default Navbar;
