const current_text = document.querySelector(".current-text");
const positive_text = document.querySelector(".positive-text");
const recovered_text = document.querySelector(".recovered-text");
const deaths_text = document.querySelector(".deaths-text");
const tested_text = document.querySelector(".test-text");
const current_diff = document.querySelector(".current-diff");
const positive_diff = document.querySelector(".positive-diff");
const recovered_diff = document.querySelector(".recovered-diff");
const deaths_diff = document.querySelector(".deaths-diff");
const test_diff = document.querySelector(".test-diff");
const updated_time = document.querySelector(".updated_date");
const current_rate = document.querySelector(".current_rate");
const recovered_rate = document.querySelector(".recovered_rate");
const positive_rate = document.querySelector(".positive_rate");
const deaths_rate = document.querySelector(".deaths_rate");
const tested_rate = document.querySelector(".tested_rate");
const population = 1370000000;
let c=0;
let a=[];
fetch("https://api.covid19india.org/data.json")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);
    current_text.innerText = formatNumber(data.statewise[0].confirmed);
    recovered_text.innerText = formatNumber(data.statewise[0].recovered);
    positive_text.innerText = formatNumber(data.statewise[0].active);
    deaths_text.innerText = formatNumber(data.statewise[0].deaths);
    let daily_confirmed = formatNumber(data.statewise[0].deltaconfirmed);
    current_diff.innerText = `+${(current_diff.innerHTML = daily_confirmed)}`;
    let daily_recovered = formatNumber(data.statewise[0].deltarecovered);
    recovered_diff.innerText = `+${(recovered_diff.innerHTML = daily_recovered)}`;
    let daily_deaths = formatNumber(data.statewise[0].deltadeaths);
    deaths_diff.innerText = `+${deaths_diff.innerHTML = formatNumber(daily_deaths)}`;
    let daily_positive =
      data.statewise[0].deltaconfirmed - data.statewise[0].deltarecovered-data.statewise[0].deltadeaths;
    if (daily_positive >= 0) {
      positive_diff.innerText = `+${(positive_diff.innerHTML = formatNumber(daily_positive))}`;
    } else if (daily_positive < 0) {
      positive_diff.innerText = `${(positive_diff.innerHTML = formatNumber(daily_positive))}`;
    }
    let tested_length = data.tested.length;
    let daily_test = data.tested[tested_length - 1].totalsamplestested;
    tested_text.innerHTML = formatNumber(daily_test);
    let tested_diff = data.tested[tested_length - 1].samplereportedtoday;
    test_diff.innerHTML = `+${formatNumber(tested_diff)}`;
    let rate1 = ((data.statewise[0].confirmed / population) * 1000000).toFixed(2);
    current_rate.innerHTML = `Cases per Million : ${formatNumber(rate1)}`;
    let rate2 = ((data.statewise[0].active / data.statewise[0].confirmed) * 100).toFixed(2);
    positive_rate.innerHTML = `Active Rate : ${formatNumber(rate2)}%`;
    let rate3 = ((data.statewise[0].recovered / data.statewise[0].confirmed) * 100).toFixed(2);
    recovered_rate.innerHTML = `Recovery Rate : ${formatNumber(rate3)}%`;
    let rate4 = ((data.statewise[0].deaths / data.statewise[0].confirmed) * 100).toFixed(2);
    deaths_rate.innerHTML = `Mortality Rate : ${formatNumber(rate4)}%`;
    let rate5 = data.tested[tested_length - 1].testspermillion;
    tested_rate.innerHTML = `Tests per Million : ${formatNumber(rate5)}`;
    updated_time.innerText = `Last Updated Time: ${data.statewise[0].lastupdatedtime}`;
  });
