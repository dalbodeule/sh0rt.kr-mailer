import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { Users, FIDODevices } from '~/server/db/schema';
import { rpID } from '~/server/utils/rp'

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { email } = body;

	if (!email) {
		throw createError({
			statusCode: 400,
			message: 'Email is required'
		});
	}

	const db = useDrizzle()
	const user = await db.query.Users.findFirst({
		where: eq(Users.email, email),
	}).execute()

	if (!user) {
		throw createError({
			statusCode: 404,
			message: 'User not found'
		});
	}

	const fidoKeys = await db.query.FIDODevices.findMany({
		where: eq(FIDODevices.userId, user.id)
	})

	return await generateAuthenticationOptions({
		timeout: 60000,
		allowCredentials: fidoKeys.map((key) => ({
			id: key.credentialId!!,
			transports: JSON.parse(key.transports ?? '[]')
		})),
		userVerification: 'discouraged',
		rpID
	});
});