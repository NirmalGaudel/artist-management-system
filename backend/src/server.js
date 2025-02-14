const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const artistRoutes = require('./routes/artistRoutes');
const musicRoutes = require('./routes/musicRoutes');

const { requestLogger } = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(requestLogger);
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/music', musicRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
