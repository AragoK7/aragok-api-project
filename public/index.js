const $content = document.getElementById("content");
const $btnsPrev = document.getElementById("prev-pages");
const $btnsNext = document.getElementById("next-pages");

let page = 1;
let cap = 1;

function makeHTML(data){
            let html = "";
            data.forEach(element => {
                html+=`<div>${element.name} loves ${element.food}</div>` 
            });
            return html;
        }
        document.getElementById("error").innerHTML = "...loading...";
        function fetchData(page){
            fetch(`/api/${page}`,{
            method:"GET",
            headers:{
                "Accept":"application/json"
            }
        }).then(response=>response.json()).then(data=>{
            document.getElementById("current-page").innerHTML = `Current Page: ${page}`;
            $btnsPrev.innerHTML="";
            $btnsNext.innerHTML="";
            cap = data.size;
            console.log(typeof page,typeof cap);
            
            for(let i=-1,count=0;page + i > 1 - 1;i--,count++){
                if(count === 3) break;
                $btnsPrev.insertAdjacentHTML("afterbegin",
                `<button onclick="handleClick(${i})" >${page+i}</button>`)
            }
            for(let i=1,count=0;page +i < cap + 1;i++,count++){
                if(count === 3) break;
                $btnsNext.insertAdjacentHTML("beforeend",
                `<button onclick="handleClick(${i})" >${page+i}</button>`)
            }
            document.getElementById("error").innerHTML = "";
            $content.innerHTML=makeHTML(data.list);

        }).catch(err=>document.getElementById("error").innerHTML = err);
        }
        fetchData(page);
        function handleClick(arg){
            switch(arg){
                case 1:
                    if(page != cap) page += arg;
                    break;
                case -1:
                    if(page != 1) page += arg;
                    break;
                case -3:
                case -2:
                case 2:
                case 3:
                    page += arg;
                    break;
                case 'last':
                    page = cap;
                    break;
                case 'first':
                    page = 1;
                
            }
        fetchData(page);
        }

        function handleSubmit(e){
            e.preventDefault();
            const name = document.getElementById("name").value;
            if(!name) return;
            document.getElementById("error").innerHTML = "...loading...";
            fetch("/name",{
                method:"POST",
                headers:{
                    'Content-Type':"application/json"
                },
                body:JSON.stringify({name})
            }).then((response)=>response.json()).then(result=>{
                document.getElementById("error").innerHTML = "";
                fetchData(page = cap);
            }).catch(err=>{
            document.getElementById("error").innerHTML = err;
            });
            document.getElementById("name").value = "";
        }
