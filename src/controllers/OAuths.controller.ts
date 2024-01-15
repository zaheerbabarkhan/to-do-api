import { NextFunction, Request, Response } from "express";

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.user);
        res.status(200).send({
            message: req.user
        });
    } catch (error) {
        console.log("error");
        console.log(error);
        next(error);
    }
    
};

