import { Request, Response } from "express";
import { ProService } from "../services/proService";


class ProController{
    private proService : ProService
    constructor (proService:ProService){
        this.proService = proService
    }

    async proRegister(req:Request|any,res:Response){        

    try {
        const data = { ...req.body, profilePic: req.file ? req.file.filename : null };
     
        const pro = await this.proService.register(data);
       
        if (!pro) {
            return res.status(400).json({ error: 'Failed to create professional.' });
          }
    
          if (pro.message !== undefined) {
            return res.status(400).json({ error: pro.data });
          }
    
          res.status(201).json(pro);

    } catch (error) {
        console.log("error in proRegister : ",error);
        
        
    }    
    }


    async saveAvailableSlots(req:Request,res:Response){
        try {
            const data = req.body;
              
            const response = await this.proService.saveAvailableSlots(data)
             res.json(response)
        } catch (error) {
            console.log("error in proconsole : ",error);
        }
    }

    async getAllocatedSlot(req:Request,res:Response){
        try {
            const {proId} = req.body;
            const response = await this.proService.getAllocatedSlot(proId)
            res.json(response)
        } catch (error) {
            console.log(error);
            
        }
    }

    async isUserCalled(req:Request,res:Response){
        try {
            const {proId,userId} = req.body;
           const response = await this.proService.isUserCalled(proId,userId)
            res.json(response)
        } catch (error) {
           console.log(error);
            
        }
    }


    async followPro(req:Request,res:Response){
        try {
            const {proId,userId} = req.body;
            const response = await this.proService.followPro(proId,userId)
            res.json(response)
        } catch (error) {
            
        }
    }

    async unFollowPro(req:Request,res:Response){
        try {
            const {proId,userId} = req.body;
            const response = await this.proService.unFollowPro(proId,userId)
            res.json(response)
        } catch (error) {
            
        }
    }

}


export const proController = new ProController(new ProService())