import { Users, FIDODevices } from '~/server/db/schema'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import type { RegistrationResponseJSON } from '@simplewebauthn/types'
import { rpID, rpOrigin } from '~/server/utils/rp'
import { useDrizzle } from '~/server/utils/useDrizzle'

export default defineEventHandler(async(event) => {
	const { email, attResp } = (await readBody(event)) as { email: string, attResp: RegistrationResponseJSON }
	const db = useDrizzle()

	console.log(email, attResp)

	const user = await db.query.Users.findFirst({
		where: eq(Users.email, email)
	}).execute()
	if (!user) throw createError({statusCode: 400, message: 'User does not exist'})

	let verification;
	try {
		verification = await verifyRegistrationResponse({
			response: attResp,
			expectedChallenge: user.challenge ?? '',
			expectedOrigin: rpOrigin,
			expectedRPID: rpID
		})
	} catch(e) {
		console.log(e)
		throw createError({
			statusCode: 400,
			message: 'Registration verification failed'
		})
	}

	if(verification && verification.verified) {
		const registrationInfo = verification.registrationInfo!;
		await db.insert(FIDODevices).values({
			userId: user.id,
			credentialId: Buffer.from(registrationInfo.credential.id).toString('base64url'),
			publicKey: Buffer.from(registrationInfo.attestationObject).toString('base64url'),
			counter: registrationInfo.credential.counter,
			transports: JSON.stringify(registrationInfo.credential.transports)
		}).execute()

		return new Response("Registration successful", { status: 200 })
	} else throw createError({message: "Registration verification failed", statusCode: 400})
})