require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT;
const {userRouter} = require("./routes/user")
app.use(express.json());


app.use('/user', userRouter);

async function main(){
    app.listen(port, console.log(`Server is hosted on the port no. ${port}`))
}
main()