"use client"

import { Fragment } from "react"
import { usePathname } from "next/navigation"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { DotsCircleHorizontalIcon } from "@heroicons/react/outline"
import { XIcon } from "@heroicons/react/solid"
import { NAVIGATION_ROUTES } from "config/global.config"
import { LogOut, UserCircle2 } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"

import NavBarLogo from "./icons/NavBarLogo"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function Navbar({ user }: { user: any }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <Disclosure as="nav" className="bg-white shadow-lg">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <NavBarLogo />
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {NAVIGATION_ROUTES.filter((item) => item.roles.includes(session?.user?.token?.role?.slug || "")).map(
                    (item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                          "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                        )}
                        aria-current={pathname === item.href ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ),
                  )}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                      <UserCircle2 size={36} strokeWidth="1" color="#909090" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {user ? (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "flex items-center hover:bg-red-50 gap-2 w-full px-4 py-2 text-sm text-red-700",
                              )}
                              onClick={() => signOut()}
                            >
                              <LogOut className="h-4 w-4" />
                              Se déconneter
                            </button>
                          )}
                        </Menu.Item>
                      ) : (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "flex w-full px-4 py-2 text-sm text-gray-700",
                              )}
                              onClick={() => signIn("github")}
                            >
                              Se connecter
                            </button>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                  {/* <span className="sr-only">Open main menu</span> */}
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <DotsCircleHorizontalIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {NAVIGATION_ROUTES.filter((item) => item.roles.includes(session?.user?.token?.role?.slug || "")).map(
                (item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? "bg-slate-50 border-slate-500 text-slate-700"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                      "block pl-3 pr-4 py-2 border-l-4 text-sm",
                    )}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ),
              )}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              {user && (
                <>
                  <div>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 px-4 py-2 text-gray-500 text-sm text-red-700"
                    >
                      <LogOut className="h-4 w-4" />
                      Se déconneter
                    </button>
                  </div>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
