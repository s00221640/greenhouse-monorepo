"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_middleware_1 = require("../auth.middleware");
const router = express_1.default.Router();
router.post('/register', userController_1.registerUser); //Route for registering users
router.post('/login', userController_1.loginUser); //Route for logging in users
router.get('/validate', auth_middleware_1.authenticateKey, userController_1.validateToken); //validate token
exports.default = router;
router.get('/test', (req, res) => {
    res.json({ message: 'User routes are working!' });
});
