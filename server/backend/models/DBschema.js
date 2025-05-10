const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true}, // Username
    personName: { type: String, required: true }, // Full name
    email: { type: String, required: true}, // Login Email
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

// WMSs Schema
const wmsSchema = new mongoose.Schema({
    document_id: { type: String, required: true },
    name: { type: String, required: true },
    projectId: { type: String, required: true },
    version: { type: String, required: true },
    description: { type: String },
    importantNote: { type: String },
    importantNoteAcceptedby: { type: [String] },
    workType: { type: String },
    locoId: { type: mongoose.Schema.Types.ObjectId, ref: "LocoType" },
    fileType: { type: String },
    filePath: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    authorisedBy: { type: String },
    verifiedBy: { type: String },
    approvedBy: { type: String },
    assignedSupervisor: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    assignedEngineer: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    isActive: { type: Boolean, default: true },
    comments: { type: String },
    historyVersionId:{ type: String }
});
// Work Tables Schema
const workTableSchema = new mongoose.Schema({
    tableId: { type: String, required: true }, // Unique table ID
    title: { type: String, required: true }, // Title of the table
    referenceName: { type: String }, // Reference name (e.g., "Table 1")
    assignedSupervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assigned supervisor
    assignedEngineer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assigned engineer
    disciplineRequire: { type: mongoose.Schema.Types.ObjectId, ref: "Discipline" }, // Discipline required
    parentsWMS: { type: mongoose.Schema.Types.ObjectId, ref: "WMS" }, // Parent WMS reference
    historyVersionTableId: { type: String }, // Previous version ID
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who created the table
    createdAt: { type: Date, default: Date.now }, // Creation timestamp
    updateHistory: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who updated
        updatedAt: { type: Date, default: Date.now }, // Update timestamp
      },
    ],
    isActive: { type: Boolean, default: true }, // Active status
  
    columns: [
      {
        id: { type: Number, required: true }, // Column ID
        headerText: { type: String, required: true }, // Column title
        columnData: { type: String }, // Optional data
        widthWeight: { type: Number }, // UI layout weight
        columnType: { type: Number }, // Column type (e.g., 0 = Text, 4 = User Input)
        isOptional: { type: Boolean, default: false },
        isHidden: { type: Boolean, default: false },
        resetValueOnLocalChange: { type: Boolean, default: false },
        forceResetValueOnGlobalChange: { type: Boolean, default: false },
        resetValueOnGlobalChange: { type: Boolean, default: false },
        postChangeResetAction: { type: Boolean, default: false },
      },
    ],
  
    rows: [
      {
        id: { type: Number, required: true }, // Row ID
        headerRowText: { type: String }, // Instructional header
        cells: [
          {
            columnId: { type: Number, required: true }, // Column this cell belongs to
            labelText: { type: String }, // Cell content
            verticalMerge: { type: Number }, // For UI merging
            metadata: { type: String },
            legacyLabelText: { type: String },
          },
        ],
      },
    ],
  });

// Tasks Schema
const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    highlight: { type: [String] },
    assignedSupervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedEngineer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    disciplineRequire: { type: mongoose.Schema.Types.ObjectId, ref: "Discipline" },
    parentsTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    parentsWMS: { type: mongoose.Schema.Types.ObjectId, ref: "WMS" },
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
    WMS: mongoose.model("WMS", wmsSchema),
    Task: mongoose.model("Task", taskSchema),
    Discipline: mongoose.model("Discipline", disciplineSchema),
    Log: mongoose.model("Log", logSchema),
    WorkTable: mongoose.model("WorkTable", workTableSchema)
};