var form = document.querySelector(".input");
form.addEventListener("submit", function (event) {
  let input_text = document.getElementById("input-text").value;
  let input_text1 = capitalize_Words(input_text);
  getdata(input_text1);
  getdistricts(input_text1);
  event.preventDefault();
});
function getdata(input_text) {
  fetch("https://api.covid19india.org/state_district_wise.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let c=0;
      if (data[input_text] != undefined) {
        fetch('https://api.covid19india.org/data.json').then(res=>{
          return res.json();
        }).then(data=>{
          for(x in data.statewise){
            c++;
            if(input_text===data.statewise[x].state){
              document.querySelector(".th2-ac").innerText=formatNumber(data.statewise[c-1].active);
              document.querySelector(".th2-rc").innerText=formatNumber(data.statewise[c-1].recovered);
              document.querySelector(".th2-cf").innerText=formatNumber(data.statewise[c-1].confirmed);
              document.querySelector(".th2-dt").innerText=formatNumber(data.statewise[c-1].deaths);
              document.querySelector(".th2-cf-diff").innerText=`+${formatNumber(data.statewise[c-1].deltaconfirmed)}`;
              document.querySelector(".th2-rc-diff").innerText=`+${formatNumber(data.statewise[c-1].deltarecovered)}`;
              document.querySelector(".th2-dt-diff").innerText=`+${formatNumber(data.statewise[c-1].deltadeaths)}`;
              document.querySelector(".last-time").innerText=`Last updated time${data.statewise[c-1].lastupdatedtime}`
              let rate2 = ((data.statewise[c-1].active / data.statewise[c-1].confirmed) * 100).toFixed(2);
              document.querySelector(".th2-ac-rate").innerHTML = `Active Rate : ${rate2}%`;
              let rate3 = ((data.statewise[c-1].recovered / data.statewise[c-1].confirmed) * 100).toFixed(2);
              document.querySelector(".th2-rc-rate").innerHTML = `Recovery Rate : ${rate3}%`;
              let rate4 = ((data.statewise[c-1].deaths / data.statewise[c-1].confirmed) * 100).toFixed(2);
              document.querySelector(".th2-dt-rate").innerHTML = `Mortality Rate : ${rate4}%`;
              let th2_ac=data.statewise[c-1].deltaconfirmed-data.statewise[c-1].deltarecovered-data.statewise[c-1].deltadeaths;
              if(th2_ac>=0){
                document.querySelector(".th2-ac-diff").innerText=`+${th2_ac}`;
              }
              else{
                document.querySelector(".th2-dt-diff").innerText=`${th2_ac}`;
              }
            }
          }
        })
        document.querySelector(".error").style.display = "none";
        document.querySelector(".th2").style.visibility="visible";
        document.querySelector(".th3").classList.remove("hide");
      } else {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".th2").style.visibility="hidden";
        document.querySelector(".th3").classList.add("hide");
      }
    });
}
function getdistricts(ele){
  fetch('https://api.covid19india.org/state_district_wise.json').then(res=>{
    return res.json();
  }).then(data=>{
        for(x in data){
          Object.entries(data[x].districtData).map(key=>{
            if(key[0]===ele){
              document.querySelector(".th2-cf").innerHTML=formatNumber(key[1].confirmed);
              document.querySelector(".th2-rc").innerHTML=formatNumber(key[1].recovered);
              document.querySelector(".th2-ac").innerHTML=formatNumber(key[1].active);
              document.querySelector(".th2-dt").innerHTML=formatNumber(key[1].deceased);
              document.querySelector(".th2-cf-diff").innerHTML=`+${formatNumber(key[1].delta.confirmed)}`;
              document.querySelector(".th2-rc-diff").innerHTML=`+${formatNumber(key[1].delta.recovered)}`;
              document.querySelector(".th2-dt-diff").innerHTML=`+${formatNumber(key[1].delta.deceased)}`;
              let active_dis=key[1].delta.confirmed-key[1].delta.recovered-key[1].delta.deceased;
              if(active_dis>=0){
                document.querySelector(".th2-ac-diff").innerHTML=`+${formatNumber(active_dis)}`;
              }
              else if(active_dis<0){
                document.querySelector(".th2-ac-diff").innerHTML=`${formatNumber(active_dis)}`;
              }
              let rate2 = ((key[1].active/key[1].confirmed) * 100).toFixed(2);
              document.querySelector(".th2-ac-rate").innerHTML = `Active Rate : ${rate2}%`;
              let rate3 = ((key[1].recovered/key[1].confirmed) * 100).toFixed(2);
              document.querySelector(".th2-rc-rate").innerHTML = `Recovery Rate : ${rate3}%`;
              let rate4 = ((key[1].deceased/key[1].confirmed) * 100).toFixed(2);
              document.querySelector(".th2-dt-rate").innerHTML=`Death Rate : ${rate4}%`;
              document.querySelector(".error").style.display = "none";
              document.querySelector(".th2").style.visibility="visible";
              document.querySelector(".th3").classList.remove("hide");
            }
            
          })
        }
    
  })
}
function capitalize_Words(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

