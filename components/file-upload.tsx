'use client'

import { X } from "lucide-react"
import Image from "next/image";

import React from 'react'
import { UploadDropzone } from '@/lib/uploadthing';
import "@uploadthing/react/styles.css"

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage"
}

const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if(value&&fileType !== "pdf"){
    return(
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="round-full"
        />
        <button 
          onClick={( )=> onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
        > 
          <X className="w-4 h-4"/>
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  )
}

export default FileUpload