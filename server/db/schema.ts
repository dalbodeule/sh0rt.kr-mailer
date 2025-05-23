import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core';

export const Emails = sqliteTable('emails', {
	id: text("id").primaryKey().notNull(), // 텍스트 타입의 기본키이며 NULL이 아닌 값을 요구함
	from: text("from").notNull(), // 보내는 사람 주소
	to: text("to").notNull(), // 받는 사람 주소
	key: text("key") // 옵션으로 추가적인 키 필드
})

export const Users = sqliteTable('users', {
	id: int("id").primaryKey( { autoIncrement: true }).notNull(),
	userId: text('user_id'),
	email: text("email").notNull(),
	challenge: text("challenge"),
})

export const FIDODevices = sqliteTable('fido_devices', {
	id: int("id").primaryKey({ autoIncrement: true }).notNull(),
	userId: int("userId").references(() => Users.id, { onDelete: 'cascade' }),
	credentialId: text("credential_id"),
	publicKey: text("public_key"),
	counter: int("counter"),
	transports: text("transports"),
})