import passport from "../config/passport.config";
import { Request, Response, NextFunction } from "express";
export default (req: Request, res: Response, next: NextFunction) => {
    // Override the failureRedirect behavior to send a custom response on failure
    passport.authenticate("google", { session: false }, (err, user) => {
        if (err) {
            console.error("Google authentication failed:", err);
            return res.status(500).json({ message: "Unauthorized" });
        }
        if (!user) {
            console.error("Google authentication failed: No user");
            return res.status(500).json({ message: "Unauthorized" });
        }
        req.logIn(user,{session: false}, (loginErr) => {
            if (loginErr) {
                console.error("Google authentication failed during login:", loginErr);
                return res.status(500).json({ message: "Unauthorized" });
            }
            console.log("its here before next");
            console.log(req.user);
            next();
        });
    })(req, res, next);
};