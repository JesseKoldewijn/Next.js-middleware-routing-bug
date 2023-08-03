import { RequestCookiesAdapter } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const body = await req.json();

	if (body.resolvedUrl === undefined)
		return NextResponse.json({
			status: "error",
			message: "resolvedUrl is undefined",
		});

	const cookieJar = RequestCookiesAdapter.seal(req.cookies);

	if (
		cookieJar.get("session-token") !== undefined &&
		cookieJar.get("session-token") !== null
	) {
		return NextResponse.json({
			status: "authenticated",
			message: "User is authenticated",
		});
	}

	return NextResponse.json({
		status: "not-authenticated",
		message: "User is not authenticated",
	});
};
