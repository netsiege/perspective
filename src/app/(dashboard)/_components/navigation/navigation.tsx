"use client";

import Link from "next/link";
import { useState } from "react";
import { NavigationRoute } from "@/types/types";
import { FaUser, FaChessRook, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";


type NavigationBarProps = {
  routes: Array<NavigationRoute>;
};

export default function NavigationBar({ routes }: NavigationBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { isAuthenticated, teamName, login, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!teamNameInput.trim()) {
        setError("Team name is required");
        setLoading(false);
        return;
      }

      await login(teamNameInput.trim(), password);
      
      // Close modal and reset form on success
      setIsOpen(false);
      setTeamNameInput("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

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
			
			{/* Login/Logout Button */}
			<li>
				{isAuthenticated ? (
					<div>
						<div className="text-sm text-gray-400 mb-2 px-3">
							Logged in as <br />
							<span className="text-white font-semibold">{teamName}</span>
						</div>
						<button
							onClick={handleLogout}
							className="w-full p-3 rounded-2xl text-left focus:outline-2 focus:outline-[#white] bg-red-500/20 hover:bg-red-500/30"
						>
							<FaSignOutAlt className="inline-block mb-1 mr-2"/>
							Logout
						</button>
					</div>
				) : (
					<button
						onClick={() => setIsOpen(true)}
						className="block p-3 rounded-2xl text-left focus:outline-2 focus:outline-[#white] bg-white/10 hover:bg-white/20"
					>
						<FaUser className="inline-block mb-1 mr-2"/>
						Login
					</button>
				)}
			</li>

			{/* Modal */}
			{isOpen && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsOpen(false)}>
				<div className="bg-white p-6 rounded-lg w-full max-w-lg" onClick={(e) => e.stopPropagation()}>

				{/* Header */}
				<div className="flex justify-between items-center border-b pb-2"  >
					<h3 className="text-2xl text-gray-700 font-semibold">Login</h3>
					<button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
				</div>
				
				{error && (
					<div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
						{error}
					</div>
				)}
				
				<form className="mt-6" onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
							Team Name
						</label>
						<input
							type="text"
							id="teamName"
							value={teamNameInput}
							onChange={(e) => setTeamNameInput(e.target.value)}
							placeholder="Enter your team name"
							className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ebdbb2]"
							required
							disabled={loading}
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ebdbb2]"
							required
							disabled={loading}
						/>
					</div>
					<button
						type="submit"
						className="w-full px-4 py-2 text-white bg-[#928374ff] rounded-lg hover:bg-[#84776aff] focus:outline-none focus:ring-2 focus:ring-[#ebdbb2] disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={loading}
					>
						{loading ? "Logging in..." : "Login"}
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