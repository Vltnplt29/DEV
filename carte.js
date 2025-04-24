const iconPosition = L.icon({
    iconUrl: 'icons/icon-map-user-location.svg',
    iconSize: [53, 53],
    iconAnchor: [16, 55],
    popupAnchor: [10,-37]
})

const iconStop = L.icon({
    iconUrl: 'icons/icon-map-bus-stop.svg',
    iconSize: [53, 53],
    iconAnchor: [16, 55],
    popupAnchor: [10,-37]
})

const iconStart = L.icon({
    iconUrl: 'icons/icon-map-bus-start.svg',
    iconSize: [53, 53],
    iconAnchor: [16, 55],
    popupAnchor: [10,-37]
})

const iconEnd = L.icon({
    iconUrl: 'icons/icon-map-bus-end.svg',
    iconSize: [53, 53],
    iconAnchor: [16, 55],
    popupAnchor: [10,-37]
})
let  map = null
//let clickedMarker = null;
let stopsLayer = null // contiendra tous les arrêts de bus

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

    L.control.scale({imperial: false, updateWhenIdle: true}).addTo(map);

    const optionsMarker = {
        title: "Vous êtes ici",
        icon: iconPosition
      }

    L.marker([myPosition.latitude, myPosition.longitude], optionsMarker).addTo(map)
    
    
    affStops(map, myPosition, true)
    
    /*
    //Philippeville
    let newPosition = {latitude:50.196241, longitude: 4.543508 }
    affStops(map,newPosition)
    */

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
           const {pot_nom_ha } = stop
          
             let marker = L.marker([lat-0.000617, lon+0.0011], {icon:iconStop}).bindPopup(pot_nom_ha)
             if (!start) {
                stopsLayer.addLayer(marker)
            } else {
                marker.addTo(map)
            }
        })

    })
   .catch(err => {
       console.log(err)
       alert('')
   })
}

/* philippevile : 50.196241, 4.543508 */