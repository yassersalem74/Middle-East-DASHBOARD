import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItemClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition-all duration-300 text-white
     ${isActive ? "bg-emerald-600" : "hover:bg-slate-700"}`;

  return (
    <>
      {/* ===== Mobile Top Bar ===== */}
      <div className="fixed top-0 left-0 right-0 bg-slate-900 flex items-center p-3 z-50 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="btn btn-ghost text-white text-2xl"
        >
          ☰
        </button>

        <NavLink to="/" className="ml-3">
          <img src="/middle-logo.png" className="h-10" />
        </NavLink>
      </div>

      {/* ===== Overlay ===== */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        ></div>
      )}

      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b 
        from-slate-900 via-slate-800 to-emerald-900
        transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* ===== Header ===== */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <NavLink to="/">
            <img src="/middle-logo.png" className="h-10" />
          </NavLink>

          <button
            onClick={() => setOpen(false)}
            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* ===== Links ===== */}
        <ul className="menu p-4 text-lg space-y-2">

          <li><NavLink to="/products" className={navItemClass}>Products</NavLink></li>
          <li><NavLink to="/categories" className={navItemClass}>Categories</NavLink></li>

          <li><NavLink to="/industries" className={navItemClass}>Industries</NavLink></li>
          <li><NavLink to="/exhibition" className={navItemClass}>Exhibition</NavLink></li>

          <li><NavLink to="/slider-images" className={navItemClass}>Slider Images</NavLink></li>
          <li><NavLink to="/team" className={navItemClass}>Team Members</NavLink></li>
        </ul>
      </aside>

      {/* Page spacing */}
      <div className="lg:ml-64 pt-16 lg:pt-0"></div>
    </>
  );
}
