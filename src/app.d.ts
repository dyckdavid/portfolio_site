/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface Locals {
			admin: { email: string } | null;
		}
	}
}

export {};
