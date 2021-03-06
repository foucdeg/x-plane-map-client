/* globals fetch, PLATFORM */
import { ICONS } from './constants';
import { decodeConfig } from './helpers';

export const SET_ACTIVE_PLANE = 'SET_ACTIVE_PLANE';
export const RENAME_PLANE = 'RENAME_PLANE';
export const REMOVE_PLANE = 'REMOVE_PLANE';
export const TOGGLE_TRACE = 'TOGGLE_TRACE';
export const CLEAR_TRACE = 'CLEAR_TRACE';
export const CHANGE_ICON = 'CHANGE_ICON';
export const REQUEST_PLANES = 'REQUEST_PLANES';
export const RECEIVE_PLANES = 'RECEIVE_PLANES';
export const REJECT_PLANES = 'REJECT_PLANES';
export const ADD_LAYER = 'ADD_LAYER';
export const REMOVE_LAYER = 'REMOVE_LAYER';

const endpoint = PLATFORM === 'electron' ? decodeConfig().mapServerURL : '';

export function setActivePlane(plane) {
  return { type: SET_ACTIVE_PLANE, key: plane ? plane.ip : plane };
}

export function renamePlane(plane, name) {
  fetch(`${endpoint}/api/rename`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ip: plane.ip,
      name,
    }),
  });
  return { type: RENAME_PLANE, key: plane.ip, name };
}

export function removePlane(plane) {
  return { type: REMOVE_PLANE, key: plane.ip };
}

export function toggleTrace(plane) {
  return { type: TOGGLE_TRACE, key: plane.ip };
}

export function clearTrace(plane) {
  return { type: CLEAR_TRACE, key: plane.ip };
}

function nextIcon(currentIcon) {
  const allIcons = Object.keys(ICONS);
  const currentIndex = allIcons.indexOf(currentIcon);
  return allIcons[(currentIndex + 1) % allIcons.length];
}

export function changeIcon(plane) {
  const icon = nextIcon(plane.icon);
  fetch(`${endpoint}/api/change-icon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ip: plane.ip,
      icon,
    }),
  });
  return { type: CHANGE_ICON, key: plane.ip, icon };
}

function receivePlanes(planes) {
  return { type: RECEIVE_PLANES, planes };
}

function rejectPlanes(error) {
  return { type: REJECT_PLANES, error };
}

export function fetchPlanes() {
  return function fetchPlanesThunk(dispatch) {
    fetch(`${endpoint}/api/data`)
      .then(response => response.json())
      .then(data => dispatch(receivePlanes(data)))
      .catch(error => dispatch(rejectPlanes(error)));
  };
}

export function addLayer(name, geoJson) {
  return { type: ADD_LAYER, payload: { name, geoJson } };
}

export function removeLayer(idToRemove) {
  return { type: REMOVE_LAYER, payload: { idToRemove } };
}
