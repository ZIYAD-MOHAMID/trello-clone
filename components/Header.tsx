'use client'
import React from 'react'
import Image from 'next/image'
import {MagnifyingGlassCircleIcon, UserCircleIcon} from '@heroicons/react/24/solid'
import Avatar from 'react-avatar'

import { useBoardStore } from '@/store/BordStore'

function Header() {
  const [serchString, setSerchString] = useBoardStore((state) => [
    state.serchString,
    state.setSerchString,
  ])

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div
          className="
            absolute
            top-0
            left-0
            w-full
            h-96
            bg-gradient-to-br
            from-pink-400
            to-[#0055dd]
            rounded-md
            filter
            blur-3xl
            opacity-50
            -z-50
          "
        />
        <Image
          src='https://links.papareact.com/c2cdd5'
          alt='Trello logo'
          width={300}
          height={100}
          className='w-44 md:w-56 pd-10 bd:pd-0 object-contain '
        />
        <div className='flex items-center center space-x-5 flex-1 justify-end w-full'>
          <form className='flex items-conter space-x-5 bg-white p-2 shadow-md flex-1 md:flex-initial'>
            <MagnifyingGlassCircleIcon className='h-6 w-6 text-gray-400 '/>
            <input type="text" className='flex-1 outline-none' value={serchString} onChange={e => setSerchString(e.target.value)} placeholder='Search..'/>
            <button type='submit' hidden> Search</button>
          </form>
          <Avatar name='Ziad Mohamed' round color='#0055dd' size='50' />
        </div>
      </div>
      <div className="flex items-center justify-center px-5 md:py-5">
        <p className="flex items-center text-sm p-2 font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055dd]" >
          <UserCircleIcon className="inline-block h-10 w-10 text-[#0055dd] mr-1" />
          GPT is sumarising your tasks for the day...
        </p>
      </div>
    </header>
  )
}

export default Header
