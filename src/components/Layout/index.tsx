import { FC, ReactNode } from "react";
import { Header } from "../Header";

type LayoutProps = {
	children: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
	return (
		<>
			<Header />
			{children}
		</>
	);
};
