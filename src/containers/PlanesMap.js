import { connect } from 'react-redux';
import { setActivePlane, fetchPlanes } from '../actions';
import Map from '../components/Map';

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  onPlaneLeave: () => dispatch(setActivePlane(false)),
  fetchPlanes: () => dispatch(fetchPlanes()),
});

const PlanesMap = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true },
)(Map);

export default PlanesMap;
