import 'module-alias/register';
import 'dotenv/config';
import express, { ErrorRequestHandler, Request, Response } from 'express';
import Routes from '@routes/routes';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import RecaptchaMiddleware from './middlewares/recaptcha';
import JWTMiddleware from './middlewares/jwt';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { RewriteFrames } from '@sentry/integrations';
const app = express();
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new RewriteFrames({
      // FIXME:: Remove this from here
      root: '/app',
    }),
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0,
  environment: process.env.SENTRY_ENVIRONMENT,
});

// Rate Limit
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(express.json());
app.use(cors());
app.use(morgan('common'));
app.use(helmet());
app.use(limiter);

// Homemade middlewares
app.use(RecaptchaMiddleware);
app.use(JWTMiddleware);

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(
  Sentry.Handlers.requestHandler({
    ip: true,
  })
);
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// API routes
Routes(app);

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      if (
        error.status === 403 ||
        error.status === 400 ||
        error.status === 404 ||
        (error.status && error.status >= 500)
      ) {
        return true;
      }
      return false;
    },
  })
);

const errorHandler: ErrorRequestHandler = (error, _, res) => {
  res.status(400).send({
    error: {
      status: 400 || error.status, // 400 :p
      message: 'Internal Server Error',
    },
  });
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Outlaws API listening at http://localhost:${PORT}`);
});
