import { pgTable, uuid, varchar, text, integer, timestamp, boolean, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (for future authentication)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Appliances table
export const appliances = pgTable('appliances', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id), // Made optional by removing .notNull()
  name: varchar('name', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 255 }).notNull(),
  model: varchar('model', { length: 255 }).notNull(),
  purchaseDate: timestamp('purchase_date').notNull(),
  warrantyDurationMonths: integer('warranty_duration_months').notNull(),
  serialNumber: varchar('serial_number', { length: 255 }),
  purchaseLocation: varchar('purchase_location', { length: 255 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Support contacts table
export const supportContacts = pgTable('support_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  applianceId: uuid('appliance_id').references(() => appliances.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 500 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Maintenance tasks table
export const maintenanceTasks = pgTable('maintenance_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  applianceId: uuid('appliance_id').references(() => appliances.id, { onDelete: 'cascade' }).notNull(),
  taskName: varchar('task_name', { length: 255 }).notNull(),
  scheduledDate: timestamp('scheduled_date').notNull(),
  frequency: varchar('frequency', { length: 50 }).notNull(), // 'One-time', 'Monthly', 'Yearly', 'Custom'
  serviceProvider: json('service_provider').$type<{
    name: string;
    phone?: string;
    email?: string;
    notes?: string;
  }>(),
  notes: text('notes'),
  status: varchar('status', { length: 50 }).notNull().default('Upcoming'), // 'Upcoming', 'Completed', 'Overdue'
  completedDate: timestamp('completed_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Linked documents table
export const linkedDocuments = pgTable('linked_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  applianceId: uuid('appliance_id').references(() => appliances.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  url: varchar('url', { length: 1000 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const appliancesRelations = relations(appliances, ({ one, many }) => ({
  user: one(users, {
    fields: [appliances.userId],
    references: [users.id],
  }),
  supportContacts: many(supportContacts),
  maintenanceTasks: many(maintenanceTasks),
  linkedDocuments: many(linkedDocuments),
}));

export const supportContactsRelations = relations(supportContacts, ({ one }) => ({
  appliance: one(appliances, {
    fields: [supportContacts.applianceId],
    references: [appliances.id],
  }),
}));

export const maintenanceTasksRelations = relations(maintenanceTasks, ({ one }) => ({
  appliance: one(appliances, {
    fields: [maintenanceTasks.applianceId],
    references: [appliances.id],
  }),
}));

export const linkedDocumentsRelations = relations(linkedDocuments, ({ one }) => ({
  appliance: one(appliances, {
    fields: [linkedDocuments.applianceId],
    references: [appliances.id],
  }),
})); 