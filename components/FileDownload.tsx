import React from 'react'

const FileDownload = ({ displayName, fileUrl }: { displayName: string; fileUrl: string }) => {
  const trimmedUrl = fileUrl.replace(/\/$/, '')
  const fileName = trimmedUrl.substring(trimmedUrl.lastIndexOf('/') + 1)
  console.log('fileName', fileName)
  return (
    <a
      href={fileUrl}
      download={fileName}
      className="my-2 flex max-w-sm items-center rounded-lg border-2 border-gray-900 bg-transparent p-3 text-primary-500 no-underline hover:text-primary-600 dark:hover:text-primary-400"
    >
      <div className="">
        <p className="m-0 text-sm font-medium">{fileName}</p>
        <p className="m-0 text-2xl font-bold">{displayName}</p>
      </div>
    </a>
  )
}

export default FileDownload
