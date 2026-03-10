let selectedGender = "male"

function selectGender(g){

  selectedGender = g

  if(g === "male"){
    characterImg.src = "assets/characters/male1.png"
  }

  if(g === "female"){
    characterImg.src = "assets/characters/female1.png"
  }
}


async function register(){

  const res = await fetch("/api/auth/register",{

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({

      username:username.value,
      email:email.value,
      password:password.value,
      gender:selectedGender

    })

  })

  if(res.ok){

    guide("Account created!")

    window.location.href="index.html"

  }else{

    guide("Registration failed")

  }

}
