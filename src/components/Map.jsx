/* eslint no-underscore-dangle: ["error", { "allow": ["_zoom"] }] */

import React, { Component } from 'react';
import { Map as LeafletMap, LayersControl, TileLayer, GeoJSON } from 'react-leaflet';
import PropTypes from 'prop-types';

import { POLYLINE_OPTIONS, BUILT_ICONS, PERIOD } from '../constants';
import Trace from './Trace';
import RotatingMarker from './RotatingMarker';
import GoogleMapLayer from './GoogleMapLayer';
import GoogleSatelliteLayer from './GoogleSatelliteLayer';
import GoogleTerrainLayer from './GoogleTerrainLayer';
import PlanePopup from './PlanePopup';

require('leaflet.gridlayer.googlemutant');

const navTiles = 'https://{s}.gis.flightplandatabase.com/tile/nav/{z}/{x}/{y}.png';
const osmTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const otmTiles = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
const navLayerAttribution = '<a href="https://flightplandatabase.com" target="_blank">Flight Plan Database</a>';

class Map extends Component {
  constructor() {
    super();
    this.state = {
      currentPosition: [0, 0],
      zoom: 8,
    };
  }

  componentDidMount() {
    this.planeFetchInterval = setInterval(() => {
      this.props.fetchPlanes();
    }, PERIOD);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.followedPlane) return;
    const plane = nextProps.planes.find(aPlane => aPlane.ip === nextProps.followedPlane);
    if (!plane) return;
    this.setState({
      currentPosition: plane.position,
    });
  }

  componentWillUnmount() {
    clearInterval(this.planeFetchInterval);
  }

  handleZoom = (e) => {
    this.setState({
      zoom: e.target._zoom,
    });
  }

  render() {
    return (
      <LeafletMap
        center={this.state.currentPosition}
        zoom={this.state.zoom}
        onDragstart={this.props.onPlaneLeave}
        onZoomend={this.handleZoom}
      >
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer name="OpenStreetMap" checked>
            <TileLayer url={osmTiles} attribution="© OpenStreetMap contributors" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenTopoMap">
            <TileLayer url={otmTiles} attribution="© OpenStreetMap contributors, SRTM | © OpenTopoMap" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Google Maps - Roads">
            <GoogleMapLayer />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Google Maps - Satellite">
            <GoogleSatelliteLayer />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Google Maps - Terrain">
            <GoogleTerrainLayer />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay name="Airports, localizers and waypoints">
            <TileLayer url={navTiles} attribution={navLayerAttribution} />
          </LayersControl.Overlay>
          {this.props.layers.map(layer => (
            <LayersControl.Overlay name={layer.name} key={layer.id}>
              <GeoJSON data={layer.geoJson} />
            </LayersControl.Overlay>
          ))}
        </LayersControl>
        {this.props.planes.map(plane => (
          <React.Fragment key={plane.ip}>
            <RotatingMarker
              position={plane.position}
              icon={BUILT_ICONS[plane.icon]}
              rotationAngle={plane.heading}
              rotationOrigin="initial"
            >
              <PlanePopup plane={plane} />
            </RotatingMarker>
            { plane.isTraceActive && (
              <Trace
                {...POLYLINE_OPTIONS}
                positions={plane.path}
              />
            )}
          </React.Fragment>
        ))}
      </LeafletMap>
    );
  }
}

const planeType = PropTypes.shape({
  position: PropTypes.array,
  icon: PropTypes.string,
  heading: PropTypes.number,
  isTraceActive: PropTypes.bool,
  path: PropTypes.arrayOf(PropTypes.shape({})),
});

Map.propTypes = {
  followedPlane: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  planes: PropTypes.arrayOf(planeType).isRequired,
  onPlaneLeave: PropTypes.func.isRequired,
  fetchPlanes: PropTypes.func.isRequired,
};

Map.defaultProps = {
  followedPlane: null,
};

export default Map;
