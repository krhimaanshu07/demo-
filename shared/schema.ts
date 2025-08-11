import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const dicomFiles = pgTable("dicom_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalName: text("original_name").notNull(),
  filename: text("filename").notNull(),
  filepath: text("filepath").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  processed: boolean("processed").default(false),
  processedFileId: varchar("processed_file_id"),
});

export const insertDicomFileSchema = createInsertSchema(dicomFiles).omit({
  id: true,
  uploadedAt: true,
});

export type InsertDicomFile = z.infer<typeof insertDicomFileSchema>;
export type DicomFile = typeof dicomFiles.$inferSelect;

// Upload response schema
export const uploadResponseSchema = z.object({
  success: z.boolean(),
  fileId: z.string(),
  url: z.string(),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;

// Process response schema
export const processResponseSchema = z.object({
  success: z.boolean(),
  resultId: z.string(),
  url: z.string(),
});

export type ProcessResponse = z.infer<typeof processResponseSchema>;
