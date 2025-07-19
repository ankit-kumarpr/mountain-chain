const Hotel = require('../models/Hotel');

// register new hotel

const CreateNewHotel=async(req,res)=>{
    try{

        const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json({ 
        success:true,
        message: 'Hotel HAVE created',
         hotel 
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
            
        })
    }
}


// get all hotel list

const GelallHotelList=async(req,res)=>{
    try{

        const hotels = await Hotel.find().populate('tripDestinations');

        if(!hotels || hotels.length==0){
            return res.status(404).json({
                success:false,
                message:"No hotels found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Hotel List",
            hotels
        })
        
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}



// updated hostel

const UpdateAnyHotel=async(req,res)=>{
    try{
        const updated = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json({
        success:true,
         message: 'Hotel updated',
          hotel: updated 
        });

    }
    catch(error){
        return res.status(500).json({
            success:true,
            message:"Internal server error"
        })
    }
}


// delete any hotel

const DeleteAnyhotel=async(req,res)=>{
    try{
       const delhotel= await Hotel.findByIdAndDelete(req.params.id);
   return res.status(200).json({ 
        success:true,
    message: 'Hotel deleted'

});
    }
    catch(error){
        return res.status(500).json({
            success:true,
            message:"Internal server error"
        })
    }
}


// get single hotel

const GelSingleHotel=async(req,res)=>{
    try{
const hotel = await Hotel.findById(req.params.id).populate('tripDestinations');
   return res.status(200).json({
    success:true,
    message:"Hotel data",
    data:hotel
   });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}



module.exports={
    GelSingleHotel,
    DeleteAnyhotel,
    UpdateAnyHotel,
    GelallHotelList,
    CreateNewHotel
}



// hotelController.js