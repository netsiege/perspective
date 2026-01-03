"use client";

import Link from "next/link";
import { useState } from "react";
import { NavigationRoute } from "@/types/types";
import { FaUser, FaChessRook } from "react-icons/fa";


type NavigationBarProps = {
  routes: Array<NavigationRoute>;
};

export default function NavigationBar({ routes }: NavigationBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col w-48 bg-[#171717] text-white h-screen p-4">
	<div className="mb-6 mt-4 flex items-baseline space-x-2">
		<FaChessRook className="text-2xl text-white" />
		<span className="text-2xl font-semibold text-white">Netsiege</span>
	</div>
      <nav >
        <ul className="flex flex-col space-y-4 list-none">

			 {/* Routes */}
			 {routes.map((route, index) => (
                    <li key={index}>
                    <Link
                        href={`/${route.reference}`}
                        className="block p-3 rounded-lg text-left focus:outline-2 focus:outline-[#928374ff] focus:bg-gradient-to-r from-[#84776aff]/40 to-[#84776aff]/10 hover:bg-gradient-to-r from-[#84776aff]/40 to-[#84776aff]/10"              >
                        {route.name}
                    </Link>
                    </li>
                ))}
          {/* Login Button */}
          <li>
			
            <button
              onClick={() => setIsOpen(true)}
              className="block p-3 rounded-2xl text-left focus:outline-2 focus:outline-[#white] bg-white/10 hover:bg-white/20"            >
              <FaUser className="inline-block mb-1 mr-2"/>
			  Login
            </button>
          </li>

          {/* Modal */}
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsOpen(false)}>
              <div className="bg-white p-6 rounded-lg w-full max-w-lg" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex justify-between items-center border-b"  >
                  <h3 className="text-2xl text-gray-700 font-semibold">Login</h3>
                  <button onClick={() => setIsOpen(false)}>✕</button>
                </div>
                <form className="mt-6">
					<div className="mb-4">
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
								Email
						</label>
						<input
							type="email"
							id="email"
							placeholder="Enter your email"
							className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ebdbb2]"
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
						Password
						</label>
						<input
						type="password"
						id="password"
						placeholder="Enter your password"
						className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ebdbb2]"
						/>
					</div>
					<button
							type="submit"
							className="w-full px-4 py-2 text-white bg-[#928374ff] rounded-lg hover:bg-[#84776aff] focus:outline-none focus:ring-2 focus:ring-[#ebdbb2]"
					>
							Login
					</button>
					</form>
			</div>
            </div>
                )}

               

                </ul>
            </nav>
            </div>
  );
}