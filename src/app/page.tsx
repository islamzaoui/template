"use client";

import useSWR from "swr";
import { AuthStatus } from "@/components/auth-status";
import { fetcher } from "@/fetchers";

type UserWithInfo = {
	id: string;
	email: string;
	createdAt: Date;
	userInfo: {
		firstName: string | null;
		lastName: string | null;
	} | null;
};

type UsersResponse = {
	users: UserWithInfo[];
};

function Users() {
	const { data, error, isLoading } = useSWR<UsersResponse>(
		"/api/users",
		fetcher,
	);

	if (isLoading) return <div>Loading users...</div>;
	if (error) return <div>Failed to load users.</div>;
	if (!data?.users) return <div>No users found.</div>;

	return (
		<div>
			<h1 className="mb-4 text-2xl font-bold">Users</h1>
			<ul className="space-y-2">
				{data.users.map((user) => (
					<li key={user.id} className="rounded-md border p-2">
						{user.email} - {user.userInfo?.firstName}{" "}
						{user.userInfo?.lastName}
					</li>
				))}
			</ul>
		</div>
	);
}

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<div className="absolute right-4 top-4">
				<AuthStatus />
			</div>
			<Users />
		</div>
	);
}
