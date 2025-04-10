"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const plantRoutes_1 = __importDefault(require("./routes/plantRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const fs_1 = __importDefault(require("fs"));
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
    if (contentType.includes('multipart/form-data'))
        return next();
    express_1.default.json()(req, res, (err) => {
        if (err)
            return next(err);
        express_1.default.urlencoded({ extended: true })(req, res, next);
    });
});
// API routes
app.use('/users', userRoutes_1.default);
app.use('/plants', plantRoutes_1.default);
app.use('/admin', adminRoutes_1.default);
// Healthcheck
app.get('/health', (req, res) => {
    res.send('Server is up and running');
});
// Simple debug endpoint
app.get('/api', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Greenhouse API is running',
        endpoints: ['/users', '/plants', '/admin'],
        server_time: new Date().toISOString()
    });
});
// Angular path setup
const clientPath = path_1.default.join(__dirname, 'dist/client/browser');
console.log('Looking for Angular frontend at:', clientPath);
// Static files from Angular build
app.use(express_1.default.static(clientPath));
// Angular fallback route
app.get('*', (req, res) => {
    const indexPath = path_1.default.join(clientPath, 'index.html');
    if (fs_1.default.existsSync(indexPath)) {
        res.sendFile(indexPath);
    }
    else {
        res.status(500).send('Angular build missing');
    }
});
// Debug path viewer
app.get('/debug-paths', (req, res) => {
    const indexPath = path_1.default.join(clientPath, 'index.html');
    const clientExists = fs_1.default.existsSync(clientPath);
    const indexExists = fs_1.default.existsSync(indexPath);
    res.json({
        currentDir: __dirname,
        clientPath,
        indexPath,
        clientExists,
        indexExists,
        files: clientExists ? fs_1.default.readdirSync(clientPath) : []
    });
});
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
