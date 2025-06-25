
import { pgTable, text, integer, boolean, timestamp, jsonb, pgEnum} from "drizzle-orm/pg-core"


export const levelEnum = pgEnum("level",["success", "error","warning", "info"])
export const roleEnum = pgEnum("role",["user","admin"])

export const userTable = pgTable("users",{
    id:text("id").primaryKey().notNull().unique(),
    name:text("name").notNull(),
    // username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    address:text("address"),
    age: integer("age"),
    phone:text("phone"),
    role:roleEnum("role").notNull().default("user"),
    amountContributed:integer("amountContribute").default(0).notNull(),
    isVerfied:boolean("isVerifed").notNull().default(false),
    district:text("district"),
    documentType: text("documentType"),
    documentNumber:text("documentNumber"),
    documentPhoto: text("documentPhoto").array(),
    occupation:text("occupation"),
    nationality:text("nationality").default("Sierra Leonean"),
    profilePicture:text("profilePicure"),
    createdAt:timestamp("createdAt", {withTimezone:true}).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt",{ withTimezone: true}).defaultNow().notNull(),
})


export const campiagnTable = pgTable("campaigns",{
    id: text("id").primaryKey().notNull().unique(),
    title: text("title").notNull().unique(),
    fundingGoal:integer("fundingGoal").notNull(),
    amountReceived:integer("amountRecieved").default(0).notNull(),
    location:text("location").notNull(),
    campaignEndDate:timestamp("campaignEndDate", { withTimezone: true}).notNull(),
    creatorId:text("userId").references(() => userTable.id, { onDelete: "cascade" }).notNull(),
    category:text("category").notNull(),
    image:text("images").array().notNull(),
    shortDescription:text("short description").notNull(),
    fullStory:text("fullStory").notNull(),
    tags:text("tags").array().notNull(),
    createdAt:timestamp("createdAt", {withTimezone:true}).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt",{ withTimezone: true}).defaultNow().notNull(),
})


export const commentTable = pgTable("comments",{
    id:text("id").primaryKey().notNull().unique(),
    message:text("message").notNull(),
    campaignId:text("campaignId").references(() => campiagnTable.id, { onDelete:"cascade"}).notNull(),
    userId: text("userId").references(() => userTable.id, { onDelete: "cascade"}).notNull(),
    createdAt:timestamp("createdAt", {withTimezone:true}).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt",{ withTimezone: true}).defaultNow().notNull(),
})

export const updateTable = pgTable("updates",{
    id:text("id").notNull().primaryKey().unique(),
    title:text("title").notNull(),
    message:text("message").notNull(),
    campaignId:text("campaignId").notNull().references(() => campiagnTable.id, { onDelete: "cascade"}),
    createdAt:timestamp("createdAt", {withTimezone:true}).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt",{ withTimezone: true}).defaultNow().notNull(),
})

export const paymentTable = pgTable("payments",{
    id:text("id").notNull().primaryKey().unique(),
    userId:text("userId").notNull().references(() => userTable.id, {onDelete: "cascade"}),
    amount:integer("amount").notNull(),
    campaignId:text("campaignId").notNull().references(() => campiagnTable.id, {onDelete:"cascade"}),
    monimeId:text("monimeId").notNull(),
    isCompleted:boolean("isCompleted").notNull().default(false),
    createdAt:timestamp("createdAt", {withTimezone:true}).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt",{ withTimezone: true}).defaultNow().notNull(),
})

export const logTable = pgTable("logs",{
    id:text("id").primaryKey().notNull().unique(),
    level:levelEnum("level").notNull(),
    timestamp:timestamp("timestamp", { withTimezone: true}).notNull(),
    category: text("category").notNull(),
    user:text("user").notNull(),
    details:text("details").notNull(),
    ipAddress:text("ipAddress").notNull(),
    userAgent:text("userAgent").notNull(),
    metaData:jsonb("metaData").notNull(),
})



