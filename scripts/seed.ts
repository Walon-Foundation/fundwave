import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { reset } from "drizzle-seed";
import bcrypt from "bcryptjs";
import cuid from "cuid";

async function seed() {
  console.log("Seeding database...");

  try {
    // Clear existing data
    console.log("Resetting database...");
    await reset(db, schema);
    console.log("Database reset complete.");

    // Create users
    const users = [
      {
        id: cuid(),
        name: "Aminata Kamara",
        email: "aminata@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user" as const,
      },
      {
        id: cuid(),
        name: "Musa Conteh",
        email: "musa@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user" as const,
      },
      {
        id: cuid(),
        name: "Admin User",
        email: "admin@example.com",
        password: await bcrypt.hash("adminpass", 10),
        role: "admin" as const,
      },
    ];

    await db.insert(schema.userTable).values(users);
    console.log(`Seeded ${users.length} users.`);

    // Create campaigns
    const campaigns = [
      {
        id: cuid(),
        title: "Build a School in Kono",
        shortDescription: "Help build a new primary school in Kono.",
        fullStory: "The children of Kono need a safe and modern space to learn. This project will fund the construction of a new primary school, complete with classrooms, a library, and a playground. Your contribution will make a lasting impact on their future.",
        fundingGoal: 500000000,
        amountReceived: 125000000,
        creatorId: users[0].id,
        creatorName: users[0].name,
        category: "education" as const,
        status: "active" as const,
        location: "Kono, Sierra Leone",
        campaignEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        image: "/images/school.jpg",
        tags: ["education", "school", "children"],
      },
      {
        id: cuid(),
        title: "Clean Water for Freetown",
        shortDescription: "Provide clean drinking water to communities in Freetown.",
        fullStory: "Access to clean water is a basic human right. This campaign will fund the installation of water purification systems and new wells in several Freetown communities, reducing waterborne illnesses and improving overall health.",
        fundingGoal: 300000000,
        amountReceived: 25000000,
        creatorId: users[1].id,
        creatorName: users[1].name,
        category: "health" as const,
        status: "active" as const,
        location: "Freetown, Sierra Leone",
        campaignEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        image: "/images/water.jpg",
        tags: ["water", "health", "community"],
      },
    ];

    await db.insert(schema.campaignTable).values(campaigns);
    console.log(`Seeded ${campaigns.length} campaigns.`);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
