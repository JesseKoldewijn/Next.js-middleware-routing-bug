import Link from "next/link";
import React from "react";

const Navbar = () => {
	return (
		<nav className="w-full bg-stone-900 text-white flex gap-2 py-2 px-3 align-middle justify-between">
			<Link href="/" className="hover:underline">
				Public
			</Link>
			<Link href="/account" className="hover:underline">
				Protected
			</Link>
		</nav>
	);
};

export default Navbar;
