export const getPageProps = async (pathName, cookies) => {
	const url = `${process.env.NEXT_PUBLIC_HOSTNAME}/api/pageprops`;
	const result = await fetch(url, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			cookie: cookies,
		},
		body: JSON.stringify({
			resolvedUrl: pathName,
		}),
	});

	return await result.json();
};
