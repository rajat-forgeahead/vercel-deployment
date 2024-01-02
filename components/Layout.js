import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import DropdownLink from './DropdownLink';
import { useTheme } from 'next-themes';
export default function Layout({ title, children }) {
  const { data: session } = useSession();
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  useEffect(() => {
    console.log(session)
  }, [session]);

  const logoutClickHandler = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      <Head>
        <title>{title ? title + ' - Amazona' : 'Amazona'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            <Link href="/" className="text-lg font-bold">
              Next Demo
            </Link>
            <Link href="/dashboard" className="text-lg font-bold">
              Dashboard
            </Link>
            <div className="flex items-center z-10">
          
              {currentTheme === 'dark' ? (
            <button
              className=" hover:bg-black w-20 rounded-md border-none border-2 h-8 "
              onClick={() => setTheme('light')}
            >
              
              <img src="/images/sun.png" alt="logo" height="50px" width="50px" />
            </button>
          ) : (
            <button
              className="w-20 rounded-md border-none border-2 h-8 hover:bg-gray-300"
              onClick={() => setTheme('dark')}
            >
              <img src="/images/moon.png" alt="logo" height=" " width="50px" />
            </button>
          )}
              {session ? ( <>
                      
                      <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600">
                    {session.user.email}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link"
                          href="/admin/dashboard"
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu></>

) : (<Link href="/login" className="p-2">
                Login
              </Link>)}
          
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © Rajat Namdev</p>
        </footer>
      </div>
    </>
  );
}
