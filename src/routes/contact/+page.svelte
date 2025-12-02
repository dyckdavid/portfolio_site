<script lang="ts">
	import { db } from '../../lib/firebase';
	import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
	
	let name = '';
	let email = '';
	let message = '';
	let submitting = false;
	let submitted = false;
	let error = '';

	function validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	async function handleSubmit() {
		// Reset error
		error = '';

		// Validation
		if (!name || !email || !message) {
			error = '> ERROR: All fields are required';
			return;
		}

		if (name.trim().length < 2) {
			error = '> ERROR: Name must be at least 2 characters';
			return;
		}

		if (!validateEmail(email)) {
			error = '> ERROR: Please enter a valid email address';
			return;
		}

		if (message.trim().length < 10) {
			error = '> ERROR: Message must be at least 10 characters';
			return;
		}

		submitting = true;

		try {
			// Save to Firebase Firestore
			const docRef = await addDoc(collection(db, 'contacts'), {
				name: name.trim(),
				email: email.trim().toLowerCase(),
				message: message.trim(),
				timestamp: serverTimestamp(), // Use server timestamp for consistency
				read: false, // Mark as unread
				createdAt: new Date().toISOString(), // Also store ISO string for easy reading
			});

			console.log('Contact saved with ID:', docRef.id);

			// Reset form
			submitted = true;
			name = '';
			email = '';
			message = '';
		} catch (err: any) {
			console.error('Error submitting contact form:', err);
			
			// More specific error messages
			if (err.code === 'permission-denied') {
				error = '> ERROR: Permission denied. Please check Firebase rules.';
			} else if (err.code === 'unavailable') {
				error = '> ERROR: Service unavailable. Please try again later.';
			} else {
				error = '> ERROR: Failed to send message. Please try again.';
			}
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Contact | David's Portfolio</title>
	<meta name="description" content="Contact David Dyck" />
	<link rel="manifest" href="/manifest.json">
</svelte:head>

<section class="min-h-screen bg-hacker-black text-hacker-green py-8 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="border-2 border-hacker-green bg-hacker-dark p-6 mb-8 shadow-hacker-glow">
			<div class="font-mono text-2xl font-bold text-hacker-green">
				&gt; CONTACT_INTERFACE
			</div>
			<div class="text-sm text-hacker-green-dark mt-2">
				// Establish connection...
			</div>
		</div>

		{#if submitted}
			<div class="border-2 border-hacker-green bg-hacker-dark p-8 text-center shadow-hacker-glow">
				<div class="font-mono text-hacker-green text-xl mb-4">
					&gt; MESSAGE_SENT_SUCCESSFULLY
				</div>
				<div class="text-hacker-green-dark mb-2">
					// Message saved to database
				</div>
				<div class="text-hacker-green-dark mb-6">
					// Your message has been received. I'll get back to you soon!
				</div>
				<button 
					on:click={() => submitted = false}
					class="px-6 py-2 border-2 border-hacker-green bg-hacker-black text-hacker-green font-mono hover:bg-hacker-green hover:text-hacker-black transition-all shadow-hacker hover:shadow-hacker-glow"
				>
					[SEND_ANOTHER]
				</button>
			</div>
		{:else}
			<div class="border-2 border-hacker-green bg-hacker-dark p-6 shadow-hacker">
				<form on:submit|preventDefault={handleSubmit} class="space-y-6">
					<!-- Name Field -->
					<div class="font-mono">
						<label for="name" class="block text-hacker-green mb-2">
							&gt; NAME:
						</label>
						<input
							type="text"
							id="name"
							bind:value={name}
							required
							class="w-full bg-hacker-black border-2 border-hacker-green p-3 text-hacker-green font-mono focus:outline-none focus:border-hacker-green-bright focus:shadow-hacker-glow"
							placeholder="Enter your name..."
						/>
					</div>

					<!-- Email Field -->
					<div class="font-mono">
						<label for="email" class="block text-hacker-green mb-2">
							&gt; EMAIL:
						</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							required
							class="w-full bg-hacker-black border-2 border-hacker-green p-3 text-hacker-green font-mono focus:outline-none focus:border-hacker-green-bright focus:shadow-hacker-glow"
							placeholder="your.email@example.com"
						/>
					</div>

					<!-- Message Field -->
					<div class="font-mono">
						<label for="message" class="block text-hacker-green mb-2">
							&gt; MESSAGE:
						</label>
						<textarea
							id="message"
							bind:value={message}
							required
							rows="8"
							class="w-full bg-hacker-black border-2 border-hacker-green p-3 text-hacker-green font-mono focus:outline-none focus:border-hacker-green-bright focus:shadow-hacker-glow resize-none"
							placeholder="Type your message here..."
						></textarea>
					</div>

					<!-- Error Message -->
					{#if error}
						<div class="font-mono text-red-500 border-2 border-red-500 p-3 bg-hacker-black">
							{error}
						</div>
					{/if}

					<!-- Submit Button -->
					<button
						type="submit"
						disabled={submitting}
						class="w-full px-6 py-3 border-2 border-hacker-green bg-hacker-black text-hacker-green font-mono font-bold hover:bg-hacker-green hover:text-hacker-black transition-all shadow-hacker hover:shadow-hacker-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{#if submitting}
							<span class="inline-block w-2 h-2 bg-hacker-green rounded-full animate-pulse"></span>
							&gt; SENDING_TO_DATABASE...
						{:else}
							&gt; SEND_MESSAGE
						{/if}
					</button>
				</form>
			</div>

			<!-- Contact Info -->
			<div class="mt-8 border-2 border-hacker-green bg-hacker-dark p-6">
				<div class="font-mono text-sm">
					<div class="text-hacker-green mb-4">&gt; ALTERNATIVE_CONTACT</div>
					<div class="text-hacker-green-dark space-y-2">
						<div>// Prefer direct communication?</div>
						<div>// Check out my projects for GitHub links</div>
						<div>// Or reach out through professional networks</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

