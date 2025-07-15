import {
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// =======================
// ENUMS
// =======================

export const userRoles = ["operator", "user"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum("user_roles", userRoles);

export const oAuthProviders = ["google"] as const;
export type OAuthProvider = (typeof oAuthProviders)[number];
export const oAuthProviderEnum = pgEnum("oauth_provides", oAuthProviders);

// =======================
// USER TABLE
// =======================

export const UserTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text(), // nullable for guest users
  salt: text(),
  role: userRoleEnum().notNull().default("user"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// =======================
// OAUTH ACCOUNTS
// =======================

export const UserOAuthAccountTable = pgTable(
  "user_oauth_accounts",
  {
    userId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    provider: oAuthProviderEnum().notNull(),
    providerAccountId: text().notNull().unique(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.providerAccountId, t.provider] })]
);

// =======================
// OPERATOR PROFILE
// =======================

export const OperatorProfileTable = pgTable("operator_profiles", {
  id: uuid().primaryKey().defaultRandom(),

  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),

  logoUrl: text(),
  logoPath: text(),
  logoFilename: text(),
  logoMimeType: text(),
  logoSize: integer(),
  logoUploadedAt: timestamp({ withTimezone: true }),

  name: text().notNull(),
  email: text().notNull(),
  phoneNumber: text().notNull(),

  description: text(),
  address: text(),
  website: text(),

  socialMediaLinks: jsonb("social_media_links"),
  servicesOffered: jsonb("services_offered").default([]),

  stripeAccountId: text(),
  taxId: text(),

  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// =======================
// TOURS TABLE
// =======================

export const ToursTable = pgTable("tours", {
  id: uuid().primaryKey().defaultRandom(),

  operatorId: uuid()
    .notNull()
    .references(() => OperatorProfileTable.id, { onDelete: "cascade" }),

  title: text().notNull(),
  slug: text().notNull().unique(),
  price: integer().notNull(),
  duration: integer().notNull(),
  capacity: integer().notNull(),
  location: text().notNull(),
  description: text().notNull(),
  itinerary: jsonb("itinerary").default([]).notNull(),
  included: jsonb("included").default([]).notNull(),
  images: jsonb("images").default([]).notNull(),
  availability: jsonb("availability").default([]).notNull(),

  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// =======================
// BOOKINGS TABLE (NEW)
// =======================

export const BookingsTable = pgTable("bookings", {
  id: uuid().primaryKey().defaultRandom(),

  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),

  tourId: uuid()
    .notNull()
    .references(() => ToursTable.id, { onDelete: "cascade" }),

  date: timestamp({ withTimezone: true }).notNull(),
  numPeople: integer().notNull().default(1),
  specialRequests: text(),
  tourTimeSlotId: uuid().references(() => TourTimeSlotsTable.id, {
    onDelete: "cascade",
  }),

  verificationToken: text().unique(),

  status: text().notNull().default("pending"),

  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// =======================
// TOUR AVAILABILITY TABLE
// =======================

export const TourAvailabilityTable = pgTable("tour_availability", {
  id: uuid().primaryKey().defaultRandom(),
  tourId: uuid()
    .notNull()
    .references(() => ToursTable.id, { onDelete: "cascade" }),
  date: date().notNull(),
  capacity: integer().notNull(),

  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// =======================
// TOUR TIME SLOTS TABLE
// =======================

export const TourTimeSlotsTable = pgTable("tour_time_slots", {
  id: uuid().primaryKey().defaultRandom(),

  tourAvailabilityId: uuid()
    .notNull()
    .references(() => TourAvailabilityTable.id, { onDelete: "cascade" }),

  start: text().notNull(), // e.g., '09:00'
  end: text().notNull(), // e.g., '10:00'
  isAvailable: boolean().notNull().default(true),
  capacity: integer().notNull(),

  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// =======================
// RELATIONS
// =======================

export const userRelations = relations(UserTable, ({ many, one }) => ({
  oAuthAccounts: many(UserOAuthAccountTable),
  operatorProfile: one(OperatorProfileTable, {
    fields: [UserTable.id],
    references: [OperatorProfileTable.userId],
  }),
  bookings: many(BookingsTable),
}));

export const userOauthAccountRelations = relations(
  UserOAuthAccountTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserOAuthAccountTable.userId],
      references: [UserTable.id],
    }),
  })
);

export const operatorProfileRelations = relations(
  OperatorProfileTable,
  ({ one, many }) => ({
    user: one(UserTable, {
      fields: [OperatorProfileTable.userId],
      references: [UserTable.id],
    }),
    tours: many(ToursTable),
  })
);

export const toursRelations = relations(ToursTable, ({ one, many }) => ({
  operator: one(OperatorProfileTable, {
    fields: [ToursTable.operatorId],
    references: [OperatorProfileTable.id],
  }),
  bookings: many(BookingsTable),
}));

export const bookingsRelations = relations(BookingsTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [BookingsTable.userId],
    references: [UserTable.id],
  }),
  tour: one(ToursTable, {
    fields: [BookingsTable.tourId],
    references: [ToursTable.id],
  }),
}));

export const tourAvailabilityRelations = relations(
  TourAvailabilityTable,
  ({ many }) => ({
    timeSlots: many(TourTimeSlotsTable),
  })
);

export const tourTimeSlotRelations = relations(
  TourTimeSlotsTable,
  ({ one }) => ({
    availabilityDate: one(TourAvailabilityTable, {
      fields: [TourTimeSlotsTable.tourAvailabilityId],
      references: [TourAvailabilityTable.id],
    }),
  })
);
