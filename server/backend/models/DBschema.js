const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
    Username: { type: String, required: true, unique: true }, // Username
    personName: { type: String, required: true }, // Full name
    email: { type: String, required: true, unique: true }, // Login Email
    passwordHash: { type: String, required: true }, // Encrypted password
    role: { type: String, required: true }, // Role: admin, supervisor, engineer, etc.
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Loco_Types Schema
const locoTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
});

// Baselines Schema
const baselineSchema = new mongoose.Schema({
    softwareName: { type: String, required: true },
    softwareVersion: { type: [String], required: true },
    description: { type: String }
});

// Assets Schema
const assetSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    assetType: { type: String, required: true },
    locoID: { type: Number },
    description: { type: String },
    locoType: { type: mongoose.Schema.Types.ObjectId, ref: "LocoType" },
    status: { type: String, required: true },
    parentAsset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" }
});

// Projects Schema
const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
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
    comments: { type: String }
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
    description: { type: String }
});

// Logs Schema
const logSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    locoID: { type: mongoose.Schema.Types.ObjectId, ref: "LocoType" },
    details: { type: String },
    actionTime: { type: Date, required: true },
    recordTime: { type: Date, default: Date.now },
    ip: { type: String }
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
    Log: mongoose.model("Log", logSchema)
};