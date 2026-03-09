// ==========================
// GLOBAL THEME MUSIC
// ==========================

const theme = new Audio("/assets/sounds/Theme.mp3")
theme.loop = true
theme.volume = 0.25


// ==========================
// RESTORE PLAYBACK POSITION
// ==========================

const savedTime = localStorage.getItem("themeTime")

if(savedTime){
    theme.currentTime = parseFloat(savedTime)
}


// ==========================
// SAVE POSITION
// ==========================

setInterval(()=>{
    localStorage.setItem("themeTime", theme.currentTime)
},1000)


// ==========================
// START AFTER USER CLICK
// ==========================

function startTheme(){

    if(localStorage.getItem("sound") === "off") return

    theme.play().catch(()=>{})

}

document.addEventListener("click", startTheme, { once:true })


// ==========================
// SOUND TOGGLE
// ==========================

function toggleSound(){

    const state = localStorage.getItem("sound")

    if(state === "off"){

        localStorage.setItem("sound","on")
        theme.play().catch(()=>{})

    }else{

        localStorage.setItem("sound","off")
        theme.pause()

    }

}