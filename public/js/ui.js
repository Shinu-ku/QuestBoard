let guideTimer = null
// =====================
// GUIDE SYSTEM
// =====================

let lastGuideTime = 0
const GUIDE_COOLDOWN = 8000

async function loadGuide(){

  const container = document.getElementById("guideContainer")

  if(!container) return

  try{

    const res = await fetch("/components/guide.html")
    const html = await res.text()

    container.innerHTML = html

  }catch(err){

    console.error("Guide load failed:", err)

  }

}

document.addEventListener("DOMContentLoaded", loadGuide)


// =====================
// GUIDE MESSAGE DISPLAY
// =====================

window.guide = function(message, character="female4.png", duration=5000){

const box = document.getElementById("gameGuide")
const text = document.getElementById("guideText")
const img = document.getElementById("guideCharacter")

const yes = document.getElementById("guideYes")
const no = document.getElementById("guideNo")
const close = document.getElementById("guideClose")

if(!box || !text) return

// stop previous timers
if(guideTimer){
clearTimeout(guideTimer)
guideTimer = null
}

text.innerText = message
img.src = "/assets/characters/" + character

yes.style.display = "none"
no.style.display = "none"
close.style.display = "inline-block"

box.classList.remove("hidden")

guideTimer = setTimeout(()=>{
box.classList.add("hidden")
guideTimer = null
}, duration)

}

// =====================
// Guide Confirmation Function
// =====================

window.guideConfirm = function(message){

return new Promise((resolve)=>{

const box = document.getElementById("gameGuide")
const text = document.getElementById("guideText")

const yes = document.getElementById("guideYes")
const no = document.getElementById("guideNo")
const close = document.getElementById("guideClose")

if(!box || !text) return resolve(false)

// cancel any existing auto-close timer
if(guideTimer){
clearTimeout(guideTimer)
guideTimer = null
}

text.innerText = message

yes.style.display = "inline-block"
no.style.display = "inline-block"
close.style.display = "none"

box.classList.remove("hidden")

yes.onclick = ()=>{
box.classList.add("hidden")
resolve(true)
}

no.onclick = ()=>{
box.classList.add("hidden")
resolve(false)
}

})

}

// =====================
// CLOSE GUIDE
// =====================

window.closeGuide = function(){

  const box = document.getElementById("gameGuide")

  if(box){
    box.classList.add("hidden")
  }

}


// =====================
// GUIDE MESSAGE RANDOMIZER
// =====================

function randomMessage(type){

  if(!window.GuideMessages) return ""

  const list = GuideMessages[type]

  if(!list || list.length === 0) return ""

  return list[Math.floor(Math.random() * list.length)]

}


// =====================
// THEME SELECTOR
// =====================

function setTheme(theme){

  const themeLink = document.getElementById("theme-style")

  if(!themeLink) return

  themeLink.href = "css/themes/" + theme + ".css"

  localStorage.setItem("theme", theme)

}


// =====================
// LOAD SAVED THEME
// =====================

function loadTheme(){

  const themeLink = document.getElementById("theme-style")

  if(!themeLink) return

  const savedTheme = localStorage.getItem("theme") || "default"

  themeLink.href = "css/themes/" + savedTheme + ".css"

}

document.addEventListener("DOMContentLoaded", loadTheme)


// =====================
// SOUND TOGGLE SYSTEM
// =====================

function toggleSound(){

  const icon = document.getElementById("soundIcon")

  if(!icon) return

  const state = localStorage.getItem("sound")

  if(state === "off"){

    localStorage.setItem("sound","on")

    if(window.theme){
      theme.play().catch(()=>{})
    }

    icon.setAttribute("data-lucide","volume-2")

  }else{

    localStorage.setItem("sound","off")

    if(window.theme){
      theme.pause()
    }

    icon.setAttribute("data-lucide","volume-x")

  }

  if(window.lucide){
    lucide.createIcons()
  }

}


// =====================
// INIT SOUND ICON
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

  if(window.lucide){
    lucide.createIcons()
  }

}

document.addEventListener("DOMContentLoaded", initSoundIcon)