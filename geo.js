// 
const myPosition = {}
// Options pour la géolocalisation de l'user
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximunAge: 0
}
const init = () => {
    // Quelle est la situation aux niveaux des permissions
    navigator.permissions.query({name:"geolocation"})
    .then(response => {
        console.log(response.state)
        /* a-t-on déjà les droits*/
        if(response.state === 'granted') {
            console.log('active')
            /* demande des droits et géolocalisation de l'user : 
            - si ok => appel de la fonction okPosition 
            - si pas ok => appel de la fonction errorPosition
            */
            navigator.geolocation.getCurrentPosition(okPosition, errorPosition, options)
        } else if(response.state === 'prompt') {
            console.log('demande')
            
            navigator.geolocation.getCurrentPosition(okPosition, errorPosition, options)
        } else {
            console.log('bloqué')
        }
    })
}
// Si geolocalisation ok 
const okPosition = (position) => {
    // Définition d'un objet (position) avec ma position
    myPosition.latitude = position.coords.latitude
    myPosition.longitude = position.coords.longitude
    //console.log(myPosition)
    // Déclanche la carte
    initMap()
}
// Si error de geolocalisation
const errorPosition = () => {
    console.log('demande refusée')
}
init()

