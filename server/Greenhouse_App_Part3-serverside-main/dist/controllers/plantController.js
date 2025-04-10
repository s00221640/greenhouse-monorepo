"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllPlants = exports.deletePlant = exports.updatePlant = exports.createPlant = exports.getPlantById = exports.getAllPlants = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const plantModel_1 = __importDefault(require("../models/plantModel"));
const getAllPlants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const email = user === null || user === void 0 ? void 0 : user.email;
        if (!email)
            return res.status(401).json({ message: 'User email not found' });
        const userPlants = yield plantModel_1.default.find({ userEmail: email });
        res.status(200).json(userPlants);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching plants' });
    }
});
exports.getAllPlants = getAllPlants;
const getPlantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userEmail = req.user.email;
    try {
        if (!mongoose_1.default.isValidObjectId(id))
            return res.status(400).json({ message: 'Invalid Plant ID format.' });
        const plant = yield plantModel_1.default.findOne({ _id: id, userEmail });
        if (!plant)
            return res.status(404).json({ message: 'Plant not found.' });
        res.status(200).json(plant);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching plant.' });
    }
});
exports.getPlantById = getPlantById;
const createPlant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const email = user === null || user === void 0 ? void 0 : user.email;
        if (!email)
            return res.status(401).json({ message: 'User email not found' });
        // Extract data from req.body + req.file
        const plantData = {
            name: String(req.body.name || ''),
            species: String(req.body.species || ''),
            plantingDate: req.body.plantingDate ? new Date(req.body.plantingDate) : null,
            wateringFrequency: Number(req.body.wateringFrequency || 0),
            lightRequirement: String(req.body.lightRequirement || ''),
            userEmail: email,
            imageUrl: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || null,
        };
        const plant = new plantModel_1.default(plantData);
        const savedPlant = yield plant.save();
        res.status(201).json(savedPlant);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating plant', error });
    }
});
exports.createPlant = createPlant;
const updatePlant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userEmail = req.user.email;
    try {
        if (!mongoose_1.default.isValidObjectId(id))
            return res.status(400).json({ message: 'Invalid Plant ID format.' });
        // Check if the plant exists and belongs to the user
        const existingPlant = yield plantModel_1.default.findOne({ _id: id, userEmail });
        if (!existingPlant)
            return res.status(404).json({ message: 'Plant not found.' });
        // Build update data, checking for file upload
        const updateData = {
            name: req.body.name,
            species: req.body.species,
            plantingDate: req.body.plantingDate ? new Date(req.body.plantingDate) : undefined,
            wateringFrequency: Number(req.body.wateringFrequency),
            lightRequirement: req.body.lightRequirement,
            harvestDate: req.body.harvestDate ? new Date(req.body.harvestDate) : undefined,
        };
        // If there's a new image file, add it to updateData
        if (req.file && req.file.path) {
            updateData.imageUrl = req.file.path;
        }
        const updatedPlant = yield plantModel_1.default.findOneAndUpdate({ _id: id, userEmail }, updateData, { new: true, runValidators: true });
        if (!updatedPlant)
            return res.status(404).json({ message: 'Plant not found after update attempt.' });
        res.status(200).json(updatedPlant);
    }
    catch (error) {
        console.error('Error updating plant:', error);
        res.status(500).json({ message: 'Error updating plant.' });
    }
});
exports.updatePlant = updatePlant;
const deletePlant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userEmail = req.user.email;
    try {
        if (!mongoose_1.default.isValidObjectId(id))
            return res.status(400).json({ message: 'Invalid Plant ID format.' });
        const deletedPlant = yield plantModel_1.default.findOneAndDelete({ _id: id, userEmail });
        if (!deletedPlant)
            return res.status(404).json({ message: 'Plant not found.' });
        res.status(200).json({ message: 'Plant deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting plant.' });
    }
});
exports.deletePlant = deletePlant;
const deleteAllPlants = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield plantModel_1.default.deleteMany({});
        res.status(200).json({ message: `Deleted ${result.deletedCount} plants` });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting all plants', error });
    }
});
exports.deleteAllPlants = deleteAllPlants;
