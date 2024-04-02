'use client'

import React,{FC, useState} from 'react'
import Heading from './utils/Heading'
import Navbar from './components/Navbar';
// import Hero from './components/Route/Hero';
import { HeroSection } from './components/Route/HeroSection';


interface Props{}

const page:FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem,setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  return (
    <div>
      <Heading 
        title='Eduception'
        description='Eduception is a innovative learning platform for students to lern and get help from their course mentors'
        keywords='Programming, MERN, React, Nextjs, Maching Lerning/AI'
      />
      <Navbar 
        open ={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <HeroSection />
    </div>
  )
}

export default page
