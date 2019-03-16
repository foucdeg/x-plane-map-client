/* eslint react/jsx-one-expression-per-line: 0, react/jsx-no-bind: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';

import PlaneRow from './PlaneRow';

const Panel = ({
  planes, followedPlane, onPlaneIconChange, onPlaneReplayMode, onPlaneTraceClear,
  onPlaneTraceToggle, onPlaneRename, onPlaneSelect,
}) => (
  <div id="panel">
    <List dense subheader={<ListSubheader>Active Aircraft</ListSubheader>}>
      {planes.map(plane => (
        <PlaneRow
          plane={plane}
          key={plane.ip}
          isFollowed={plane.ip === followedPlane}
          onPlaneSelect={onPlaneSelect}
          onPlaneTraceToggle={onPlaneTraceToggle.bind(this, plane)}
          onPlaneTraceClear={onPlaneTraceClear.bind(this, plane)}
          onPlaneIconChange={onPlaneIconChange.bind(this, plane)}
          onPlaneReplayMode={onPlaneReplayMode.bind(this, plane)}
          onPlaneRename={onPlaneRename.bind(this, plane)}
        />
      ))}
      {planes.length === 0 && (
        <ListItem>No planes yet</ListItem>
      )}
    </List>
  </div>
);

Panel.propTypes = {
  followedPlane: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  planes: PropTypes.arrayOf(PropTypes.any).isRequired,
  onPlaneSelect: PropTypes.func.isRequired,
  onPlaneTraceClear: PropTypes.func.isRequired,
  onPlaneTraceToggle: PropTypes.func.isRequired,
  onPlaneIconChange: PropTypes.func.isRequired,
  onPlaneReplayMode: PropTypes.func.isRequired,
  onPlaneRename: PropTypes.func.isRequired,
};

Panel.defaultProps = {
  followedPlane: null,
};

export default Panel;
