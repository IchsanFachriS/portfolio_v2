import { boolean, integer, pgSchema, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "./id";

// Dedicated schema so we never collide with other apps sharing this database
export const portfolio = pgSchema("portfolio");
const pgTable = portfolio.table;

const id = () => text("id").primaryKey().$defaultFn(createId);

export const users = pgTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Satu baris saja (id = "main")
export const profile = pgTable("profile", {
  id: text("id").primaryKey().default("main"),
  name: text("name").notNull(),
  headline: text("headline").notNull(),
  location: text("location"),
  email: text("email").notNull(),
  phone: text("phone"),
  linkedin: text("linkedin"),
  github: text("github"),
  summary: text("summary").notNull(),
  avatarUrl: text("avatar_url"),
  cvUrl: text("cv_url"),
  education: text("education"),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const experience = pgTable("experience", {
  id: id(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  period: text("period").notNull(),
  bullets: text("bullets").notNull(), // satu poin per baris
  order: integer("order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
});

export const project = pgTable("project", {
  id: id(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  techStack: text("tech_stack").notNull(), // dipisah koma
  imageUrl: text("image_url"),
  link: text("link"),
  repo: text("repo"),
  order: integer("order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
});

export const award = pgTable("award", {
  id: id(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  date: text("date").notNull(),
  note: text("note"),
  order: integer("order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
});

export const skillGroup = pgTable("skill_group", {
  id: id(),
  name: text("name").notNull(),
  items: text("items").notNull(), // dipisah koma
  order: integer("order").default(0).notNull(),
});

export const media = pgTable("media", {
  id: id(),
  key: text("key").notNull().unique(),
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
