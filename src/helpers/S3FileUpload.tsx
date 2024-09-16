import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron';
import { FaCloudUploadAlt, FaSpinner } from "react-icons/fa";

function S3FileUpload() {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<string>("")
  const [resultStyle, setResultStyle] = useState<string>("text-zip-dark")
  
  
  const handleUpload = async () => {
    setResultStyle('text-zip-dark')
    setIsUploading(true)
    setShowTooltip(false)
    setResult('Uploading...')
    ipcRenderer.send('upload-file', {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET,
      bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
      region: import.meta.env.VITE_AWS_REGION // e.g., 'us-east-1'
    })
  }

  useEffect(() => {
    ipcRenderer.on('upload-error', (event, arg) => {
      console.log('upload-error', arg)
      setIsUploading(false)
      setResult('Error uploading file. See console for details.')
      setResultStyle('text-cancel')
    })
    ipcRenderer.on('upload-success', (event, arg) => {
      console.log('upload-success', arg)
      setIsUploading(false)
      const dt = new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland', hour12: false });
      setResult(`Successfully uploaded at ${dt}`)
      setResultStyle('text-acceptable-green')
      setTimeout(() => {
        setResult('')
        setResultStyle('text-zip-dark')
      }, 5000)
    })

    return () => {
      ipcRenderer.removeAllListeners('upload-error')
      ipcRenderer.removeAllListeners('upload-success')
    }
  },[])

  return (
    <div className='relative flex flex-row justify-end mx-4 mt-4'>
      {showTooltip && (
        <div className={`w-2/12 bg-white text-right text-zip-dark opacity-50 mx-4`}>
          <p>Upload to S3</p>
        </div>
      )}
      {<p className={`${resultStyle} mx-4`}>{result}</p>}
      {isUploading && <FaSpinner className='animate-spin mx-2' color='#1986A4' size={25} />}
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