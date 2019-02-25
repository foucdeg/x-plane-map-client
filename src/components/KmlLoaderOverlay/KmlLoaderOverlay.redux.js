import { connect } from 'react-redux';
import { addLayer, removeLayer } from '../../actions';
import KmlLoaderOverlay from './KmlLoaderOverlay.view';

const mapStateToProps = state => ({
  layers: state.layers,
});

const mapDispatchToProps = dispatch => ({
  addLayer: (name, geoJson) => dispatch(addLayer(name, geoJson)),
  removeLayer: idToRemove => dispatch(removeLayer(idToRemove)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(KmlLoaderOverlay);
