"use strict";

const mapViewBtn = document.getElementById("mapViewBtn");
const aboutBtn = document.getElementById("aboutBtn");

const mapViewSection = document.getElementById("mapViewSection");
const aboutSection = document.getElementById("aboutSection");


const mapViewBtnHandler = (e) => {
  if (e.type == "click" || e.code == "Enter" || e.code == "NumpadEnter") {
    mapViewSection.classList.add("active");
    aboutSection.classList.remove("active");
  }
}

const aboutBtnHandler = (e) => {
  if (e.type == "click" || e.code == "Enter" || e.code == "NumpadEnter") {
    aboutSection.classList.add("active");
    mapViewSection.classList.remove("active");
  }
}


mapViewBtn.addEventListener("click", mapViewBtnHandler);
mapViewBtn.addEventListener("keydown", mapViewBtnHandler);

aboutBtn.addEventListener("click", aboutBtnHandler);
aboutBtn.addEventListener("keydown", aboutBtnHandler);
