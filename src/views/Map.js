const m = require('mithril')
const L = require('leaflet')


const layer = {
    "type": "FeatureCollection",
    "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-73.71006, 40.848415]
            },
            "properties": {
                "name": "Port Washington, New York",
                "period": {
                    "start": "1997",
                    "end": "2015"
                },
                "description": "I grew up here. Not much of a choice for this one.",
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-97.748306, 30.285085]
            },
            "properties": {
                "name": "Austin, Texas",
                "period": {
                    "start": "2015",
                    "end": "present"
                },
                "description": "Pursuing a B.S. in mathematics @ <a href='https://www.utexas.edu/' target='_blank' rel='noopener'>UT Austin</a>. Emphasis on the B.S. 😉",
            }

        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-122.3321, 47.6062]
            },
            "properties": {
                "name": "Seattle, Washington",
                "period": {
                    "start": "2016 (Summer)",
                    "end": null
                },
                "description": "Spent the summer with my twin brother, who goes to UW, and worked as a cashier @ <a href='https://www.pacificsciencecenter.org/' target='_blank' rel='noopener'>Pacific Science Center</a>."
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-87.630385, 41.882331]
            },
            "properties": {
                "name": "Chicago, Illinois",
                "period": {
                    "start": "2017 (Summer)",
                    "end": null
                },
                "description": "Data intern @ <a href='https://nexttier.com/' target='_blank' rel='noopener'>NextTier Education</a> and mapping intern @ <a href='https://www.hotosm.org/'  target='_blank' rel='noopener'>Humanitarian OpenStreetMap Team</a> (HOT)."
            }
        }
    ]
}


const geojsonMarkerOptions = {
    radius: 7,
    fillColor: "#2d96cd",
    color: "#000",
    weight: 1.5,
    opacity: .75,
    fillOpacity: 0.8
};


function onEachFeature(feature, layer) {

    if (feature.properties) {
        let props = feature.properties

        layer.bindPopup(
            `
            <h2 class="popup-city">${props.name}</h2>
            <p class="popup-text"><b>WHEN</b>: ${props.period.start} ${props.period.end ? `- ${props.period.end}` : ``}</p>
            <p class="popup-text"><b>WHY</b>: ${props.description}</p>
            `
        )
    }
}


// Add some listener to map for phone rotation?
const MapComponent = function () {
    let map

    return {

        oncreate() {

            // fix map border color bug when applying theme change before switching to map page
            if (document.body.className === 'theme-dark') {
                document.getElementById('map-container').className = 'border-light'
            } else {
                document.getElementById('map-container').className = 'border-dark'
            }


            const map = L.map('map', {
                zoomControl: false
            }).setView([38, -98], window.innerWidth > 550 ? 4 : 3)

            L.tileLayer('https://api.mapbox.com/styles/v1/andrewchou/cj3nmat3z002b2sqnvy3g2c04/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5kcmV3Y2hvdSIsImEiOiJjajJqeXR5b2cwMGRiMnFucW53NWJmNjlnIn0.LmmouuLX7C6EE61cOUez3A', {
                maxZoom: 15,
                accessToken: 'pk.eyJ1IjoiYW5kcmV3Y2hvdSIsImEiOiJjajJqeXR5b2cwMGRiMnFucW53NWJmNjlnIn0.LmmouuLX7C6EE61cOUez3A',
            }).addTo(map);


            // Add markers to map
            new L.GeoJSON(layer, {
                pointToLayer: function (feature, latlng) {

                    // return a divIcon marker so that I can make them Rhombi!!!
                    return L.circleMarker(latlng, geojsonMarkerOptions)

                },
                onEachFeature: onEachFeature
            }).addTo(map)


            // Put zoom control at bottomleft of page instead of default topleft
            L.control.zoom({
                position: 'bottomleft'
            }).addTo(map)
        },
        
        // This shit ain't working
        /*
        onremove() {
            map.remove()
        },
        */
        

        view() {
            return m('#map')
        }
    }
}


module.exports = {
    view() {
        return [
            m('h1.title', 'Whereabouts'),
            m('div.text-center', 'If you\'re on mobile, I suggest turning your screen horizontally.'),
            m('br'),
            m('#map-container.border-dark', m(MapComponent))
        ]
    }
}