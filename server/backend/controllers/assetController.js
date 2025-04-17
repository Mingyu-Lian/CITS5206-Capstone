const { Asset } = require("../models/DBschema");

// List all assets (summary)
const getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get asset details
const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Not found" });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create new asset
const createAsset = async (req, res) => {
  try {
    const asset = await Asset.create(req.body);
    res.status(201).json({
      message: "Asset created successfully",
      ...asset.toObject(),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update asset
const updateAsset = async (req, res) => {
  try {
    await Asset.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Asset updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete asset
const deleteAsset = async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: "Asset deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};
