"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateKey = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';
const authenticateKey = (req, res, next) => {
    var _a;
    console.log('\n--- Auth Middleware ---');
    console.log('Headers:', JSON.stringify(req.headers));
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        console.log('No token provided in request');
        res.status(401).json({ message: 'No token provided. Unauthorized access.' });
        return;
    }
    try {
        console.log('Token received:', token);
        const decoded = jsonwebtoken_1.default.decode(token);
        console.log('Token decoded (without verification):', decoded);
        const verified = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        console.log('Token verified:', verified);
        if (!verified._id) {
            console.log('ERROR: No id property in verified token!');
            console.log('Token contains:', Object.keys(verified).join(', '));
        }
        req.user = verified;
        console.log('User object attached to request:', req.user);
        console.log('--- End Auth Middleware ---\n');
        next();
    }
    catch (error) {
        console.error('Invalid token:', error);
        res.status(403).json({ message: 'Invalid token. Unauthorized access.' });
    }
};
exports.authenticateKey = authenticateKey;
