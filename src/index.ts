import { CATCH_ALL, EmailKit, EmailRouter, REJECT_ALL, SizeGuard } from 'cloudflare-email';
import { Backup } from 'cloudflare-email-backup';
import { EmailQueueMessage } from 'cloudflare-email-queue';
import useDrizzle, { users } from './db/schema';
import { eq } from 'drizzle-orm';

export interface Env {
	R2: R2Bucket,
	DB: D1Database
}

export default {
	async email(message: ForwardableEmailMessage, env: Env): Promise<void> {
		const db = useDrizzle(env.DB)
		const backup = new Backup({
				bucket: env.R2,
				prefix: 'backup',
				database: env.DB,
				table: 'emails'
			})

		const router = new EmailRouter()
			.match(CATCH_ALL, async (m) => {
				const user = await db.query.users.findFirst({ where: eq(users.email, m.to) })

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

		await kit.process(message)
	},
	async fetch(batch: MessageBatch<void>, env: Env): Promise<void> {

	},
	async queue(batch: MessageBatch<EmailQueueMessage>, env: Env) {

	}
}
