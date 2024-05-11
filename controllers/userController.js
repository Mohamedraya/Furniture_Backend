const User = require("../models/User");



module.exports = {

    deleteUser: async (req,res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Successfully Deleted");
        } 
        catch (error) {
            res.status(500).json(error);    
        }
    },

    getUser: async (req,res) => {
        try {
            const user = await User.findById(req.params.id);

            if(!user) {
                res.status(404).json("User not Found");
            }
 
            const {password , __v , createdAt , updatedAt , ...userdata } = user._doc;
            res.status(200).json(userdata);
        } 
        catch (error) {
            res.status(500).json(error);    
        }
    }
}