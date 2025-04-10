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
const plantController_1 = require("../controllers/plantController");
const auth_middleware_1 = require("../auth.middleware");
const plantModel_1 = __importDefault(require("../models/plantModel"));
const multerMiddleware_1 = require("../middleware/multerMiddleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticateKey);
// Admin code verification route
router.post('/admin-code-check', (req, res) => {
    const providedCode = req.body.code;
    const adminCode = process.env.ADMIN_CODE;
    if (providedCode === adminCode) {
        res.status(200).json({ success: true });
    }
    else {
        res.status(403).json({ success: false, message: 'Invalid admin code' });
    }
});
// Debug/special routes
router.delete('/reset', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield plantModel_1.default.deleteMany({});
        console.log(`Deleted all ${result.deletedCount} plants`);
        res.status(200).json({ message: `Deleted all ${result.deletedCount} plants` });
    }
    catch (error) {
        console.error('Error resetting plants:', error);
        res.status(500).json({ message: 'Error resetting plants', error });
    }
}));
router.delete('/all/debug', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, plantController_1.deleteAllPlants)(req, res);
    }
    catch (error) {
        console.error('Error in DELETE /all/debug:', error);
        res.status(500).json({ message: 'Error deleting all plants', error });
    }
}));
router.post('/fix-plants', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        console.log('Fixing plants for user ID:', userId);
        const plantsWithoutUserId = yield plantModel_1.default.find({ userId: { $exists: false } });
        console.log(`Found ${plantsWithoutUserId.length} plants without userId`);
        const updatePromises = plantsWithoutUserId.map(plant => plantModel_1.default.findByIdAndUpdate(plant._id, { userId: userId }, { new: true }));
        const updatedPlants = yield Promise.all(updatePromises);
        console.log(`Updated ${updatedPlants.length} plants with userId: ${userId}`);
        res.status(200).json({
            message: `Fixed ${updatedPlants.length} plants`,
            plants: updatedPlants
        });
    }
    catch (error) {
        console.error('Error fixing plants:', error);
        res.status(500).json({ message: 'Error fixing plants', error });
    }
}));
// CRUD routes
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, plantController_1.getAllPlants)(req, res);
    }
    catch (error) {
        console.error('Error in GET /:', error);
        res.status(500).json({ message: 'Error fetching all plants', error });
    }
}));
router.post('/', (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
        (0, multerMiddleware_1.upload)(req, res, (err) => {
            if (err) {
                console.error('Multer error:', err);
                return res.status(400).json({ message: 'File upload error', error: err });
            }
            next();
        });
    }
    else {
        next();
    }
}, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, plantController_1.createPlant)(req, res);
    }
    catch (error) {
        console.error('Error in POST /:', error);
        res.status(500).json({ message: 'Error creating plant', error });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, plantController_1.getPlantById)(req, res);
    }
    catch (error) {
        console.error('Error in GET /:id:', error);
        res.status(500).json({ message: 'Error fetching plant by ID', error });
    }
}));
router.put('/:id', (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
        (0, multerMiddleware_1.upload)(req, res, (err) => {
            if (err) {
                console.error('Multer error during update:', err);
                return res.status(400).json({ message: 'File upload error', error: err });
            }
            next();
        });
    }
    else {
        next();
    }
}, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, plantController_1.updatePlant)(req, res);
    }
    catch (error) {
        console.error('Error in PUT /:id:', error);
        res.status(500).json({ message: 'Error updating plant', error });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, plantController_1.deletePlant)(req, res);
    }
    catch (error) {
        console.error('Error in DELETE /:id:', error);
        res.status(500).json({ message: 'Error deleting plant', error });
    }
}));
exports.default = router;
