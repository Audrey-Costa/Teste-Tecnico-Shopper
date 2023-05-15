import { NextFunction, Request, Response } from "express";
import Error from "../types/ErrorType";

export default async function errorHandlerMiddleware(error: Error, req: Request, res: Response, next: NextFunction){
    if (error.type === "Not Found"){
        return res.status(404).json(error.message)
    }
    if (error.type === "Unauthorized"){
        return res.status(401).json(error.message)
    }
    if(error.type === "Conflict"){
        return res.status(409).json(error.message);
    }
    if(error.type === "Bad Request"){
        return res.status(400).json(error.message);
    }
    if(error.type === "Forbidden"){
        return res.status(403).json(error.message);
    }
    if(error.type === "Method not allowed"){
        return res.status(403).json(error.message);
    }
    return res.status(500).json(error.message);
}