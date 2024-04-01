'use client'
import React,{FC, useState} from 'react'

type Props ={
  open:boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
}
const Header:FC<Props> = (props) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className='w-full relative'>
      Header
    </div>
  )
}

export default Header
