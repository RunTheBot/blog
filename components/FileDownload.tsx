import React from 'react'
import { FaFileDownload } from 'react-icons/fa'

const FileDownload = ({ displayName, fileUrl }: { displayName: string; fileUrl: string }) => {
  const trimmedUrl = fileUrl.replace(/\/$/, '')
  const fileName = trimmedUrl.substring(trimmedUrl.lastIndexOf('/') + 1)
  // console.log('fileName', fileName)
  return (
    <a
      href={fileUrl}
      download={fileName}
      className="flex max-w-sm items-center rounded-lg border-2 border-gray-900 bg-transparent p-3 text-primary-500 no-underline transition-all hover:text-primary-600 dark:hover:text-primary-400"
    >
      <FaFileDownload className="mr-4 text-4xl" />
      <div className="flex flex-col">
        <p className="m-0 text-sm font-medium">{fileName}</p>
        <p className="m-0 text-2xl font-bold">{displayName}</p>
      </div>
    </a>
  )
}

export default FileDownload
