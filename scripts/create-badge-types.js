require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  // Connect to the contract
  const prepmeBadgesNFTContract = await ethers.getContractAt(
    "PrepMeBadges",
    "0x054e90A623003AF69B46B18b224FAf204835E210"
  );

  // Define badge types
  const badgeTypes = [
    {
      name: "Welcome to Prepme",
      description: "Earned by joining Prepme and completing onboarding.",
      metadataURI: "welcome-to-prepme/badge.json"
    },
    {
      name: "First Exam Practice",
      description: "Earned by completing your first exam practice and attempting all questions.",
      metadataURI: "first-exam-practice/badge.json"
    },
    {
      name: "Focused Learner",
      description: "Earned by completing a 7-day streak.",
      metadataURI: "focused-learner/badge.json"
    },
    {
      name: "Relentless Scholar",
      description: "Earned by completing a 30-day streak.",
      metadataURI: "relentless-scholar/badge.json"
    },
    {
      name: "Master of Persistence",
      description: "Earned by completing a 100-day streak.",
      metadataURI: "master-of-persistence/badge.json"
    },
    {
      name: "Steadfast Achiever",
      description: "Earned by practicing every day for a month.",
      metadataURI: "steadfast-achiever/badge.json"
    },
    {
      name: "Study Buddy",
      description: "Earned by inviting 10+ people.",
      metadataURI: "study-buddy/badge.json"
    },
    {
      name: "Math Prodigy",
      description: "Earned by scoring 100% in Maths exams.",
      metadataURI: "math-prodigy/badge.json"
    },
    {
      name: "History Buff",
      description: "Earned by scoring 100% in history exams.",
      metadataURI: "history-buff/badge.json"
    },
    {
      name: "Physics Genius",
      description: "Earned by scoring 100% in Physics exams.",
      metadataURI: "physics-genius/badge.json"
    },
    {
      name: "Biology Expert",
      description: "Earned by scoring 100% in Biology exams.",
      metadataURI: "biology-expert/badge.json"
    },
    {
      name: "English Maven",
      description: "Earned by scoring 100% in English exams.",
      metadataURI: "english-maven/badge.json"
    },
    {
      name: "Civic Champion",
      description: "Earned by scoring 100% in Civic Education exams.",
      metadataURI: "civic-champion/badge.json"
    },
    {
      name: "Chemistry Wizard",
      description: "Earned by scoring 100% in Chemistry exams.",
      metadataURI: "chemistry-wizard/badge.json"
    },
    {
      name: "CRS Luminary",
      description: "Earned by scoring 100% in CRS exams.",
      metadataURI: "crs-luminary/badge.json"
    },
    {
      name: "Science Star",
      description: "Earned by scoring 90%+ in all science subjects (Physics, Biology, Chemistry).",
      metadataURI: "science-star/badge.json"
    },
    {
      name: "Humanities Hero",
      description: "Earned by scoring 90%+ in all humanities (History, Civic Education, CRS, etc.).",
      metadataURI: "humanities-hero/badge.json"
    },
    {
      name: "Grammar Guru",
      description: "Earned by answering all grammar questions correctly in an English exam.",
      metadataURI: "grammar-guru/badge.json"
    },
    {
      name: "Formula Master",
      description: "Earned by solving 10 consecutive Physics or Math questions correctly.",
      metadataURI: "formula-master/badge.json"
    },
    {
      name: "Ecosystem Explorer",
      description: "Earned by scoring perfect marks in environmental biology questions.",
      metadataURI: "ecosystem-explorer/badge.json"
    },
    {
      name: "The Alchemist",
      description: "Earned by correctly solving a chemistry exam involving chemical equations.",
      metadataURI: "the-alchemist/badge.json"
    }
  ];

  // Create badge types and store IDs
  const badgeTypeIds = [];
  
  for (const badge of badgeTypes) {
    console.log(`Creating badge type: ${badge.name}`);
    try {
      const tx = await prepmeBadgesNFTContract.createBadgeType(
        badge.name,
        badge.description,
        badge.metadataURI
      );
      
      const receipt = await tx.wait();
      
      // Extract badge type ID from event logs
      const event = receipt.logs
        .filter(log => log.fragment && log.fragment.name === 'BadgeTypeCreated')
        .map(log => log.args)[0];
      
      const badgeTypeId = event.badgeTypeId;
      badgeTypeIds.push(badgeTypeId);
      
      console.log(`Created badge type: ${badge.name} with ID: ${badgeTypeId}`);
    } catch (error) {
      console.error(`Error creating badge type ${badge.name}:`, error.message);
    }
  }

  console.log("All badge types created successfully!");
  console.log("Badge Type IDs:", badgeTypeIds.join(", "));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
