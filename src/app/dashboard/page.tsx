"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/lib/client";

export default function DashboardPage() {
	const router = useRouter();
	const { data, error, isLoading } = useSWR(
		orpc.me.getMe.key(),
		orpc.me.getMe.fetcher({ context: { cache: true } }), // Provide client context if needed
	);

	const handleLogout = async () => {
		// Call logout endpoint
		try {
			await fetch("/api/auth/logout", { method: "GET" });
			router.push("/auth");
		} catch (err) {
			console.error("Logout failed:", err);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-zinc-50 dark:bg-black">
				<div className="mx-auto max-w-4xl px-4 py-8">
					<div className="mb-8 flex items-center justify-between">
						<Skeleton className="h-8 w-48" />
						<Skeleton className="h-10 w-24" />
					</div>
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-40" />
							<Skeleton className="mt-2 h-4 w-60" />
						</CardHeader>
						<CardContent className="space-y-4">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-48" />
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<CardTitle>Authentication Required</CardTitle>
						<CardDescription>
							You need to be logged in to access this page
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							onClick={() => router.push("/auth")}
							className="w-full"
						>
							Go to Sign In
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const user = data?.session.userWithInfo;

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-black">
			<div className="mx-auto max-w-4xl px-4 py-8">
				{/* Header */}
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
							Dashboard
						</h1>
						<p className="mt-2 text-zinc-600 dark:text-zinc-400">
							Welcome back, {user?.fullname || user?.email}
						</p>
					</div>
					<Button variant="outline" onClick={handleLogout}>
						Logout
					</Button>
				</div>

				{/* User Information Card */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Account Information</CardTitle>
						<CardDescription>
							Your profile details and account settings
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
									Email
								</p>
								<p className="mt-1 text-base text-black dark:text-white">
									{user?.email}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
									Full Name
								</p>
								<p className="mt-1 text-base text-black dark:text-white">
									{user?.fullname || "Not set"}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
									Phone
								</p>
								<p className="mt-1 text-base text-black dark:text-white">
									{user?.phone || "Not set"}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
									Role
								</p>
								<p className="mt-1 text-base capitalize text-black dark:text-white">
									{user?.role || "Not assigned"}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
									Account Created
								</p>
								<p className="mt-1 text-base text-black dark:text-white">
									{user?.createdAt
										? new Date(
												user.createdAt,
											).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})
										: "Unknown"}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
									Last Updated
								</p>
								<p className="mt-1 text-base text-black dark:text-white">
									{user?.updatedAt
										? new Date(
												user.updatedAt,
											).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})
										: "Unknown"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Producer Information */}
				{user?.producer && (
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Producer Information</CardTitle>
							<CardDescription>
								Your producer profile details
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
										Wilaya ID
									</p>
									<p className="mt-1 text-base text-black dark:text-white">
										{user.producer.wilayaId}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
										City ID
									</p>
									<p className="mt-1 text-base text-black dark:text-white">
										{user.producer.cityId}
									</p>
								</div>
								<div className="md:col-span-2">
									<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
										Address
									</p>
									<p className="mt-1 text-base text-black dark:text-white">
										{user.producer.address}
									</p>
								</div>
								<div className="md:col-span-2">
									<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
										Farmer License Number
									</p>
									<p className="mt-1 text-base text-black dark:text-white">
										{user.producer.farmerLicenseNumber}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Transporter Information */}
				{user?.transporter && (
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Transporter Information</CardTitle>
							<CardDescription>
								Your transporter profile details
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
										License Number
									</p>
									<p className="mt-1 text-base text-black dark:text-white">
										{user.transporter.licenseNumber}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
										Plate Number
									</p>
									<p className="mt-1 text-base text-black dark:text-white">
										{user.transporter.plateNumber}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
										Vehicle Type
									</p>
									<p className="mt-1 text-base capitalize text-black dark:text-white">
										{user.transporter.vehicleType}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
										Load Capacity
									</p>
									<p className="mt-1 text-base text-black dark:text-white">
										{user.transporter.loadCapacityInKg.toLocaleString()}{" "}
										kg
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
