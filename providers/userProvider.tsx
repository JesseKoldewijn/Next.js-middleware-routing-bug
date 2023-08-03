"use client";

import { usePathname, useRouter } from "next/navigation";
import { PermissionsType } from "@/config/permissionConfig";
import { getPageProps } from "@/server/getPageProps";
import { createContext, useContext, useEffect, useState } from "react";
import {
	cookiesToObject,
	eraseCookie,
	objectToCookiesString,
	setCookie,
} from "@/helpers/CookieHandlers";

interface IProps {
	children?: React.ReactNode;
}

export enum ELoggedInStatus {
	loading,
	isAuth,
	isNotAuth,
}

export interface UserProps {
	id: string;
	firstname?: string;
	lastname?: string;
	type: string;
	permissions?: PermissionsType[];
}

export interface UserContext {
	user: UserProps;
	setUser: React.Dispatch<React.SetStateAction<UserProps>>;
	loggedInStatus: ELoggedInStatus;
	changeUser: (isSignedin: boolean) => void;
}

export const UserContext = createContext<Partial<UserContext>>({});

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error(
			"useUserContext must be used within a UserContextProvider"
		);
	}
	return context;
};

/**
 * Provider which provides current locale and an entrypoint to change the current locale.
 * @param {ReactNode} children Children of the component
 * @returns {Context} The locale context with their children
 */
export const UserContextProvider: React.FC<IProps> = ({ children }) => {
	const router = useRouter();
	const pathName = usePathname();
	const [user, setUser] = useState<UserProps>({
		id: "",
		firstname: "",
		lastname: "",
		type: "",
		permissions: [],
	});

	let loggedInStatus = ELoggedInStatus.loading;

	if (user?.id) {
		loggedInStatus = ELoggedInStatus.isAuth;
	} else {
		loggedInStatus = ELoggedInStatus.isNotAuth;
	}

	useEffect(() => {
		const cookieJar = document.cookie
			.split("; ")
			.reduce((prev, current) => {
				const [name, ...value] = current.split("=");
				prev[name] = value.join("=");
				return prev;
			}, {});

		const getUserData = async () => {
			const result = await getPageProps(
				window.location.pathname,
				cookieJar
			);

			if (result?.message === "authenticated") {
				setUser({
					id: "1",
					firstname: "John",
					lastname: "Doe",
					type: "user",
					permissions: [],
				});
			}
		};
		getUserData();
	}, [pathName]);

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				loggedInStatus,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
