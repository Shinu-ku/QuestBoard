const requestsDiv = document.getElementById("requests")
const friendsDiv = document.getElementById("friendsList")


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
// INIT
// =====================

loadRequests()
loadFriends()