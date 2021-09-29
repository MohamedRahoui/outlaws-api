"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth_1 = require("passport-google-oauth");
passport_1.default.use(new passport_google_oauth_1.OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_SERVER_URL}/auth/google/callback`,
}, () => {
    console.log('Google Auth Screen');
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map