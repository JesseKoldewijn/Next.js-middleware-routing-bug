import "@/styles/globals.css";

import { UserContextProvider } from "@/providers/userProvider";
import Navbar from "@/components/navbar";

export default function RootLayout({ children }) {
	return (
		<html>
			<head></head>
			<body>
				<UserContextProvider>
					<Navbar />
					<main className="flex inset-0 p-2">{children}</main>
				</UserContextProvider>
			</body>
		</html>
	);
}
