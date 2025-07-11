"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, X, CheckSquare, Bell, Search, Settings, LogOut, UserCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export function Navbar({ onSearch }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const profileRef = useRef(null)
  const navigate = useNavigate()
  // Close the profile dropdown when clicking outside
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedData = JSON.parse(userData); // Convert JSON string to object
      const id = parsedData.id; // Access the id
      // featch user data from api using id
      fetch(`https://task-manage-server-nine.vercel.app/user/${id}`)
        .then(response => response.json())
        .then(data => {
          setUser(data);
        })
        .catch(error => console.error('Error fetching user data:', error));

    }
  }, []);


  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileRef])

  // const handleSearch = (e) => {
  //   setSearchQuery(e.target.value)
  //   onSearch(e.target.value)
  // }
  const handleLogOut = () => {
    // Add your logout logic here
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
    // navigate('/login')
    setIsProfileOpen(false)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="flex items-center">
                <CheckSquare className="h-6 w-6 text-[#7BC86C]" />
                <span className="ml-2 text-xl font-bold text-gray-900">TaskBoard</span>
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                href="/"
                className="border-[#7BC86C] text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </a>
              {/* <a
                href="/projects"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Projects
              </a>
              <a
                href="/calendar"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Calendar
              </a>
              <a
                href="/reports"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Reports
              </a> */}
            </div>
          </div>

          {/* Search bar - hidden on mobile */}
          {/* <div className="hidden md:flex items-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="pl-10 w-full rounded-md border border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-[#7BC86C] focus:border-[#7BC86C]"
                type="search"
                placeholder="Search tasks..."
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div> */}

          {/* Right side icons and profile */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7BC86C] relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button> */}

            {user ? (
              <div className="ml-3 relative" ref={profileRef}>
                <div>
                  <button
                    type="button"
                    className="flex items-center max-w-xs rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7BC86C]"
                    id="user-menu-button"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="true"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-10 w-10 rounded-full bg-[#8A75C9] flex items-center justify-center text-white">
                      <span className="text-xs font-medium">
                        {(() => {
                          const name = user?.name || "";
                          const parts = name.trim().split(" ");
                          const first = parts[0]?.charAt(0).toUpperCase() || "";
                          const last = parts[1]?.charAt(0).toUpperCase() || "";
                          return first + last;
                        })()}
                      </span>
                    </div>

                  </button>
                </div>

                {/* Profile dropdown */}
                {isProfileOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.country}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    {/* <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <UserCircle className="mr-3 h-4 w-4 text-gray-500" />
                    Your Profile
                  </a> */}
                    {/* <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <Settings className="mr-3 h-4 w-4 text-gray-500" />
                    Settings
                  </a> */}
                    <div
                      onClick={handleLogOut}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-gray-500" />
                      Sign out
                    </div>
                  </div>
                )}
              </div>) : (
              <Link to="/login">
                <button className="px-4 py-2 bg-[#8A75C9] text-white rounded hover:bg-[#7a65b5] transition">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#7BC86C]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden m-2">
          <div className="pt-2 pb-3 space-y-1">
            <a
              href="/"
              className="bg-[#7BC86C] bg-opacity-10 border-[#7BC86C] rounded text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Dashboard
            </a>
            {/* <a
              href="/projects"
              className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Projects
            </a>
            <a
              href="/calendar"
              className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Calendar
            </a>
            <a
              href="/reports"
              className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Reports
            </a> */}
          </div>

          {/* Mobile search */}
          {/* <div className="pt-2 pb-3 px-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="pl-10 w-full rounded-md border border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-[#7BC86C] focus:border-[#7BC86C]"
                type="search"
                placeholder="Search tasks..."
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div> */}

          {/* Mobile profile section */}
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-[#8A75C9] flex items-center justify-center text-white">
                    <span className="text-xs font-medium">
                      {(() => {
                        const name = user?.name || "";
                        const parts = name.trim().split(" ");
                        const first = parts[0]?.charAt(0).toUpperCase() || "";
                        const last = parts[1]?.charAt(0).toUpperCase() || "";
                        return first + last;
                      })()}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.country}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
                {/* <button
               type="button"
               className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7BC86C] relative"
             >
               <Bell className="h-5 w-5" />
               <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
             </button> */}
              </div>
              <div className="mt-3 space-y-1">
                {/* <a
                  href="/profile"
                  className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  <UserCircle className="mr-3 h-5 w-5 text-gray-500" />
                  Your Profile
                </a> */}
                {/* <a
                  href="/settings"
                  className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  <Settings className="mr-3 h-5 w-5 text-gray-500" />
                  Settings
                </a> */}
                <div
                   onClick={handleLogOut}
                  className="flex items-center cursor-pointer px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-500" />
                  Sign out
                </div>
              </div>
            </div>) : (
            <Link to="/login" >
              <button className="px-4 block w-full py-2 bg-[#8A75C9] text-white rounded hover:bg-[#7a65b5] transition mb-5">
                Login
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
