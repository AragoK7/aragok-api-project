const express = require("express");
const fetch = require("node-fetch");
const PORT = process.env.PORT || 3000;
const app = express();

// api for meals 
// "https://www.themealdb.com/api/json/v1/1/random.php"

const data=[];

app.use(express.static("public"));
app.use(express.json());

app.get("/api/:page",(request,response)=>{
    const page = Number(request.params.page) - 1;
    const list = data.slice(10*page,10*page+10);
    response.json({list,size:parseInt(data.length/10)+1});
})

app.post("/name",(request,response)=>{
    const {name}=request.body;
    if(!name) return ;
    const food = fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res=>res.json())
    .then(meal=>{
        const food = meal.meals[0].strMeal;
        data.push({name,food});
        return response.json({name,food});
    })
    .catch(err=>console.log(err));
})

app.listen(PORT,()=>console.log(`...Server running on port ${PORT}`));