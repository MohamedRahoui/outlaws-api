import 'module-alias/register';
import 'dotenv/config';
import express from 'express';
import Routes from '@routes/routes';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import RecaptchaMiddleware from './middlewares/recaptcha';
import JWTMiddleware from './middlewares/jwt';

const app = express();
const PORT = process.env.PORT;

// Third party middlewares
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 3 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(express.json());
app.use(cors());
app.use(morgan('common'));
app.use(helmet());
app.use(limiter);

// Global middlewares
app.use(RecaptchaMiddleware);
app.use(JWTMiddleware);

// API routes
Routes(app);

app.listen(PORT, () => {
  console.log(`Outlaws API listening at http://localhost:${PORT}`);
});
