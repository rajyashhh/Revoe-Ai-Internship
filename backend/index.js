require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT;
app.use(express.json());


async function main(){
    app.listen(port, console.log(`Server is hosted on the port no. ${port}`))
}
main()