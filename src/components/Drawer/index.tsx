import React, { useEffect, useState } from 'react'

import { Add as AddIcon } from 'iconsax-react'
import { Button } from '@nextui-org/react'
import Image from 'next/image'

type DrawerType = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  width?: string
  children?: React.ReactNode
  onClose?: any
  header: React.ReactNode
  position?: string
}

const Drawer: React.FC<DrawerType> = ({
  isOpen,
  setIsOpen,
  children,
  onClose,
  header,
  position,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.nativeEvent) {
        event.nativeEvent.stopImmediatePropagation()
      }
      if (event.key === 'Escape') {
        onClose ? onClose() : setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      className={`${
        isOpen ? (position ? position : 'translate-y-[50%]') : 'translate-y-[100%]'
      }  fixed bottom-0 right-0 top-0 z-10 flex w-full flex-col bg-white transition`}
    >
      <div className='flex items-center justify-between p-4'>
        {header}
        <Button isIconOnly onClick={() => setIsOpen(false)} className='bg-transparent'>
          <AddIcon className='rotate-45 text-base-black-1' />
        </Button>
      </div>
      <div className='overflow-y-auto max-h-[450px] min-h-[400px] px-4'>{children}</div>
    </div>
  )
}

export default Drawer
