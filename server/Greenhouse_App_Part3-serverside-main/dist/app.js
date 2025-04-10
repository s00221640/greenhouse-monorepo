"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const plantRoutes_1 = __importDefault(require("./routes/plantRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});
app.use((req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
        return next();
    }
    express_1.default.json()(req, res, (err) => {
        if (err)
            return next(err);
        express_1.default.urlencoded({ extended: true })(req, res, next);
    });
});
app.use('/users', userRoutes_1.default);
app.use('/plants', plantRoutes_1.default);
app.use('/admin', adminRoutes_1.default);
app.get('/test-cors', (req, res) => {
    res.json({ message: 'CORS is working!' });
});
app.get('/', (req, res) => {
    res.send('Welcome to the Greenhouse App!');
});
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
