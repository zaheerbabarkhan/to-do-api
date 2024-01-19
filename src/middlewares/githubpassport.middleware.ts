import passport from "../config/passport.config";
import { Request, Response, NextFunction } from "express";
export default (req: Request, res: Response, next: NextFunction) => {
    // Override the failureRedirect behavior to send a custom response on failure
    passport.authenticate("github", { session: false }, (err: Error, user: Express.User) => {
        if (err) {
            console.error("GitHub authentication failed:", err);
            return res.status(500).json({ message: "Unauthorized" });
        }
        if (!user) {
            console.error("GitHub authentication failed: No user");
            return res.status(500).json({ message: "Unauthorized" });
        }
        req.logIn(user,{session: false}, (loginErr) => {
            if (loginErr) {
                console.error("GitHub authentication failed during login:", loginErr);
                return res.status(500).json({ message: "Unauthorized" });
            }
            next();
        });
    })(req, res, next);
};