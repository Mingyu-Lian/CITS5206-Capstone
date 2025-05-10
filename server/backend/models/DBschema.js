const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: false }, // Username
    personName: { type: String, required: true }, // Full name
    email: { type: String, required: true, unique: true }, // Login Email
    passwordHash: { type: String, required: true }, // Encrypted password
    role: { type: String, required: true }, // Role: admin, supervisor, engineer, etc.
    discipline: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discipline" }], // Reference to the discipline}
    isActive: { type: Boolean, default: true }, 
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Loco_Types Schema
const locoTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }, 
});

// Baselines Schema
const baselineSchema = new mongoose.Schema({
  softwareName: { type: String, required: true }, // Name of the software
  description: { type: String }, // Overall description
  isActive: { type: Boolean, default: true }, // If still active/deleted

  versions: [
    {
      versionId: { type: String, required: true }, // Unique version ID
      version: { type: String, required: true }, // Version string (e.g., "1.01")
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who created this version
      createdAt: { type: Date, default: Date.now }, // Version creation time
      note: { type: String }, // Optional notes
      isActive: { type: Boolean, default: true }, // If still active/deleted

      usageHistory: [
        {
          usedInLoco: [{ type: Number }], // LocoIDs, refer to Assets.locoID
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Usage userID
          usedAt: { type: Date, default: Date.now }, // Use time
        },
      ],
      updateHistory: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Update userID
          updatedAt: { type: Date, default: Date.now }, // Update time
        },
      ],
    },
  ],
});

// Assets Schema
const assetSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    assetType: { type: String, required: true },
    locoID: { type: Number },
    locoType: { type: mongoose.Schema.Types.ObjectId, ref: "LocoType" },
    status: { type: String, required: true },
    parentAsset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
    isActive: { type: Boolean, default: true }, 
});

// Projects Schema
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updateHistory: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      updatedAt: { type: Date, default: Date.now }
  }],
  isActive: { type: Boolean, default: true }
});


// Work Tables Schema
// WorkTableCommissioning Schema
const workTableCommissioningSchema = new mongoose.Schema({
  meta: {
    type: {
      type: String,
      default: "commissioning"
    },
    locoId: { type: String },
    projectId: { type: String },
    assignedSupervisor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    assignedEngineer: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updateHistory: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      updatedAt: { type: Date, default: Date.now }
    }],
    Version: { type: String },
    historyVersionTableId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkTableCommissioning" },
    isActive: { type: Boolean, default: true }
  },
  Content: {
    documentId: { type: String, required: true },
    projectId: { type: String, required: true },
    documentType: { type: String, required: true },
    documentNumber: { type: String, required: true },
    documentTitle: { type: String, required: true },
    documentStatus: { type: String, required: true },
    revision: { type: String, required: true },
    issueDate: { type: Date, required: true },
    createdBy: { type: String, required: true },
    approvedBy: { type: String, required: true },
    sections: [
      {
        sectionId: { type: String, required: true },
        sectionTitle: { type: String, required: true },
        content: { type: String, required: true },
        attachments: [
          {
            fileId: { type: String, required: true },
            fileName: { type: String, required: true },
            fileType: { type: String, required: true },
            fileUrl: { type: String, required: true }
          }
        ]
      }
    ]
  }
});


// Tasks Schema
const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    highlight: { type: [String] },
    assignedSupervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedEngineer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    disciplineRequire: { type: mongoose.Schema.Types.ObjectId, ref: "Discipline" },
    parentsTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },

    status: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    comments: { type: String },
    updatedAt: { type: Date, default: Date.now },
    components: { type: [String] },
    attachments: { type: [String] },
    location: { type: String },
    takeNote: { type: String },
    visualSupport: { type: [String] },
    signoff: { type: String },
    Baseline: { type: [Object] }
});

// Disciplines Schema
const disciplineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  client: { type: String },
  isActive: { type: Boolean, default: true },
});

// Logs Schema
const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  locoID: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
  details: { type: String },
  actionTime: { type: Date, required: true },
  recordTime: { type: Date, default: Date.now },
  ip: { type: String },
});

// Exporting Models
module.exports = {
    User: mongoose.model("User", userSchema),
    LocoType: mongoose.model("LocoType", locoTypeSchema),
    Baseline: mongoose.model("Baseline", baselineSchema),
    Asset: mongoose.model("Asset", assetSchema),
    Project: mongoose.model("Project", projectSchema),
    Task: mongoose.model("Task", taskSchema),
    Discipline: mongoose.model("Discipline", disciplineSchema),
    Log: mongoose.model("Log", logSchema),
    WorkTable: mongoose.model("WorkTable", workTableCommissioningSchema)
};