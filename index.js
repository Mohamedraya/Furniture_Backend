const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const productRouter = require("./routes/products");
const authRouter    = require("./routes/auth"); 
const userRouter = require("./routes/user");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const port = 3000

const app = express()
dotenv.config()
mongoose.connect(process.env.MONGO_URL).then(() => console.log("db connected")).catch((err) => console.log(err))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/products",productRouter);
app.use("/api/auth" , authRouter);
app.use("/api/users" , userRouter);
app.use("/api/carts" , cartRouter);
app.use("/api/orders" , orderRouter);

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${process.env.PORT}!`));


/*
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({limit: "10mb",extended: true}));
*/