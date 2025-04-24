/*
//Philippeville
let newPosition = {latitude:50.196241, longitude: 4.543508 }
affStops(map,newPosition, true or false)
*/
// Affichage et paramètre de l'icon de ma position
const iconPosition = L.icon({
    iconUrl: 'icons/icon-map-user-location.svg',
    iconSize: [53, 53],
    iconAnchor: [16, 55],
    popupAnchor: [10,-37]
})
// Affichage et paramètre de l'icon stop
const iconStop = L.icon({
    iconUrl: 'icons/icon-map-bus-stop.svg',
    iconSize: [45, 45],
    iconAnchor: [16, 55],
    popupAnchor: [10,-37]
})
// Affichage et paramètre de l'icon Start
const iconStart = L.icon({
    iconUrl: 'icons/icon-map-bus-start.svg',
    iconSize: [50, 50],
    iconAnchor: [16, 55],
    popupAnchor: [10,-37]
})
// Affichage et paramètre de l'icon End
const iconEnd = L.icon({
    iconUrl: 'icons/icon-map-bus-end.svg',
    iconSize: [50, 50],
    iconAnchor: [16, 55],
    popupAnchor: [10,-37]
})
let  map = null // stock de la carte 

let lineLayer = null

let stopsLayer = null // stock du layer 

const initMap = () => {
    console.log('initMap', myPosition)

    const $map = document.querySelector('#map')

    map = L.map('map').setView([myPosition.latitude, myPosition.longitude], 17);
    //L.tileLayer('http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', { 
        L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', { 
        maxZoom: 19,
        attribution: 'Cepegra'
    }).addTo(map);

    stopsLayer = L.layerGroup().addTo(map)
    lineLayer = L.layerGroup().addTo(map)

    L.control.scale({imperial: false, updateWhenIdle: true}).addTo(map);

    const optionsMarker = {
        title: "Vous êtes ici",
        icon: iconPosition
      }

      L.marker([myPosition.latitude, myPosition.longitude], optionsMarker).addTo(map)
    
    
    affStops(map, myPosition, true)
    

    map.on('click', function(e) {
        const clickedLatLng = e.latlng;
        const clickedPosition = {
            latitude: clickedLatLng.lat,
            longitude: clickedLatLng.lng
        };
    
        // Supprimer les anciens marqueurs
        stopsLayer.clearLayers();
    
        // Ajouter un nouveau marqueur à l'endroit cliqué
        let marker = L.marker([clickedPosition.latitude, clickedPosition.longitude])
            .bindPopup("Arrêts proches ici")
            .openPopup();
           
            stopsLayer.addLayer(marker)
    
        // Afficher les nouveaux arrêts
        affStops(map, clickedPosition);
    
      
    });
}

const affStops = (map,position, start=false) => {
    console.log('affStops',position)

    //requête sur l'api des Tec
    const distance = 1

    // Requête sur l'API des Tec en passant une position et une distance
   fetch(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/poteaux-tec/records?where=within_distance(geo_point_2d%2C%20geom%27POINT(${position.longitude}%20${position.latitude})%27%2C%20${distance}km)&limit=20&lang=fr`)
   .then(resp => resp.json())
   .then(resp => {
        console.log(resp)     
        if(resp.total_count == 0) {
            alert('Pas de bus autour de vous.')
        }   
        //boucler les arrêts de bus
        resp.results.forEach(stop => {
            //deconstruction de l'objet
           const {lat, lon} = stop.geo_point_2d
           const {pot_nom_ha, pot_id } = stop
            
            // Créer un marker qui utilise des variables
            let marker = L.marker([lat-0.000617, lon+0.0011], {icon:iconStop})
                .on('click',event => {let template = getBus(pot_id, marker, pot_nom_ha)})
            // Si on est pas au début (start == false), on ajoute le market au layer
             if (!start) {
                stopsLayer.addLayer(marker)
            } else {
                marker.addTo(map)
            }


    })
})
    // Si erreur renvoi dans la console et lance une alert
   .catch(err => {
       console.log(err)
       alert('')
   })

}

const getBus = (pot_id, marker, pot_nom_ha) => {
    fetch(`https://cepegra-frontend.xyz/bootcamp/stops/${pot_id}`)
    .then(resp => resp.json())
    .then(resp => {
        console.log(resp)
        let template = `
        <p><strong>${pot_nom_ha}</strong></p>`
        if(resp.code == "ok" && resp.nbhits > 0) {
            resp.content.forEach(line => {
            template += `<p class="marker-link" onclick="affLine('${line.shape_id}');">${line.route_short_name} - ${line.route_long_name}</p>`
            })
        } else if(resp.code == "pas ok") {
            template += `<p> class="eeror">Pas de bus</p>`
        }
        marker.bindPopup(template).openPopup()

    })
    .catch(err => {
        console.log(err)
        alert('Erreur serveur')
    })
}

affLine = (shape_id) => {
    console.log('shape_id')
    lineLayer.clearLayers()
    fetch(`https://cepegra-frontend.xyz/bootcamp/shapes/${shape_id}`)
    .then(resp => resp.json())
    .then(resp => {
        console.log(resp)
        const dataPositions = resp.content.map(el => [el.shape_pt_lat, el.shape_pt_lon])
        console.log(dataPositions[0])
        let marker
        // Icon de début de course
        marker = L.marker(dataPositions[0], {icon: iconStart}).bindPopup('Départ')
        lineLayer.addLayer(marker)
        // Icon de fin de course 
        marker = L.marker(dataPositions[dataPositions.length-1], {icon: iconEnd}).bindPopup('Arrivée')
        lineLayer.addLayer(marker)
        let polyline = L.polyline(dataPositions, {color:'red', weight : 10})
        lineLayer.addLayer(polyline)
    })
    .catch(err => console.log(err))
}

