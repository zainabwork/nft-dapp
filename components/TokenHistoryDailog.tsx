"use client"
import React from 'react';
import { useEffect } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomDialog: React.FC<Props> = ({ isOpen, onClose, children }) => {
  
    useEffect(() => {
        if (isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'unset';
        }
      }, [isOpen]);

    return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
  {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
  <AlertDialogContent className='bg-black text-black rounded-xl overflow-y-auto'>
    <AlertDialogHeader>
      <AlertDialogTitle className="text-white text-left">Ownership History:</AlertDialogTitle>
      <AlertDialogDescription className='overflow-y-auto w-full'>
        {children}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter className=''>
      <AlertDialogCancel className='w-20'>Cancel</AlertDialogCancel>
      {/* <AlertDialogAction>Continue</AlertDialogAction> */}
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

  );
};

export default CustomDialog;
