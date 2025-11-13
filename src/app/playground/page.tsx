"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogBody,
	DialogCloseButton,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function PlaygroundPage() {
	const [selectedValue, setSelectedValue] = useState<string>("");
	const [dropdownCheckbox, setDropdownCheckbox] = useState({
		notifications: false,
		darkMode: false,
	});
	const [radioValue, setRadioValue] = useState("density-default");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		category: "",
		priority: "",
		description: "",
	});

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold mb-2">
					Component Playground
				</h1>
				<p className="text-muted-foreground mb-12">
					Explore Select, Dialog, and Dropdown Menu components from
					shadcn
				</p>

				<div className="grid gap-12">
					{/* Select Component */}
					<section className="space-y-4">
						<div>
							<h2 className="text-2xl font-semibold mb-2">
								Select
							</h2>
							<p className="text-muted-foreground text-sm">
								A select component with dropdown options
							</p>
						</div>
						<div className="border rounded-lg p-6 space-y-4 bg-card">
							<div className="space-y-2">
								<label className="text-sm font-medium">
									Choose a framework:
								</label>
								<Select
									value={selectedValue}
									onValueChange={setSelectedValue}
								>
									<SelectTrigger className="w-[200px]">
										<SelectValue placeholder="Select a framework" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="react">
											React
										</SelectItem>
										<SelectItem value="vue">Vue</SelectItem>
										<SelectItem value="angular">
											Angular
										</SelectItem>
										<SelectItem value="svelte">
											Svelte
										</SelectItem>
										<SelectItem value="solid">
											Solid
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							{selectedValue && (
								<p className="text-sm text-muted-foreground">
									You selected:{" "}
									<span className="font-semibold">
										{selectedValue}
									</span>
								</p>
							)}
						</div>
					</section>

					{/* Dialog Component */}
					<section className="space-y-4">
						<div>
							<h2 className="text-2xl font-semibold mb-2">
								Dialog
							</h2>
							<p className="text-muted-foreground text-sm">
								A modal dialog component that displays content
								in an overlay
							</p>
						</div>
						<div className="border rounded-lg p-6 space-y-4 bg-card">
							<Dialog>
								<DialogTrigger asChild>
									<Button>Open Dialog</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Dialog Title</DialogTitle>
										<DialogCloseButton />
									</DialogHeader>
									<DialogBody>
										<p>
											This is the main content area of the
											dialog. You can add forms, text, or
											any other content you want to
											display.
										</p>
									</DialogBody>
									<DialogFooter>
										<Button variant="outline">
											Cancel
										</Button>
										<Button>Confirm</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</section>

					{/* Dropdown Menu Component */}
					<section className="space-y-4">
						<div>
							<h2 className="text-2xl font-semibold mb-2">
								Dropdown Menu
							</h2>
							<p className="text-muted-foreground text-sm">
								A dropdown menu with various options and
								configurations
							</p>
						</div>
						<div className="border rounded-lg p-6 space-y-4 bg-card">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">Open Menu</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuLabel>
										Options
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem>Profile</DropdownMenuItem>
									<DropdownMenuItem>
										Settings
									</DropdownMenuItem>
									<DropdownMenuItem>Help</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuLabel>
										Preferences
									</DropdownMenuLabel>
									<DropdownMenuCheckboxItem
										checked={dropdownCheckbox.notifications}
										onCheckedChange={(checked) =>
											setDropdownCheckbox((prev) => ({
												...prev,
												notifications: checked,
											}))
										}
									>
										Enable Notifications
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={dropdownCheckbox.darkMode}
										onCheckedChange={(checked) =>
											setDropdownCheckbox((prev) => ({
												...prev,
												darkMode: checked,
											}))
										}
									>
										Dark Mode
									</DropdownMenuCheckboxItem>
									<DropdownMenuSeparator />
									<DropdownMenuLabel>
										View Density
									</DropdownMenuLabel>
									<DropdownMenuRadioGroup
										value={radioValue}
										onValueChange={setRadioValue}
									>
										<DropdownMenuRadioItem value="density-compact">
											Compact
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem value="density-default">
											Default
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem value="density-comfortable">
											Comfortable
										</DropdownMenuRadioItem>
									</DropdownMenuRadioGroup>
									<DropdownMenuSeparator />
									<DropdownMenuItem variant="destructive">
										Logout
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							<div className="mt-6 p-4 bg-muted rounded-md space-y-2">
								<p className="text-sm">
									<span className="font-semibold">
										Notifications:
									</span>{" "}
									{dropdownCheckbox.notifications
										? "Enabled"
										: "Disabled"}
								</p>
								<p className="text-sm">
									<span className="font-semibold">
										Dark Mode:
									</span>{" "}
									{dropdownCheckbox.darkMode
										? "Enabled"
										: "Disabled"}
								</p>
								<p className="text-sm">
									<span className="font-semibold">
										Density:
									</span>{" "}
									{radioValue}
								</p>
							</div>
						</div>
					</section>

					{/* Complex Form Dialog */}
					<section className="space-y-4">
						<div>
							<h2 className="text-2xl font-semibold mb-2">
								Complex Form Dialog
							</h2>
							<p className="text-muted-foreground text-sm">
								Dialog with form inputs, selects, textarea, and
								labels
							</p>
						</div>
						<div className="border rounded-lg p-6 space-y-4 bg-card">
							<Dialog>
								<DialogTrigger asChild>
									<Button>Open Form Dialog</Button>
								</DialogTrigger>
								<DialogContent className="max-w-md">
									<DialogHeader>
										<DialogTitle>
											Create New Item
										</DialogTitle>
										<DialogCloseButton />
									</DialogHeader>
									<DialogBody className="space-y-5">
										{/* Name Input */}
										<div className="space-y-2">
											<Label htmlFor="name">
												Full Name
											</Label>
											<Input
												id="name"
												placeholder="Enter your full name"
												inputSize="lg"
												value={formData.name}
												onChange={(e) =>
													setFormData({
														...formData,
														name: e.target.value,
													})
												}
											/>
										</div>

										{/* Email Input */}
										<div className="space-y-2">
											<Label htmlFor="email">
												Email Address
											</Label>
											<Input
												id="email"
												type="email"
												placeholder="you@example.com"
												inputSize="lg"
												value={formData.email}
												onChange={(e) =>
													setFormData({
														...formData,
														email: e.target.value,
													})
												}
											/>
										</div>

										{/* Category Select */}
										<div className="space-y-2">
											<Label htmlFor="category">
												Category
											</Label>
											<Select
												value={formData.category}
												onValueChange={(value) =>
													setFormData({
														...formData,
														category: value,
													})
												}
											>
												<SelectTrigger
													className="w-full"
													size="lg"
												>
													<SelectValue placeholder="Select a category" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="business">
														Business
													</SelectItem>
													<SelectItem value="personal">
														Personal
													</SelectItem>
													<SelectItem value="other">
														Other
													</SelectItem>
												</SelectContent>
											</Select>
										</div>

										{/* Priority Select */}
										<div className="space-y-2">
											<Label htmlFor="priority">
												Priority Level
											</Label>
											<Select
												value={formData.priority}
												onValueChange={(value) =>
													setFormData({
														...formData,
														priority: value,
													})
												}
											>
												<SelectTrigger
													className="w-full"
													size="lg"
												>
													<SelectValue placeholder="Select priority" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="low">
														Low
													</SelectItem>
													<SelectItem value="medium">
														Medium
													</SelectItem>
													<SelectItem value="high">
														High
													</SelectItem>
													<SelectItem value="urgent">
														Urgent
													</SelectItem>
												</SelectContent>
											</Select>
										</div>

										{/* Description Textarea */}
										<div className="space-y-2">
											<Label htmlFor="description">
												Description
											</Label>
											<Textarea
												id="description"
												placeholder="Enter a detailed description..."
												value={formData.description}
												onChange={(e) =>
													setFormData({
														...formData,
														description:
															e.target.value,
													})
												}
											/>
										</div>
									</DialogBody>
									<DialogFooter>
										<Button size="lg" className="w-full">
											Submit
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</section>

					{/* Combination Example */}
					<section className="space-y-4">
						<div>
							<h2 className="text-2xl font-semibold mb-2">
								Combined Example
							</h2>
							<p className="text-muted-foreground text-sm">
								All three components working together
							</p>
						</div>
						<div className="border rounded-lg p-6 space-y-4 bg-card">
							<div className="space-y-4">
								<div className="flex gap-4 flex-wrap">
									<Select>
										<SelectTrigger className="w-[200px]">
											<SelectValue placeholder="Select priority" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="low">
												Low
											</SelectItem>
											<SelectItem value="medium">
												Medium
											</SelectItem>
											<SelectItem value="high">
												High
											</SelectItem>
										</SelectContent>
									</Select>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline">
												More Actions
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuItem>
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem>
												Duplicate
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem variant="destructive">
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>

									<Dialog>
										<DialogTrigger asChild>
											<Button>Details</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>
													Item Details
												</DialogTitle>
												<DialogCloseButton />
											</DialogHeader>
											<DialogBody>
												<p>
													This demonstrates how
													Select, Dropdown Menu, and
													Dialog work together in a
													unified interface.
												</p>
											</DialogBody>
											<DialogFooter>
												<Button variant="outline">
													Close
												</Button>
												<Button>Save</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
