import React, { useState } from 'react'
import { ipcRenderer } from 'electron';
import { FaCloudUploadAlt } from "react-icons/fa";

function S3FileUpload() {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleUpload = () => {
    ipcRenderer.send('upload-file', {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET,
      bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
      region: import.meta.env.VITE_AWS_REGION // e.g., 'us-east-1'
    })
  }

  const tooltip = (
    <div className='w-1/12 bg-white text-right text-zip-dark opacity-50 mx-4'>
      <p>Upload to S3</p>
    </div>
  )

  return (
    <div className='relative flex flex-row justify-end mx-4 mt-4'>
      {showTooltip && tooltip}
      <FaCloudUploadAlt 
        className='cursor-pointer hover:text-zip-dark text-medium-gray transition-colors '
        size={25} 
        onClick={handleUpload}
        onMouseOver={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
    </div>
  )
}

export default S3FileUpload