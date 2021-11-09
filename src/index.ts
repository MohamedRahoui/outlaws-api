import 'module-alias/register';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import RecaptchaMiddleware from './middlewares/recaptcha';
import JWTMiddleware from './middlewares/jwt';
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import Routes from './routes/routes';
const app = express();
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new RewriteFrames({
      // FIXME:: Remove this from here
      root: '/app',
    }),
  ],
  environment: process.env.SENTRY_ENVIRONMENT,
});

// Rate Limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 5 minutes
  max: 50, // limit each IP to 100 requests per windowMs
});

app.use(express.json());
app.use(cors());
app.use(morgan('common'));
app.use(helmet());
app.use(limiter);

// Homemade middlewares
app.use(RecaptchaMiddleware);
app.use(JWTMiddleware);

// API routes
Routes(app);


app.use(Sentry.Handlers.errorHandler());

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Outlaws API listening at http://localhost:${PORT}`);
});
