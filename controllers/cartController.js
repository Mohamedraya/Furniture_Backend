const Cart = require("../models/Cart");
const Product = require("../models/Products");


module.exports = {

    addToCart: async (req,res) => {

        const userId = req.user.id;
        const {cartItem, quantity} = req.body;

        try {
            const cart = await Cart.findOne({userId: userId});

            if (cart) {
                const existingProduct = cart.products.find((product) => product.cartItem.toString() === cartItem);

                if (existingProduct) {
                    existingProduct.quantity += 1;
                }
                else {
                    cart.products.push({cartItem,quantity});
                }
                await cart.save();
                res.status(200).json("Added to cart");
            }
            else {
                const newCart = new Cart({
                    userId: userId,
                    products: [{
                        cartItem: cartItem,
                        quantity: quantity
                    }]
                });

                await newCart.save();
                res.status(201).json("cart created");
            }
            
        } 
        catch (error) {
            res.status(500).json(error.message);    
        }
    },


    getCart: async (req,res) => {

        const userId = req.user.id;

        try {
            const cart = await Cart.find({userId: userId}).populate("products.cartItem" , "_id title supplier price imageUrl");
            res.status(200).json(cart);
        } 
        catch (error) {
            res.status(500).json(error);    
        }
    },


    deleteCartItem: async (req,res) => {

        const cartItemId = req.params.cartItemId;
        
        try {
            const updatedCart = await Cart.findOneAndUpdate({"products._id": cartItemId},{$pull: {products: {_id: cartItemId}}}
                                                             ,{new: true});

            if (!updatedCart) {
                return res.status(404).json("cart item not found");
            } 
            
            res.status(200).json("item Deleteds");
        } 
        catch (error) {
           res.status(500).json(error); 
        }
    },


    decrementCartItem: async (req,res) => {
        const {userId , cartItem} = req.body;

        try {
            const cart = await Cart.findOne({userId: userId});

            if (!cart) {
                res.status(404).json("Cart Not Found");
            }
            
            const existingProduct = cart.products.find((product) => product.cartItem.toString() === cartItem);

            if (!existingProduct) {

                res.status(404).json("Product Not Found");
            }

            if (existingProduct.quantity === 1) {
                cart.products = cart.products.filter((product) => product.cartItem.toString() !== cartItem);
            }

            else {
                existingProduct.quantity -= 1;
            }

            await cart.save();

            if (existingProduct.quantity === 0) {
                await Cart.updateOne({userId} , {$pull: {products: { cartItem}}});
            }

            res.status(200).json("Product updated");
        } catch (error) {
            res.status(500).json("Product not updated");
        }
    },
}