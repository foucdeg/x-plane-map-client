import { connect } from 'react-redux';
import { setActivePlane, renamePlane, toggleTrace, clearTrace, enterReplayMode, changeIcon } from '../actions';
import Panel from '../components/Panel';

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  onPlaneSelect: plane => dispatch(setActivePlane(plane)),
  onPlaneRename: (plane, newName) => dispatch(renamePlane(plane, newName)),
  onPlaneTraceToggle: plane => dispatch(toggleTrace(plane)),
  onPlaneTraceClear: plane => dispatch(clearTrace(plane)),
  onPlaneReplayMode: plane => dispatch(enterReplayMode(plane)),
  onPlaneIconChange: plane => dispatch(changeIcon(plane)),
});

const PlanesPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Panel);

export default PlanesPanel;
