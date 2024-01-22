import passport from "../config/passport.config";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
export default (req: Request, res: Response, next: NextFunction) => {
    // Override the failureRedirect behavior to send a custom response on failure
    passport.authenticate("google", { session: false }, (err, user) => {
        if (err) {
            console.error("Google authentication failed:", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Unauthorized" });
        }
        if (!user) {
            console.error("Google authentication failed: No user");
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Unauthorized" });
        }
        req.logIn(user,{session: false}, (loginErr) => {
            if (loginErr) {
                console.error("Google authentication failed during login:", loginErr);
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Unauthorized" });
            }
            next();
        });
    })(req, res, next);
};