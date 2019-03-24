/* eslint no-underscore-dangle: ["error", { "allow": ["_zoom"] }] */

import React, { Component } from 'react';
import { Map as LeafletMap, LayersControl, TileLayer, GeoJSON } from 'react-leaflet';
import PropTypes from 'prop-types';

import { POLYLINE_OPTIONS, BUILT_ICONS, PERIOD } from '../constants';
import { getPlanesBounds, decodeConfig } from '../helpers';
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

const { initialPositionIfMultiplePlanes = 'bounds' } = decodeConfig();


class Map extends Component {
  hasReceivedFirstPlane = false

  map = null

  constructor() {
    super();
    this.state = {
      zoom: 8,
    };
  }


  componentDidMount() {
    this.planeFetchInterval = setInterval(() => {
      this.props.fetchPlanes();
    }, PERIOD);
  }

  componentWillUnmount() {
    clearInterval(this.planeFetchInterval);
  }

  getMapCenter() {
    return this.map && this.map.leafletElement.getCenter();
  }

  handleZoom = (e) => {
    this.setState({
      zoom: e.target._zoom,
    });
  }

  handleDragstart = () => {
    this.props.onPlaneLeave();
  }

  deducePositionalProps = () => {
    if (this.props.followedPlane) {
      const plane = this.props.planes.find(aPlane => aPlane.ip === this.props.followedPlane);
      if (plane) {
        return {
          zoom: this.state.zoom,
          center: plane.position,
        };
      }
    }
    if (!this.hasReceivedFirstPlane && this.props.planes.length) {
      this.hasReceivedFirstPlane = true;
      if (this.props.planes.length > 1 && initialPositionIfMultiplePlanes !== 'first') {
        const bounds = getPlanesBounds(this.props.planes);
        return { bounds };
      }
      return { zoom: this.state.zoom, center: this.props.planes[0].position };
    }

    return { zoom: this.state.zoom, center: this.getMapCenter() };
  }

  render() {
    const positionalProps = this.deducePositionalProps();
    return (
      <LeafletMap
        ref={(ref) => { this.map = ref; }}
        {...positionalProps}
        onDragstart={this.handleDragstart}
        onDragend={this.handleDragend}
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
