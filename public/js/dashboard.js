// ==============================
// QUEST TIMER ENGINE STORAGE
// ==============================

const questTimers = []
let timerEngineRunning = false


// ==============================
// DOM REFERENCES
// ==============================

const username = document.getElementById("username")
const level = document.getElementById("level")
const streak = document.getElementById("streak")
const xpBar = document.getElementById("xpBar")
const xp = document.getElementById("xp")
const avatar = document.getElementById("avatar")
const questsContainer = document.getElementById("quests")


// ==============================
// SOUND SYSTEM
// ==============================

const sfx = {
 // theme: new Audio("/assets/sounds/Theme.mp3"),
 // battle: new Audio("/assets/sounds/Battle_Theme.mp3"),
  complete: new Audio("/assets/sounds/complete.mp3"),
  legendaryComplete: new Audio("/assets/sounds/legendary_complete.mp3"),
  levelup: new Audio("/assets/sounds/levelup.mp3"),
  rare: new Audio("/assets/sounds/rare.mp3"),
  legendary: new Audio("/assets/sounds/legendary.mp3"),
  expire: new Audio("/assets/sounds/expire.mp3")
}

// preload and set volume
Object.values(sfx).forEach(sound => {
  sound.volume = 0.4
  sound.preload = "auto"
})

function playSound(sound){

  if(localStorage.getItem("sound") === "off") return

  if(!sound.paused){
    sound.pause()
  }

  sound.currentTime = 0

  sound.play().catch(()=>{})

}


// // ==============================
// // Create Quest Modal
// // ==============================

let selectedQuestType = "daily";

document.querySelectorAll(".quest-type-btn").forEach(btn => {

btn.addEventListener("click", () => {

document.querySelectorAll(".quest-type-btn")
.forEach(b => b.classList.remove("active"));

btn.classList.add("active");

selectedQuestType = btn.dataset.type;

});

});

// ==============================
// LOAD USER STATS
// ==============================

async function loadStats(){

  try{

    const res = await fetch("/api/user/me")

    if(!res.ok) throw new Error("User fetch failed")

    const user = await res.json()

    username.textContent = user.username

    level.textContent = "Level " + user.level

    streak.textContent = "🔥 Streak: " + user.streak

    const progress = user.xp % 100

    xpBar.style.width = progress + "%"

    xp.textContent = progress + " / 100 XP"

    avatar.src =
      user.avatarType === "custom"
      ? "avatars/users/" + user.avatar
      : "assets/characters/" + user.avatar

  }catch(err){

    console.error("Stats load error:", err)

  }

}


// ==============================
// LOAD QUESTS
// ==============================

async function loadQuests(){

  try{

    questTimers.length = 0

    const res = await fetch("/api/quests/my")

    const quests = await res.json()

    questsContainer.innerHTML = ""

    quests.forEach(q => {

      const card = document.createElement("div")

      card.className = `quest-card ${q.rarity}`

      card.innerHTML = `
        <h3>${q.title}</h3>
        <p>${q.description || ""}</p>
        <p>Status: ${q.status}</p>
        <p class="timer"></p>

        <div class="quest-actions">
        <button class="complete-btn">Complete</button>
        <button class="delete-btn">Delete</button>
        </div>
        `

      const btn = card.querySelector(".complete-btn")

      btn.addEventListener("click", () =>
        completeQuest(q._id, q.rarity, card)
      )
      const deleteBtn = card.querySelector(".delete-btn")

      deleteBtn.addEventListener("click", () =>
        deleteQuest(q._id)
      )
      questsContainer.appendChild(card)

      registerQuestTimer(
        card.querySelector(".timer"),
        q.expiresAt,
        q.status
      )

    })

  }catch(err){

    console.error("Quest load error:", err)

  }

}


// ==============================
// COMPLETE QUEST
// ==============================

async function completeQuest(id, rarity, card){

  //playSound(sfx.battle)

  card.classList.add("quest-complete")

  setTimeout(()=>{
    card.classList.remove("quest-complete")
  },600)

  try{

    const res = await fetch("/api/quests/complete/" + id,{
      method:"POST"
    })

    const data = await res.json()

    playSound(sfx.complete)

    if(rarity === "legendary" || rarity === "epic"){
      playSound(sfx.legendaryComplete)
    }

    if(data.leveledUp){
      playSound(sfx.levelup)
      showLevelUp(data.level)
    }

    await loadStats()

    await loadQuests()

  }catch(err){

    console.error("Quest completion error:", err)

  }

}

// ==============================
// CREATE QUEST
// ==============================


function openQuestModal(){
  document.getElementById("questModal").classList.remove("hidden")
}

function closeQuestModal(){
  document.getElementById("questModal").classList.add("hidden")
}


async function createQuest(){

  const title = document.getElementById("questTitle").value
  const description = document.getElementById("questDesc").value
  const questType = selectedQuestType

  if(!title){
    alert("Quest title required")
    return
  }

  const res = await fetch("/api/quests/create",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      title,
      description,
      questType
    })
  })

  if(res.ok){
    closeQuestModal()
    loadQuests()
  }

}

// ==============================
// DELETE QUEST
// ==============================


async function deleteQuest(id){

  if(!confirm("Delete this quest?")) return

  const res = await fetch("/api/quests/delete/" + id,{
    method:"DELETE"
  })

  if(res.ok){
    loadQuests()
  }

}

// ==============================
// REGISTER QUEST TIMER
// ==============================

function registerQuestTimer(element, expiresAt, status){

  if(status !== "active") return

  questTimers.push({
    element,
    expiresAt: new Date(expiresAt).getTime()
  })

}


// ==============================
// GLOBAL TIMER ENGINE
// ==============================

function startQuestTimerEngine(){

  if(timerEngineRunning) return

  timerEngineRunning = true

  setInterval(()=>{

    const now = Date.now()

    questTimers.forEach(timer => {

      const diff = timer.expiresAt - now

      if(diff <= 0){

        if(timer.element.textContent !== "Expired"){

          timer.element.textContent = "Expired"

          playSound(sfx.expire)

        }

        return
      }

      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)

      timer.element.textContent =
        `Time left: ${h}h ${m}m ${s}s`

    })

  },1000)

}


// ==============================
// LEVEL UP POPUP
// ==============================

function showLevelUp(level){

  const popup = document.getElementById("levelPopup")
  const text = document.getElementById("newLevelText")

  if(!popup || !text) return

  text.textContent = "You reached Level " + level

  popup.classList.remove("hidden")

  setTimeout(()=>{
    popup.classList.add("hidden")
  },2500)

}



// ==============================
// THEME SYSTEM
// ==============================

function setTheme(theme){

  document.getElementById("theme-style").href =
    "css/theme/" + theme + ".css"

  localStorage.setItem("theme", theme)

}

function loadTheme(){

  const theme = localStorage.getItem("theme") || "default"

  document.getElementById("theme-style").href =
    "css/theme/" + theme + ".css"

}


// ==============================
// LOGOUT
// ==============================

async function logout(){

  await fetch("/api/auth/logout")

  window.location.href = "/"

}


// ==============================
// INIT
// ==============================

function init(){

  loadTheme()

  loadStats()

  loadQuests()

  startQuestTimerEngine()

}

init()