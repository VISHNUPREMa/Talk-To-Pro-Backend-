import { Request, Response } from "express";
import { AdminService } from "../services/adminService";

 class AdminController{

    private adminService:AdminService

    constructor(adminService:AdminService){
        this.adminService = adminService
    }

    async adminLogin(req: Request, res: Response): Promise<void> {
        const data = req.body
        const response = await this.adminService.validateLogin(data)
        
        
        res.json(response);
    
    }


    async getAllUsers(req: Request, res: Response):Promise<any>{
        const response = await this.adminService.getAllUsers();
        res.status(200).json(response)
        
    }

    async blockUser (req: Request, res: Response):Promise<any>{
        const {email} = req.body;
   const response = await this.adminService.blockUser(email);
   res.json(response)
   
  
     
    }

    async unblockUser (req: Request, res: Response):Promise<any>{
        const {email} = req.body;
   const response = await this.adminService.unblockUser(email);
   res.json(response)

    }


    async getAllpro(req: Request, res: Response):Promise<any>{
        const response = await this.adminService.getAllpro();
        res.status(200).json(response)
        
    }



    async blockpro (req: Request, res: Response):Promise<any>{
        const {id} = req.body;
   const response = await this.adminService.blockpro(id);
   res.json(response)
    
    }


    async unblockpro (req: Request, res: Response):Promise<any>{
        const {id} = req.body;
   const response = await this.adminService.unblockpro(id);
   res.json(response)
    
    }

}

export const adminController = new AdminController(new AdminService)
