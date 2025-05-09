const { WorkTable } = require("../models/DBschema");

// authenticate middleware to check user role
const hasAccess = (user, doc) => {
  const uid = user._id.toString();
  const supervisors = doc.meta.assignedSupervisor?.map(id => id.toString()) || [];
  const engineers = doc.meta.assignedEngineer?.map(id => id.toString()) || [];

  if (user.role === "admin") return true;
  if (user.role === "supervisor" && supervisors.includes(uid)) return true;
  if (user.role === "engineer" && engineers.includes(uid)) return true;
  return false;
};

// createWorkTable
const createWorkTable = async (req, res) => {
  try {
    const user = req.user;

    // supervisor/engineer 
    if (
      user.role !== "admin" &&
      (req.body.meta?.assignedSupervisor || req.body.meta?.assignedEngineer)
    ) {
      return res.status(403).json({ error: "Only admin or supervisor can assign users" });
    }

    const newTable = new WorkTable({
      ...req.body,
      meta: {
        ...req.body.meta,
        createBy: user._id,
        createdAt: new Date(),
        updateHistory: [{
          userId: user._id,
          updatedAt: new Date()
        }],
        isActive: true
      }
    });

    await newTable.save();
    res.status(201).json(newTable);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//worktable detail
const getWorkTables = async (req, res) => {
  try {
    const user = req.user;
    const all = await WorkTable.find();

    const filtered = all.filter(doc => hasAccess(user, doc) && doc.meta.isActive !== false);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// list all worktables (with meta info, not full content)
const listWorkTables = async (req, res) => {
  try {
    const user = req.user;

    const all = await WorkTable.find({}, {
      "meta.projectId": 1,
      "meta.assignedSupervisor": 1,
      "meta.assignedEngineer": 1,
      "meta.Version": 1,
      "meta.isActive": 1,
      "Content.documentTitle": 1,
      "Content.documentNumber": 1
    });

    const filtered = all.filter(doc => hasAccess(user, doc) && doc.meta.isActive !== false);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update worktable including delete (logic delete)
// updateWorkTable
const updateWorkTable = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;

    const table = await WorkTable.findById(id);
    if (!table) return res.status(404).json({ error: "WorkTable not found" });

    if (!hasAccess(user, table)) {
      return res.status(403).json({ error: "You do not have permission to update this item." });
    }

    // merge the new data with the existing data
   
    for (const key in req.body) {
      if (key === "meta") {
        for (const subkey in req.body.meta) {
          table.meta[subkey] = req.body.meta[subkey];
        }
      } else {
        table[key] = req.body[key];
      }
    }

    // record the update history
    table.meta.updateHistory.push({
      userId: user._id,
      updatedAt: new Date()
    });

    await table.save();
    res.json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createWorkTable,
  getWorkTables,
  listWorkTables,
  updateWorkTable
};
