async function loadProfile(){

const res = await fetch("/api/user/me")
const user = await res.json()

profileName.innerText = user.username
profileLevel.innerText = "Level " + user.level
streak.innerText = "🔥 Streak: " + user.streak

const progress = user.xp % 100
xpBar.style.width = progress + "%"
xpText.innerText = progress + " / 100 XP"

avatar.src = "assets/characters/" + user.avatar

}

async function setAvatar(file){

await fetch("/api/user/avatar",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ avatar:file })
})

avatar.src = "assets/characters/" + file

}

loadProfile()

// ==============================
// LOGOUT
// ==============================

async function logout(){

  await fetch("/api/auth/logout")

  window.location.href = "/"

}
