import React from 'react'
import AccountSidebar from '../components/accountSidebar'
import Breadcrumb from '../components/breadcrumb'
import Dropdown from '../components/dropdown'

const AccountSidebarLayout:React.FC<{children:React.ReactNode}> = ({children}) => {
  return (
    <div className="bg-gray-100">
      <Breadcrumb />
      <div className="container py-14">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 bg-white md:col-span-4 h-max" >
            <AccountSidebar />
          </div>
          <div className="col-span-12 bg-white md:col-span-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSidebarLayout