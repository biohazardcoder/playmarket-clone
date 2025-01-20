import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="md:hidden p-4 col-span-12 text-config  bg-primary flex items-center justify-between shadow-lg">
        <h1 className="text-lg font-semibold text-sidebarText">Menu</h1>
        <button onClick={toggleMenu} className="text-3xl text-sidebarText">
          {isOpen ? <MdClose /> : <MdMenu />}
        </button>
      </div>
      <aside
        className={`bg-primary text-mainly row-span-11   shadow-lg transform md:translate-x-0 ${isOpen ? "translate-x-0 w-64 h-screen" : "-translate-x-full w-64 h-screen"
          } transition-transform duration-300 ease-in-out fixed md:static top-0 left-0  z-50 md:col-span-2`}
      >
        <ul className="h-full flex flex-col">
          {[
            { path: "/", label: "Dashboard" },
            { path: "/admins", label: "Admins" },
            { path: "/games", label: "Games" },
            { path: "/orders", label: "Buyurtmalar" },
          ].map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center text-lg font-semibold p-4 transition-colors duration-300 ${isActive
                    ? "bg-secondary text-config"
                    : "bg-primary "
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};
