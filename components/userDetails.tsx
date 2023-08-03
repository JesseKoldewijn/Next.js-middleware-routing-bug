"use client";

import { ELoggedInStatus, useUserContext } from "@/providers/userProvider";

const UserDetails = () => {
	const { user, loggedInStatus, changeUser } = useUserContext();

	return (
		<div>
			<h1>UserDetails</h1>
			{loggedInStatus == ELoggedInStatus.isAuth ? (
				<div>
					<h2>{`${user.firstname} ${user.lastname}`}</h2>
				</div>
			) : (
				<div>
					<h2>Not loggedin</h2>
				</div>
			)}
		</div>
	);
};

export default UserDetails;
