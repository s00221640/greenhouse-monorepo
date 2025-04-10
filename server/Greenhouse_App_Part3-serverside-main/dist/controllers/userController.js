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
exports.validateToken = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body; // Include username
    try {
        console.log('Incoming registration request:', { username, email, password });
        if (!email || !password) {
            console.error('Missing email or password in request body');
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            console.error(`Email already in use: ${email}`);
            res.status(400).json({ message: 'Email is already in use.' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        console.log('Password hashed successfully');
        const user = new userModel_1.default({ username, email, password: hashedPassword }); // Include username
        console.log('Saving user to database:', user);
        const savedUser = yield user.save();
        console.log('User saved successfully:', savedUser);
        res.status(201).json({ message: 'User registered successfully.', user: savedUser });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user.', error });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // This is the critical change - using _id instead of id
        const token = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email }, SECRET_KEY, {
            expiresIn: '1h',
        });
        console.log('Generated token with user ID:', user._id);
        res.status(200).json({ token });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
});
exports.loginUser = loginUser;
const validateToken = (req, res) => {
    res.status(200).json({ message: 'Token is valid', user: req.user });
};
exports.validateToken = validateToken;
