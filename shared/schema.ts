import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const presentations = pgTable("presentations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slides: text("slides").array().notNull(),
});

export const insertPresentationSchema = createInsertSchema(presentations).omit({
  id: true,
}).extend({
  slides: z.array(z.string().min(1, "Slide text cannot be empty")).min(1, "At least one slide is required"),
});

export type InsertPresentation = z.infer<typeof insertPresentationSchema>;
export type Presentation = typeof presentations.$inferSelect;
