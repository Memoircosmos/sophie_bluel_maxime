document.addEventListener('DOMContentLoaded', () =>{
    const form = document.querySelector('#login-form')
    const messageError = document.createElement('div')
    messageError.innerHTML = 'Identifiants de connection incorrects'

    form.addEventListener('submit',async(event) => {
        event.preventDefault() /*évite la soumission du formulaire par défaut*/
        const email =  document.querySelector('#email').value
        const password = document.querySelector('#password').value
        try {
            const response = await fetch('http://localhost:5678/api/users/login',{
                method:'POST',
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify({
                    email: email,
                    password: password
                })
            })

            const data = await response.json()
            if (response.ok){
                localStorage.setItem('token',data.token)
                window.location.href = 'index.html'
            }else{
                messageError.style.backgroundColor = 'red'
                messageError.style.color = 'white'
                form.appendChild(messageError)
            }
        } catch (error) {
            console.error('erreur lors de la connection', error)
            messageError.style.backgroundColor = 'red'
            messageError.style.color = 'white'
            form.appendChild(messageError)
        }
    })
})



