import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["student", "admin"] }).default("student").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type User = typeof users.$inferSelect;

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  originalFileName: text("original_file_name").notNull(),
  serviceType: text("service_type", { enum: ["paraphrase", "format", "both"] }).notNull(),
  price: integer("price").notNull(),
  status: text("status", { enum: ["pending", "processing", "completed", "failed"] }).default("pending").notNull(),
  progress: integer("progress").default(0).notNull(),
  resultFilePath: text("result_file_path"),
  errorMessage: text("error_message"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Order = typeof orders.$inferSelect;

export const uploadedFiles = sqliteTable("uploaded_files", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  status: text("status", { enum: ["uploaded", "parsing", "parsed", "error"] }).default("uploaded").notNull(),
  uploadedAt: text("uploaded_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type UploadedFile = typeof uploadedFiles.$inferSelect;
