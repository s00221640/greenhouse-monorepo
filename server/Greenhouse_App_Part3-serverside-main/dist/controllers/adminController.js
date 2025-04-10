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
exports.getAdminStats = exports.deleteAnyPlant = exports.deleteAnyUser = exports.getAllUsersAndPlants = exports.verifyAdminCode = void 0;
const plantModel_1 = __importDefault(require("../models/plantModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const verifyAdminCode = (req, res) => {
    const adminCode = req.body.code;
    if (adminCode === process.env.ADMIN_CODE) {
        return res.status(200).json({ success: true });
    }
    else {
        return res.status(401).json({ success: false, message: 'Invalid admin code' });
    }
};
exports.verifyAdminCode = verifyAdminCode;
const getAllUsersAndPlants = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find({}, '-password');
        const plants = yield plantModel_1.default.find();
        res.status(200).json({ users, plants });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users and plants', error });
    }
});
exports.getAllUsersAndPlants = getAllUsersAndPlants;
const deleteAnyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        yield userModel_1.default.findByIdAndDelete(userId);
        yield plantModel_1.default.deleteMany({ userId });
        res.status(200).json({ message: `Deleted user and their plants.` });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});
exports.deleteAnyUser = deleteAnyUser;
const deleteAnyPlant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { plantId } = req.params;
    try {
        yield plantModel_1.default.findByIdAndDelete(plantId);
        res.status(200).json({ message: `Deleted plant.` });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting plant', error });
    }
});
exports.deleteAnyPlant = deleteAnyPlant;
const getAdminStats = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCount = yield userModel_1.default.countDocuments();
        const plantCount = yield plantModel_1.default.countDocuments();
        res.status(200).json({ userCount, plantCount });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
});
exports.getAdminStats = getAdminStats;
