import Banner from "../models/Banner";

export class BannerController {

    static async addBanner(req, res, next) {
        // const file = req.file;
        // if (file) {
        //     // Normalize path to use forward slashes
        //     file.path = file.path.replace(/\\/g, '/');
        // }
        // res.send(file);
        const path= req.file.path.replace(/\\/g, '/');
        try{
            let data: any ={
                banner: path,
            };
            if(req.body.restaurant_id){
                data={...data, restaurant_id: req.body.restaurant_id};
            }
            const banner= await new Banner(data).save();
            res.send(banner);
        } catch(e){
            next(e);
        }
    }

    static async getBanners(req, res, next){
        try{
            const banners= await Banner.find({status: true});
            res.send(banners);
        }catch(e){
            next(e);
        }
    }
}