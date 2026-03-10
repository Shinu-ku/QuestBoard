function setTheme(theme){

  document.getElementById("theme-style").href =
    "css/themes/" + theme + ".css"

  localStorage.setItem("theme",theme)
}

const savedTheme = localStorage.getItem("theme") || "default"

document.getElementById("theme-style").href =
  "css/themes/" + savedTheme + ".css"


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