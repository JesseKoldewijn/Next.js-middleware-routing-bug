import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { hasProtectedRouteAccess } from "./helpers/ProtectedRoute";

// * TODO: possibly needs to have the i18n flow integrated here later as well
// * https://nextjs.org/docs/app/building-your-application/routing/internationalization
// * ------------------------------------------------------------------------

// ? This function grabs the client'ssession-token and passes it over the the page using headers
export const middleware = async (
	request: NextRequest
): Promise<NextResponse> => {
	try {
		const headers = new Headers(request.headers);
		const currentHref = String(request.nextUrl.href);

		/**
		 * The code block is checking if the `request.cookies.getAll()` function returns a value that is not
		 * `undefined`. If it is not `undefined`, it means that there are cookies present in the request.
		 * If there are cookies present in the request, we append the `session-token` header to the request.
		 */
		if (Object.keys(request.cookies.getAll()).length > 0) {
			headers.append("session-token", String(request.cookies.toString()));
		}

		/**
		 * The code block is checking if the `request.nextUrl.href` function returns a value that is not
		 * `undefined`. If it is not `undefined`, it means that there is a nextUrl present in the request.
		 * If there is a nextUrl present in the request, we append the `request-url` header to the request.
		 */
		headers.append("request-url", String(currentHref));

		if (
			currentHref.includes("_next/static/css/") ||
			currentHref.includes("js") ||
			currentHref.includes("json") ||
			currentHref.includes("png")
		) {
			return NextResponse.next({ headers });
		} else {
			const routeAccess = await hasProtectedRouteAccess(
				request.nextUrl,
				headers,
				request.cookies
			);

			if (routeAccess.status === "not-authenticated") {
				return NextResponse.redirect(routeAccess.redirect.href);
			} else {
				return NextResponse.next({ headers });
			}
		}
	} catch (error) {
		console.error("mw-error", error, request.nextUrl.href);
		return NextResponse.next();
	}
};

export const config = {
	// Making sure middleware will be hit on every request
	matcher: ["/", "/:path*"],
};
