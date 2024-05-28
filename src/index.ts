import { EmailKit, EmailRouter, SizeGuard } from 'cloudflare-email';
import { Backup } from 'cloudflare-email-backup'

export interface Env {
	R2: R2Bucket,
	D1: D1Database
}

export default {
	async email(message: ForwardableEmailMessage, env: Env): Promise<void> {
		const kit = new EmailKit()
			.use(new SizeGuard(10 * 1024 * 1024))
			.use(new Backup({
				bucket: env.R2,
				prefix: 'backup',
				database: env.D1,
				table: 'emails'
			}))
	},
	async fetch(batch: MessageBatch<void>, env: Env): Promise<void> {
		const backup = new Backup({
				bucket: env.R2,
				prefix: 'backup',
				database: env.D1,
				table: 'emails'
			})
	}
}
