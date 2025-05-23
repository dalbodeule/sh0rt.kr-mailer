import { FIDODevices, Users } from '~/server/db/schema';
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { isoUint8Array } from '@simplewebauthn/server/helpers'
import { rpID, rpName } from '~/server/utils/rp'
import { useDrizzle } from '~/server/utils/useDrizzle'
import type { AuthenticatorTransportFuture } from '@simplewebauthn/types';

export default defineEventHandler(async (event) => {
	const body = await readBody(event) as { email: string }
	const db = useDrizzle()

	if (!body.email || body.email.trim() === '') {
		throw createError({ statusCode: 400, message: 'Invalid email provided' });
	}

	const user = await db.query.Users.findFirst({
		where: eq(Users.email, body.email)
	})
	if (!user) throw createError({ statusCode: 400, message: 'User does not exist' })

	const userId = user.id;
	const devices = await db.query.FIDODevices.findMany({ where: eq(FIDODevices.userId, user.id) });

	try {
		const options = await generateRegistrationOptions({
			rpName, rpID,
			userID: isoUint8Array.fromUTF8String(user.userId ?? `${user.id}`),
			timeout: 60000,
			userName: body.email,
			userDisplayName: body.email,
			excludeCredentials: devices.map((dev) => ({
				id: dev.credentialId!!,
				transports: JSON.parse(<string>dev.transports) as AuthenticatorTransportFuture[]
			})),
			attestationType: 'none',
			authenticatorSelection: {
				residentKey: 'preferred',
				userVerification: 'preferred',
				authenticatorAttachment: 'cross-platform'
			},
			supportedAlgorithmIDs: [-7, -257]
		})

		await db.update(Users).set({
			challenge: options.challenge,
		}).where(eq(Users.id, user.id)).execute()

		return options;
	} catch (error) {
		console.log(error)
		throw createError({
			statusCode: 500,
			message: 'Failed to generate registration options'
		});
	}
})