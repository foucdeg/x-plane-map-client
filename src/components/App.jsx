/* global window, Event, PLATFORM */
/* eslint no-underscore-dangle: ["error", { "allow": ["_map"] }] */

import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer/Drawer';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import LayersIcon from '@material-ui/icons/Layers';
import PlanesMap from '../containers/PlanesMap';
import PlanesPanel from '../containers/PlanesPanel';
import PlaneReplayControls from '../containers/PlaneReplayControls';
import MobileOverlay from './MobileOverlay';
import KmlLoaderOverlay from './KmlLoaderOverlay';
import '../stylesheets/map.less';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      isPanelOpen: false,
      isMobileOverlayVisible: false,
      isKmlOverlayVisible: false,
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeys);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown');
  }

  handleMapLoad = (map) => {
    if (!map) return;
    this._map = map.getWrappedInstance();
  }

  togglePanel = () => {
    this.setState(({ isPanelOpen }) => ({ isPanelOpen: !isPanelOpen }));
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }

  handleKeys = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      this.togglePanel();
    }
  }

  render() {
    return (
      <React.Fragment>
        <div id="map-canvas-wrapper" className={this.state.isPanelOpen ? 'shrinked' : ''}>
          <PlanesMap
            ref={this.handleMapLoad}
            containerElement={<div style={{ height: '100%' }} />}
            mapElement={<div style={{ height: '100%' }} />}
          />
          <PlaneReplayControls />
          <div className="buttons">
            {PLATFORM === 'electron' && (
              <Tooltip title="Open map elsewhere">
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => this.setState({ isMobileOverlayVisible: true })}
                >
                  <OpenInNewIcon />
                </Button>
              </Tooltip>
            )}
            <Tooltip title="Configure map layers">
              <Button
                size="small"
                variant="contained"
                onClick={() => this.setState({ isKmlOverlayVisible: true })}
              >
                <LayersIcon />
              </Button>
            </Tooltip>
            <Tooltip title={this.state.isPanelOpen ? 'Hide panel' : 'Show panel'}>
              <Button size="small" variant="contained" color="primary" onClick={this.togglePanel}>
                <MenuIcon />
              </Button>
            </Tooltip>
          </div>
        </div>
        <Drawer variant="persistent" anchor="right" open={this.state.isPanelOpen}>
          <PlanesPanel />
        </Drawer>
        <MobileOverlay
          visible={this.state.isMobileOverlayVisible}
          onClose={() => this.setState({ isMobileOverlayVisible: false })}
        />
        <KmlLoaderOverlay
          visible={this.state.isKmlOverlayVisible}
          onClose={() => this.setState({ isKmlOverlayVisible: false })}
        />
      </React.Fragment>
    );
  }
}
