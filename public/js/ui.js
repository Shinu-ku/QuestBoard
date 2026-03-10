// =====================
// Guide
// =====================
async function loadGuide(){

const res = await fetch("/components/guide.html");
const html = await res.text();

document.getElementById("guideContainer").innerHTML = html;

}

loadGuide();

window.guide = function(message, character = "female4.png"){

const guide = document.getElementById("gameGuide");
const text = document.getElementById("guideText");
const img = document.getElementById("guideCharacter");

text.innerText = message;

img.src = "/assets/characters/" + character;

guide.classList.remove("hidden");

}

window.closeGuide = function(){
document.getElementById("gameGuide").classList.add("hidden");
}

// =====================
// Theme selecter
// =====================

function setTheme(theme){

  document.getElementById("theme-style").href =
    "css/themes/" + theme + ".css"

  localStorage.setItem("theme",theme)
}

const savedTheme = localStorage.getItem("theme") || "default"

document.getElementById("theme-style").href =
  "css/themes/" + savedTheme + ".css"


// =====================
// Sound Toggle System
// =====================

function toggleSound(){

const icon = document.getElementById("soundIcon")

const state = localStorage.getItem("sound")

if(state === "off"){

localStorage.setItem("sound","on")

theme.play().catch(()=>{})

icon.setAttribute("data-lucide","volume-2")

}else{

localStorage.setItem("sound","off")

theme.pause()

icon.setAttribute("data-lucide","volume-x")

}

lucide.createIcons()

}

// =====================
// Sound Icon State
// =====================

function initSoundIcon(){

const icon = document.getElementById("soundIcon")

if(!icon) return

const state = localStorage.getItem("sound")

if(state === "off"){
icon.setAttribute("data-lucide","volume-x")
}else{
icon.setAttribute("data-lucide","volume-2")
}

lucide.createIcons()

}