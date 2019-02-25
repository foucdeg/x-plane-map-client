/* globals FileReader, DOMParser */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import toGeoJson from '@mapbox/togeojson';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import LayersIcon from '@material-ui/icons/Layers';

import useKeyboardEvent from '../../hooks/useKeyboardEvent';


const KmlLoaderOverlay = ({ visible, onClose, layers, addLayer, removeLayer }) => {
  useKeyboardEvent('Escape', onClose);

  const [newLayerName, setNewLayerName] = useState('');
  const [geoJson, setGeoJson] = useState(null);

  const handleLayerNameChange = event => setNewLayerName(event.target.value);
  const handleFileChange = (event) => {
    const firstFile = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = function onFileLoad() {
      const xmlDom = (new DOMParser()).parseFromString(reader.result, 'text/xml');
      setGeoJson(toGeoJson.kml(xmlDom));
      setNewLayerName(firstFile.name.replace('.kml', ''));
    };
    reader.readAsText(firstFile);
  };

  return (
    <Dialog
      maxWidth="xs"
      open={visible}
      onClose={onClose}
    >
      <DialogTitle>Custom Map Layers</DialogTitle>
      <DialogContent>
        <List dense>
          {!layers.length && ('No layers yet.')}
          {layers.map(layer => (
            <ListItem key={layer.id}>
              <ListItemIcon>
                <LayersIcon />
              </ListItemIcon>
              <ListItemText primary={layer.name} />
              <ListItemSecondaryAction>
                <IconButton aria-label="Delete" onClick={() => removeLayer(layer.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Divider />
        <DialogContentText style={{ margin: '8px 0px' }}>
          Add a new custom map layer by uploading a KML file (see help
          {' '}
          <a target="_blank" rel="noopener noreferrer" href="https://mymaps.google.com">here</a>
          ):
        </DialogContentText>
        {!geoJson && (
          <Button variant="contained" component="label">
            <AddIcon />
            Add Layer
            <input
              type="file"
              accept="application/vnd.google-earth.kml+xml"
              style={{ display: 'none' }}
              onChange={event => handleFileChange(event, newLayerName)}
            />
          </Button>
        )}
        {geoJson && (
          <form
            className="layer-form"
            onSubmit={(event) => {
              event.preventDefault();
              addLayer(newLayerName, geoJson);
            }}
          >
            <TextField
              label="New layer name"
              className="layer-name-input"
              value={newLayerName}
              onChange={handleLayerNameChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NoteAddIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button className="layer-name-submit" variant="contained" color="primary" type="submit">Save</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

KmlLoaderOverlay.propTypes = {
  layers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  addLayer: PropTypes.func.isRequired,
  removeLayer: PropTypes.func.isRequired,
};

export default KmlLoaderOverlay;
