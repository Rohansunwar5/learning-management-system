'use client'

import React,{FC, useState} from 'react'
import Heading from './utils/Heading'
import Header from './components/Header'

interface Props{}

const page:FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem,setActiveItem] = useState(0);
  return (
    <div>
      <Heading 
        title='Eduception'
        description='Eduception is a innovative learning platform for students to lern and get help from their course mentors'
        keywords='Programming, MERN, React, Nextjs, Maching Lerning/AI'
      />
      <Header 
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
      />
    </div>
  )
}

export default page
