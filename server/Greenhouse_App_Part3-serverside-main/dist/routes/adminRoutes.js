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
const express_1 = __importDefault(require("express"));
const userModel_1 = __importDefault(require("../models/userModel"));
const plantModel_1 = __importDefault(require("../models/plantModel"));
const auth_middleware_1 = require("../auth.middleware");
const router = express_1.default.Router();
const ADMIN_CODE = process.env.ADMIN_CODE || 'letmein2025';
router.use(auth_middleware_1.authenticateKey);
router.use((req, res, next) => {
    const code = req.headers['x-admin-code'];
    if (code === ADMIN_CODE) {
        next();
    }
    else {
        res.status(403).json({ message: 'Forbidden. Invalid admin code.' });
    }
});
router.get('/stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield userModel_1.default.countDocuments();
        const totalPlants = yield plantModel_1.default.countDocuments();
        res.status(200).json({ totalUsers, totalPlants });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
}));
router.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find({}, '-password');
        const plants = yield plantModel_1.default.find();
        res.status(200).json({ users, plants });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users and plants', error });
    }
}));
router.delete('/delete-user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        yield userModel_1.default.findByIdAndDelete(userId);
        yield plantModel_1.default.deleteMany({ userId });
        res.status(200).json({ message: 'Deleted user and their plants.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
}));
router.delete('/delete-user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req.params;
    try {
        yield userModel_1.default.findByIdAndDelete(userId);
        yield plantModel_1.default.deleteMany({ userEmail: (_a = (yield userModel_1.default.findById(userId))) === null || _a === void 0 ? void 0 : _a.email });
        res.status(200).json({ message: 'User and their plants deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
}));
router.delete('/delete-plant/:plantId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { plantId } = req.params;
    try {
        yield plantModel_1.default.findByIdAndDelete(plantId);
        res.status(200).json({ message: 'Plant deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting plant', error });
    }
}));
exports.default = router;
