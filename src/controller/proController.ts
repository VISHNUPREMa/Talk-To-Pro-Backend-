import { Request, response, Response } from "express";
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

    async singlePro(req:Request,res:Response){
        try {
            const {userId} = req.body;
           const response = await this.proService.singlePro(userId)
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

    async addRating(req:Request,res:Response){
        try {
            const {stars ,toId,bookingId,bookTime} = req.body;
            
            
            
            const response = await this.proService.addRating(stars,toId,bookingId,bookTime)
            res.json(response)
            
        } catch (error) {
            console.log(error);
            
        }
    }

    async editProDetails(req:Request,res:Response){
        try {
            const {changedDetails,userid} = req.body;
    
            const response = await this.proService.editProDetails(changedDetails,userid)
            res.json(response)
            
        } catch (error) {
           console.log(error);
            
        }                    
    }    

    async editProfilePic(req:Request,res:Response){
        try {
            const data = req.file;
            const { userid, linkedinUrl } = req.body;
          
            const newProfilePic = data?.filename;
            const updateData: any = {};
            if (newProfilePic) {
                updateData.profilePic = newProfilePic;
            }

            if (linkedinUrl) {
                updateData.linkedinUrl = linkedinUrl;
            }
            const response = await this.proService.editProfilePic(updateData ,userid);
            
            

            res.json(response)
            
            
        } catch (error) {
            console.log(error);
                 
        }
    }


    async cancelBooking(req:Request,res:Response){
        try {
            const {slot,selectedDate,proId} = req.body;
           const response = await this.proService.cancelBooking(slot,selectedDate,proId)
           res.json(response)
        } catch (error) {
            console.log(error);
            
        }
    }

}


export const proController = new ProController(new ProService())