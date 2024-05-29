import { drizzle } from 'drizzle-orm/d1';
import { sqliteTable,  text } from 'drizzle-orm/sqlite-core';

export const emails = sqliteTable('emails', {
	id: text("id").primaryKey().notNull(), // 텍스트 타입의 기본키이며 NULL이 아닌 값을 요구함
	from: text("from").notNull(), // 보내는 사람 주소
	to: text("to").notNull(), // 받는 사람 주소
	key: text("key") // 옵션으로 추가적인 키 필드
})

export const users = sqliteTable('users', {
	email: text("email").notNull(),
})

export default function useDrizzle(db: D1Database) {
	return drizzle(db, { schema: { emails, users } });
}
