'use client'
import React,{FC, useState} from 'react'
import Protected from '../hooks/useProtected'
import Heading from '../utils/Heading'
import Navbar from '../components/Navbar'
import Profile from "../components/Profile/Profile";
import { useSelector } from 'react-redux'

type Props = {}

const page:FC<Props>= (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem,setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  const {user} = useSelector((state:any) => state.auth)

  return (
    <div>
     <Protected>   {/* checking if the user is authenticated before redirecting to the profile page*/}
     <Heading
        title={`${user?.name} profile`}
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
      <Profile 
        user={user}
      />

     </Protected>
    </div>
  )
}

export default page