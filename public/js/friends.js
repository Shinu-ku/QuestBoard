const requestsDiv = document.getElementById("requests")
const friendsDiv = document.getElementById("friendsList")
const searchResults = document.getElementById("searchResults")


// =====================
// SEARCH PLAYERS
// =====================

async function searchPlayers(){

const q = document.getElementById("playerSearch").value

if(!q){
searchResults.innerHTML=""
return
}

const res = await fetch("/api/friends/search?q="+q)
const users = await res.json()

searchResults.innerHTML=""

users.forEach(u=>{

searchResults.innerHTML += `
<div class="search-result">

<div>
<b>${u.username}</b>
<div style="font-size:12px;color:#aaa;">
Level ${u.level} • XP ${u.xp}
</div>
</div>

<button onclick="sendRequest('${u._id}')">
Add
</button>

</div>
`

})

}


// =====================
// SEND FRIEND REQUEST
// =====================

async function sendRequest(id){

const res = await fetch("/api/friends/send/"+id,{
method:"POST"
})

const data = await res.json()

alert(data.msg || "Friend request sent")

searchPlayers()   // refresh results

}

// =====================
// LOAD REQUESTS
// =====================

async function loadRequests(){

const res = await fetch("/api/friends/requests")
const requests = await res.json()

requestsDiv.innerHTML = ""

requests.forEach(r=>{

requestsDiv.innerHTML += `
<div class="friend">

<div class="friend-info">
<div class="friend-name">${r.sender.username}</div>
<div class="friend-stats">Level ${r.sender.level}</div>
</div>

<div class="friend-actions">
<button class="accept" onclick="acceptRequest('${r._id}')">Accept</button>
<button class="reject" onclick="rejectRequest('${r._id}')">Reject</button>
</div>

</div>
`

})

}


// =====================
// LOAD FRIEND LIST
// =====================

async function loadFriends(){

const res = await fetch("/api/friends/list")
const friends = await res.json()

friendsDiv.innerHTML = ""

friends.forEach(f=>{

friendsDiv.innerHTML += `
<div class="friend">

<div class="friend-info">
<div class="friend-name">${f.username}</div>
<div class="friend-stats">
Level ${f.level} • XP ${f.xp} • Streak ${f.streak}
</div>
</div>

</div>
`

})

}


// =====================
// ACCEPT REQUEST
// =====================

async function acceptRequest(id){

await fetch("/api/friends/accept/"+id,{
method:"POST"
})

loadRequests()
loadFriends()

}


// =====================
// REJECT REQUEST
// =====================

async function rejectRequest(id){

await fetch("/api/friends/reject/"+id,{
method:"POST"
})

loadRequests()

}


// =====================
// LEADERBOARD
// =====================

async function loadLeaderboard(){

const [friendsRes, meRes] = await Promise.all([
fetch("/api/friends/list"),
fetch("/api/user/me")
])

const friends = await friendsRes.json()
const me = await meRes.json()

// add current user to leaderboard
const players = [
{
username: me.username,
level: me.level,
xp: me.xp,
streak: me.streak,
self:true
},
...friends
]

// sort leaderboard
players.sort((a,b)=>{
if(b.level !== a.level) return b.level - a.level
return b.xp - a.xp
})

const leaderboard = document.getElementById("leaderboard")

leaderboard.innerHTML = ""

players.forEach((p,index)=>{

leaderboard.innerHTML += `
<div class="leaderboard-row ${p.self ? "me" : ""}">

<div class="rank">#${index+1}</div>

<div class="player">

<div class="name">
${p.username} ${p.self ? "(You)" : ""}
</div>

<div class="stats">
Level ${p.level} • XP ${p.xp} • Streak ${p.streak}
</div>

</div>

</div>
`

})

}

// ==============================
// LOGOUT
// ==============================

async function logout(){

  await fetch("/api/auth/logout")

  window.location.href = "/"

}


// =====================
// INIT
// =====================

loadRequests()
loadFriends()
loadLeaderboard()