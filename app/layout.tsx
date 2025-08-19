import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html>
			<body>
				<AuthProvider>
					{children}
				</AuthProvider>
			</body>
		</html>
	);
}
