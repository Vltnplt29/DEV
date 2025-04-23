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

const initMap = () => {
    console.log('initMap', myPosition)

    const $map = document.querySelector('#map')

    const map = L.map('map').setView([myPosition.latitude, myPosition.longitude], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { 
        maxZoom: 19,
        attribution: 'Cepegra'
    }).addTo(map);

    L.control.scale({imperial: false, updateWhenIdle: true}).addTo(map);

map.on('click', (event) => {
        let position= {
            latitude: event.latlng.lat,
            longitude: event.latlng.lng
        }
        L.marker([position.latitude, position.longitude], {title: "click"}).addTo(map)
        affStops(map, position)
    })

const optionsMarker = {
        title: "Vous êtes ici",
        icon: iconPosition
      }

L.marker([myPosition.latitude, myPosition.longitude], optionsMarker).addTo(map)
    
affStops(map, myPosition)
//Philippeville
let newPosition = {latitude:50.196241, longitude: 4.543508 }
affStops(map,newPosition)
    
}

const affStops = (map, position) => {
    console.log('affStops',position)
    //requête sur l'api des Tec
    const distance = 1

   fetch(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/poteaux-tec/records?where=within_distance(geo_point_2d%2C%20geom%27POINT(${position.longitude}%20${position.latitude})%27%2C%20${distance}km)&limit=20&lang=fr`)
   .then(resp => resp.json())
   .then(resp => {
        console.log(resp)
        //boucler les arrêts de bus
        resp.results.forEach(stop => {
            //deconstruction de l'objet
           const {lat, lon} = stop.geo_point_2d
           const {pot_nom_ha } = stop
          
             L.marker([lat-0.000617, lon+0.0011], {icon:iconStop, title: pot_nom_ha}).addTo(map).bindPopup(pot_nom_ha)
        })
    })
   .catch(err => console.log(err))
}
/* philippevile : 50.196241, 4.543508 */