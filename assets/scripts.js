"use strict";

const country = document.getElementById("country");
const flag = document.getElementById("flag");
const region = document.getElementById("region");
const subregion = document.getElementById("subregion");

fetch("https://restcountries.com/v3.1/all?fields=name,flags,region,subregion")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      console.log("Failed to get data: " + response);
    }
  })
  .then(function (data) {

    console.log(data);
    
  });
