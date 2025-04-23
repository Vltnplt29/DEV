const installButton = document.querySelector('.install-button')
let defferredPrompt = null

window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault()
    defferredPrompt = event
    installButton.classList.remove('hidden')
})

installButton.addEventListener('click', event => {
    event.preventDefault()
    installButton.classList.add('hidden')
    defferredPrompt.prompt()
    
    defferredPrompt.userChoice
    .then(choice => {
        console.log(choice)
    })
    defferredPrompt = null
})