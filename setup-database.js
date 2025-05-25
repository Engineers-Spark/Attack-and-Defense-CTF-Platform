// MongoDB setup script for Attack and Defense CTF Platform
// Run this script with: mongosh --file setup-database.js

// Database configuration
const dbName = "ctf-platform"

// Import the db object
const db = db.getSiblingDB(dbName)

// Clear existing collections
db.teams.drop()
db.flags.drop()
db.chatMessages.drop()
db.admins.drop()

// Create collections with validation
db.createCollection("teams", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "username", "password", "score", "flags"],
      properties: {
        name: {
          bsonType: "string",
          description: "Team name must be a string and is required",
        },
        username: {
          bsonType: "string",
          description: "Username must be a string and is required",
        },
        password: {
          bsonType: "string",
          description: "Password must be a string and is required",
        },
        score: {
          bsonType: "int",
          description: "Score must be an integer",
        },
        flags: {
          bsonType: "array",
          description: "Flags must be an array of strings",
        },
      },
    },
  },
})

db.createCollection("flags", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["value", "owner", "submissions"],
      properties: {
        value: {
          bsonType: "string",
          description: "Flag value must be a string and is required",
        },
        owner: {
          bsonType: "string",
          description: "Owner team name must be a string and is required",
        },
        submissions: {
          bsonType: "array",
          description: "Submissions must be an array",
        },
      },
    },
  },
})

db.createCollection("chatMessages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nickname", "message", "teamName"],
      properties: {
        nickname: {
          bsonType: "string",
          description: "Nickname must be a string and is required",
        },
        message: {
          bsonType: "string",
          description: "Message must be a string and is required",
        },
        teamName: {
          bsonType: "string",
          description: "Team name must be a string and is required",
        },
      },
    },
  },
})

db.createCollection("admins", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "password"],
      properties: {
        username: {
          bsonType: "string",
          description: "Username must be a string and is required",
        },
        password: {
          bsonType: "string",
          description: "Password must be a string and is required",
        },
      },
    },
  },
})

// Create indexes
db.teams.createIndex({ name: 1 }, { unique: true })
db.teams.createIndex({ username: 1 }, { unique: true })
db.flags.createIndex({ value: 1 }, { unique: true })
db.admins.createIndex({ username: 1 }, { unique: true })

// Create default admin account with plaintext password
// We'll handle password hashing in the application
db.admins.insertOne({
  username: "admin",
  password: "admin", // Plaintext password for initial login
  createdAt: new Date(),
  updatedAt: new Date(),
})

print("Database setup complete!")
print("Default admin credentials:")
print("Username: admin")
print("Password: admin")
print("The password will be automatically hashed on first login.")
