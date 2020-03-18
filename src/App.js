import React, { useEffect, useState } from 'react'; 
import logo from './logo.svg';
import './App.css';
import mapboxgl from 'mapbox-gl';


// const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
 

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const App = () =>  {

  let mapRef = React.createRef();
    const [ isAdding, setIsAdding ] = useState(false)
    const [state, setState ] = useState({
      lng: -120,
      lat: 47,
      zoom: 5
    });
    const [ markers, setMarkers ] = useState([[30.5, 50.5],[-120.474880, 47.525610]])
    const [ currentPointer, setCurrentPointer ] = useState({});

    const [text, setText] = useState('');
 




    useEffect(() => {


    const { lng, lat, zoom } = state;



    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom
    });

    


    map.on('load', function() {
      map.addSource('places', {
      'type': 'geojson',
      'data': {
      'type': 'FeatureCollection',
      'features': [
      {
      'type': 'Feature',
      'properties': {
      'description':
      '<strong>Make it Mount Pleasant</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
      'icon': 'theatre'
      },
      'geometry': {
      'type': 'Point',
      'coordinates': [30.5, 50.5]
      }
      }
    ]
  }
}
      )
      map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
        'icon-image': '{icon}-15',
        'icon-allow-overlap': true
        }
        });
}
    );


    // let marker = new mapboxgl.Marker()
    // .setLngLat([30.5, 50.5])
    // .addTo(map);
    // let marker1 = new mapboxgl.Marker()
    // .setLngLat([-120.474880, 47.525610])
    // .addTo(map);

    markers.map(item => {let marker = new mapboxgl.Marker()
    .setLngLat([item[0], item[1]])
    .addTo(map)}
    )



    // const addMarkerToMap = () => {
    //   let newMarker = new mapboxgl.Marker()
    //   .setLngLat(currentPointer[0],currentPointer[1])
    //   .addTo(map)
    // }

    map.on('move', () => {
      const { lng, lat } = map.getCenter();

      setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

    map.on('mousemove', function(e) {
      document.getElementById('info').innerHTML =
      // e.point is the x, y coordinates of the mousemove event relative
      // to the top-left corner of the map
      JSON.stringify(e.point) +
      '<br />' +
      // e.lngLat is the longitude, latitude geographical position of the event
      JSON.stringify(e.lngLat.wrap());
      setCurrentPointer(e.lngLat.wrap());
    });
    

    //add marker to map on click

      map.on('click', function (e) {
          console.log(e.lngLat.wrap())
          const points = e.lngLat.wrap()
          let marker = new mapboxgl.Marker()
          .setLngLat([points.lng, points.lat])
          .addTo(map);

          setState({
            lng: points.lng.toFixed(4),
            lat: points.lat.toFixed(4),
            zoom: map.getZoom().toFixed(2)
          });
        })

    map.on('mouseenter', 'places', function() {
      map.getCanvas().style.cursor = 'crosshair';
      });
       
      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'places', function() {
      map.getCanvas().style.cursor = '';
      });

      map.on('click', 'places', function(e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;
         
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
         
        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
        });

        // change pointer on control keydown
        map.getCanvas().addEventListener(
          'keydown',
          function(e) {
          e.preventDefault();
          if (e.keyCode === 65) {
            console.log(e.keyCode,'down')
            map.getCanvas().style.cursor = 'crosshair';
            setIsAdding(true) 
          }
          },
          true
          );
        map.getCanvas().addEventListener(
          'keyup',
          function(e) {
          e.preventDefault();
          if (e.keyCode === 65) {
            console.log(e.keyCode,'up')
            map.getCanvas().style.cursor = '';
            setIsAdding(false)
          }
          },
          true
          );
        
      },[])

      
    
    // sets markers to state
    const addMarker = () => {
      setMarkers([
        ...markers,
        [currentPointer.lng, currentPointer.lat]
      ])
    }


    const { lng, lat, zoom } = state;

    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
    <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
          <div id="info"></div>
        </div>
        {/* <div id='app'></div> */}
        <script src='https://api.mapbox.com/mapbox-assembly/mbx/v0.18.0/assembly.js'></script>
        <div onClick={addMarker} ref={mapRef} className="absolute top right left bottom" />
        {/* <div onClick={addMarkerToMap} ref={mapRef} className="absolute top right left bottom" /> */}
      </div>
    );

}
export default App;
