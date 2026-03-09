async function login(){

  const res = await fetch("/api/auth/login",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      email:email.value,
      password:password.value
    })
  })

  if(res.ok){

    window.location.href = "dashboard.html"

  }else{

    alert("Login failed")

  }
}