import { Request, Response } from "express";
import validationService from "../services/validationService";

export async function validation(req: Request, res: Response){
  const buffer: Buffer | undefined = req.file?.buffer;

  if(!buffer){
    throw {type: "Bad Request", message: "Not File!"}
  }

  const products = await validationService.validation(buffer);

  return res.json(products);
}