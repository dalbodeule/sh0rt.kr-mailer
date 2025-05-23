<script setup lang="ts">
import { ref } from 'vue';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import type {
	PublicKeyCredentialRequestOptionsJSON
} from '@simplewebauthn/types';

const email = ref('');

const register = async () => {
	try {
		const options = await $fetch('/api/generate-registration-options', {
			method: 'POST',
			body: {
				email: email.value
			}
		})
		console.log(options)

		let attResp;
		try {
			attResp = await startRegistration({
				optionsJSON: options,
				useAutoRegister: false
			});
		} catch (error: any) {
			if (error?.name === 'InvalidStateError') {
				console.log("Error: Authenticator was probably already registered by user")
			} else {
				console.log(error)
			}

			throw error;
		}

		await $fetch('/api/verify-registration', {
			method: 'POST',
			body: {
				attResp: attResp, email: email.value
			}
		})
		alert('Registration successful')
	} catch(error) {
		console.log(error)
		alert('Error: Authenticator was probably already registered by user')
	}
};

const login = async () => {
	const options = await $fetch<PublicKeyCredentialRequestOptionsJSON>('/api/generate-authentication-options', {
		method: 'POST',
		body: { email: email.value }
	});

	let authResp;
	try {
		authResp = await startAuthentication({
			optionsJSON: options,
		});
	} catch (error) {
		console.error(error);
		throw error;
	}

	const verificationResp = await $fetch('/api/verify-authentication', {
		method: 'POST',
		body: JSON.stringify({ ...authResp, email: email.value })
	});

	alert('Login successful');
};
</script>

<template>
	<div class="container mx-auto max-w-md p-8">
		<h1 class="text-3xl font-bold mb-8 text-center">WebAuthn Demo</h1>
		<div class="flex flex-col gap-4">
			<input
				v-model="email"
				placeholder="Email"
				type="email"
				class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button
				@click="register"
				class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
			>
				Register with FIDO Key
			</button>
			<button
				@click="login"
				class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
			>
				Login with FIDO Key
			</button>
		</div>
	</div>
</template>
