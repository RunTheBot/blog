import React from 'react'

const DownloadList = ({ children }: { children: React.ReactElement | React.ReactElement[] }) => {
  return <div className="grid grid-flow-row grid-cols-2 gap-4">{children}</div>
}
export default DownloadList
