/* eslint no-underscore-dangle: ["error", { "allow": ["_zoom"] }] */

import React, { Component } from 'react';
import { Map as LeafletMap, LayersControl, TileLayer, Marker } from 'react-leaflet';
import PropTypes from 'prop-types';

import { POLYLINE_OPTIONS, BUILT_ICONS, REFRESH_FRAME_RATE } from '../constants';
import GoogleMapLayer from './GoogleMapLayer';
import GoogleSatelliteLayer from './GoogleSatelliteLayer';
import GoogleTerrainLayer from './GoogleTerrainLayer';

const RotatingMarker = React.lazy(() => import('./RotatingMarker'));
const PlanePopup = React.lazy(() => import('./PlanePopup'));
const Trace = React.lazy(() => import('./Trace'));

const navTiles = 'https://{s}.gis.flightplandatabase.com/tile/nav/{z}/{x}/{y}.png';
const osmTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const navLayerAttribution = '<a href="https://flightplandatabase.com" target="_blank">Flight Plan Database</a>';

class Map extends Component {
  constructor() {
    super();
    this.state = {
      currentPosition: [0, 0],
      zoom: 8,
    };

    this.replayRefreshInterval = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.replayingPlane && !this.props.replayingPlane) {
      this.replayRefreshInterval = setInterval(
        this.props.refreshReplay.bind(this),
        REFRESH_FRAME_RATE,
      );
    }
    if (!nextProps.replayingPlane && this.props.replayingPlane) {
      clearInterval(this.replayRefreshInterval);
    }

    if (!nextProps.followedPlane || nextProps.replayingPlane) return;
    const plane = nextProps.planes.find(aPlane => aPlane.ip === nextProps.followedPlane);
    if (!plane) return;
    this.setState({
      currentPosition: plane.position,
    });
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.replayingPlane) return true;
    if (!this.props.replayingPlane) return true;

    if (nextProps.replayingPlane.currentTimestamp !== this.props.replayingPlane.currentTimestamp) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    clearInterval(this.replayRefreshInterval);
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
        </LayersControl>
        { !this.props.replayingPlane && this.props.planes.map(plane => (
          <React.Suspense key={plane.ip} fallback={<Marker position={plane.position} />}>
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
          </React.Suspense>
        ))}
        { this.props.replayingPlane && (
          <React.Suspense fallback={<Marker position={this.props.replayingPlane.position} />}>
            <RotatingMarker
              position={this.props.replayingPlane.position}
              icon={BUILT_ICONS[this.props.replayingPlane.icon]}
              rotationAngle={this.props.replayingPlane.heading}
              rotationOrigin="initial"
            >
              <PlanePopup plane={this.props.replayingPlane} />
            </RotatingMarker>
            <Trace
              {...POLYLINE_OPTIONS}
              positions={this.props.replayingPlane.visiblePath}
            />
          </React.Suspense>
        )}
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
  replayControls: PropTypes.shape({
    minTimestamp: PropTypes.number,
    maxTimestamp: PropTypes.number,
    speed: PropTypes.number,
  }),
  onPlaneLeave: PropTypes.func.isRequired,
  onReplayEnded: PropTypes.func.isRequired,
  refreshReplay: PropTypes.func.isRequired,
  replayingPlane: planeType,
};

Map.defaultProps = {
  followedPlane: null,
  replayingPlane: null,
  replayControls: null,
};

export default Map;
