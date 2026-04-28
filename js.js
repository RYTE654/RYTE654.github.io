let cid = "3361176";
let rkey = "C9JIZOBNMW8UQBIK";
let url = `https://api.thingspeak.com/channels/${cid}/feeds.json?api_key=${rkey}&results=40`;

let ctx = document.getElementById("c").getContext("2d");
let chart = new Chart(ctx,{
    type:"line",
    data:{
        labels:[],
        datasets:[
            {label:"心率",data:[],borderColor:"red"},
            {label:"血氧",data:[],borderColor:"#00bfff"},
            {label:"温度",data:[],borderColor:"orange"},
            {label:"湿度",data:[],borderColor:"green"}
        ]
    }
});

async function get(){
    let res = await fetch(url);
    let d = await res.json();
    let list = d.feeds;
    let last = list.at(-1);
    document.getElementById("h").innerText = last.field1??"--";
    document.getElementById("s").innerText = last.field2??"--";
    document.getElementById("t").innerText = last.field3??"--";
    document.getElementById("u").innerText = last.field4??"--";

    chart.data.labels = list.map((_,i)=>i);
    chart.data.datasets[0].data = list.map(x=>x.field1);
    chart.data.datasets[1].data = list.map(x=>x.field2);
    chart.data.datasets[2].data = list.map(x=>x.field3);
    chart.data.datasets[3].data = list.map(x=>x.field4);
    chart.update();
}
setInterval(get,2000);
get();
