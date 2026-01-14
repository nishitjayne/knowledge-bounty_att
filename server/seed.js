// server/seed.js
const mongoose = require('mongoose');
require('dotenv').config();

// Define the Schema (Same as in your server.js)
const BountySchema = new mongoose.Schema({
    title: String,
    category: String,
    points: Number,
    requester: String,
    helper: { type: String, default: null },
    status: { type: String, default: 'open' },
});

const Bounty = mongoose.model('Bounty', BountySchema);

const sampleBounties = [
    { title: "Explain our React folder structure", category: "Technical", points: 20, requester: "Sarah Jones", status: "open" },
    { title: "How to use the new Expense Reimbursement tool?", category: "Process", points: 15, requester: "Mike Chen", status: "open" },
    { title: "Quick Figma crash course for devs", category: "Design", points: 30, requester: "Emily Davis", status: "claimed", helper: "Alex Smith" },
    { title: "Help me debug this Docker Compose file", category: "Technical", points: 50, requester: "John Doe", status: "open" },
    { title: "Show me how to use the coffee machine in Breakroom B", category: "Office", points: 5, requester: "New Hire", status: "resolved", helper: "Office Manager" },
    { title: "SQL Window Functions 101", category: "Technical", points: 25, requester: "Data Analyst A", status: "open" }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bountyDB');
        console.log("Connected to MongoDB for seeding...");
        
        // Clear existing data so you don't get duplicates
        await Bounty.deleteMany({});
        console.log("Cleared old bounties.");

        // Insert new data
        await Bounty.insertMany(sampleBounties);
        console.log("Database Seeded successfully! 🌱");
        
        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedDB();