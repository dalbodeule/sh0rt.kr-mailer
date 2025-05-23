import { Backup } from 'cloudflare-email-backup';
import { CATCH_ALL, EmailRouter, REJECT_ALL, SizeGuard } from 'cloudflare-email';
import { EmailKit } from 'cloudflare-email-kit';
import { eq } from 'drizzle-orm';
import { Users } from '~/server/db/schema';

export default defineNitroPlugin(nitro =>{
	/* nitro.hooks.hook("cloudflare:email", async (event) => {
		const db = useDrizzle()
		const backup = new Backup({
			bucket: event.env.R2,
			prefix: 'backup',
			database: hubDatabase(),
			table: 'emails'
		})

		const router = new EmailRouter()
			.match(CATCH_ALL, async (m) => {
				const user = await db.query.Users.findFirst({ where: eq(Users.email, m.to) })

				if(user)
					await backup.save(
						m.headers.get("Message-ID"),
						m.from,
						m.to,
						await m.raw(),
					);
				else
					await REJECT_ALL("email address not founded")[1](m)
			})
			.match(...REJECT_ALL("email address not founded"))

		const kit = new EmailKit()
			.use(new SizeGuard(10 * 1024 * 1024))
			.use(router)

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		await kit.process(event.event)
	}) */
})