import "./globals.css";
import AuthContext from "@/app/context/AuthContext";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthContext>
			{children}
		</AuthContext>
	);
}
