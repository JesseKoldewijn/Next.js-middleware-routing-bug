import { protectedRoutesConfig } from "@/config/permissionConfig";
import { getPageProps } from "@/server/getPageProps";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import {
	ReadonlyRequestCookies,
	RequestCookiesAdapter,
} from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const hasProtectedRouteAccess = async (
	pathName: URL,
	headers: ReadonlyHeaders,
	cookiesOverride?: RequestCookies | ReadonlyRequestCookies
) => {
	const rootUrl = new URL(
		String(
			process.env.NEXT_PUBLIC_HOSTNAME.includes("localhost") === false
				? `${process.env.NEXT_PUBLIC_HOSTNAME}`.replace(
						":8001",
						process.env.NODE_ENV === "development" ? ":8123" : ""
				  ) + "/"
				: `${process.env.NEXT_PUBLIC_HOSTNAME}`.replace(
						":8001",
						":8123"
				  ) + "/"
		)
	);

	const headersMock = new Headers(headers);

	if (cookiesOverride !== undefined) {
		headersMock.append("cookie", cookiesOverride.toString());
	}

	const cookieChunks = new RequestCookies(headersMock);
	const cookieJar = RequestCookiesAdapter.seal(cookieChunks);

	/**
	 *  The code block you provided is checking if the current route is a protected route.
	 */
	const isProtectedRoute = protectedRoutesConfig.find((route) => {
		if (
			pathName.pathname.includes(route) &&
			pathName.pathname.includes(".css") === false &&
			pathName.pathname.includes(".js") === false &&
			pathName.pathname.includes(".json") === false
		) {
			return true;
		}
	});

	/**
	 *  If the route is a protected route, we need to check if the user is authenticated.
	 *  If the user is not authenticated, we redirect them to the login page
	 *  or the redirect target given in the pageProps.
	 */
	if (isProtectedRoute !== undefined) {
		if (
			headersMock.get("Sec-Fetch-Mode") == null &&
			headersMock.get("Sec-Fetch-Mode") !== "navigate"
		) {
			return {
				status: "not-authenticated",
				redirect: pathName,
			};
		}

		const pageProps = await getPageProps(pathName.pathname, cookieJar);

		if (pageProps !== null) {
			const result = pageProps;
			console.log(result);
			if (result.status !== "authenticated") {
				const redirectURL = new URL("/", rootUrl);
				return {
					status: "not-authenticated",
					redirect: redirectURL,
				};
			} else {
				return {
					status: "authenticated",
					redirect: pathName,
				};
			}
		} else {
			return {
				status: "no-data-received",
				redirect: pathName,
			};
		}
	} else {
		return {
			status: "public-route",
			redirect: pathName,
		};
	}
};
