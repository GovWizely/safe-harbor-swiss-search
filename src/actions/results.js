import fetch from 'isomorphic-fetch';
import { stringify } from 'querystring';
import { REQUEST_RESULTS, RECEIVE_RESULTS, RECEIVE_FAILURE } from 'constants';
import config from '../config.js';

export function requestResults() {
  return {
    type: REQUEST_RESULTS,
  };
}

export function receiveResults(payload) {
  return {
    type: RECEIVE_RESULTS,
    payload,
  };
}

export function receiveFailure(error) {
  return {
    type: RECEIVE_FAILURE,
    error,
  };
}

const { host, access_token } = config.api.safe_harbor;
function fetchResults(querystring) {
  return (dispatch) => {
    dispatch(requestResults());
    return fetch(`${host}?${querystring}`, {
      headers: { 'Authorization': 'Bearer ' + access_token }
    })
      .then(response => response.json())
      .then(json => dispatch(receiveResults(json)));
  };
}

function shouldFetchResults(state) {
  const { results } = state;
  if (!results) {
    return true;
  } else if (results.isFetching) {
    return false;
  }
  return true;
}

function processParams(params) {
  return stringify(params);
}

export function fetchResultsIfNeeded(params) {
  return (dispatch, getState) => {
    if (shouldFetchResults(getState())) {
      return dispatch(fetchResults(processParams(params)));
    }
    return Promise.resolve([]);
  };
}
