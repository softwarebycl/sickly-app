import React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { 
  Banner
} from 'grey-vest'
import { Map, TileLayer } from 'react-leaflet'
import s from '../../assets/css/page.css'

let state = observable({
  loading: false,
  sent: false,
  numSent: 0,
  lat: 32.9483,
  lng: -96.7299,
  zoom: 5,
})

const StatusBanner = observer(() => state.sent ? (
  <Banner className={s.banner}>
    You have successfuly submitted {state.numSent} cases.
  </Banner>
) : null )

const position = [state.lat, state.lng]

const Submit = observer(() => 
  <>
    <StatusBanner /> 
        <Map center={position} zoom={state.zoom} zoomControl={false} className={s.leafletContainer}>
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          />
        </Map>
  </>
)

export default () => <Submit />