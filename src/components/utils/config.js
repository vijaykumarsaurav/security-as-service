export const BASE_URL =  'https://localhost:8443'; // 'https://9.212.148.153:8443'; 
let selectedOrg =  localStorage.getItem('selectedOrg');
export const GET_DEVIATIONS = BASE_URL + `/api/deviations/${selectedOrg}/policy/`;

export const GET_HC_CYCLES = BASE_URL + `/api/{OrgName}/health-check-cycles`;
export const GET_CALIBRATIONS = BASE_URL + `/api/${selectedOrg}/calibrations`;
export const GET_SUPPRESSIONS = BASE_URL + `/api/${selectedOrg}/suppressions`;
export const GET_FALSE_POSITIVE = BASE_URL + `/api/${selectedOrg}/false-positives`;

export const GET_SCANNED_DATES = BASE_URL + `/api/{OrgName}/scans?hc_cycle=none`;
export const GET_CYCLE_DETAILS = BASE_URL + `/api/deviations/${selectedOrg}/hcc/`;
export const GET_CYCLE_HOSTNAMES = BASE_URL + `/api/{OrgName}/health-check-cycle/`;

export const GET_SCANNED_HOSTNAMES = BASE_URL + `/api/{OrgName}/scan/`;
export const GET_UNSCANNED = BASE_URL + `/api/deviations/${selectedOrg}/scan/`;

export const CREATE_HC_CYCLE = BASE_URL + `/api/${selectedOrg}/health-check-cycle/create`;
export const GET_POLICIES = BASE_URL + `/api/deviations/${selectedOrg}/policies`;

export const CHANGE_REQUEST  = BASE_URL + `/api/${selectedOrg}/changeTicket/`;
export const GET_CHANGE_REQUEST  = BASE_URL + `/api/${selectedOrg}/changeTickets`;

export const WHO_AM_I = BASE_URL + '/whoami';
export const LOGOUT_API = BASE_URL + '/logout';

export const GET_ORG_LIST = BASE_URL + '/orgs';
export const GET_POLICY_LIST = BASE_URL + `/api/deviations/{OrgName}/policies`;
export const GET_POLICY_SCANS_DATA = BASE_URL + `/api/deviations/${selectedOrg}/policy/`;

export const GET_REPORT_SUPPRESSTION_DETAILS = BASE_URL + `/api/${selectedOrg}/suppression/`;
export const GET_COMBIND_POLICY_DATA = BASE_URL + `/api/deviations/{OrgName}`;

export const DELETE_CALIBRATION  = BASE_URL + `/api/${selectedOrg}/calibration/`;
export const DELETE_SUPPRESSION  = BASE_URL + `/api/${selectedOrg}/suppression/`;

export const UPDATE_CALIBRATION  = BASE_URL + `/api/${selectedOrg}/calibration/`;
export const UPDATE_SUPPRESSION  = BASE_URL + `/api/${selectedOrg}/suppression/`;

export const CREATE_CALIBRATION  = BASE_URL + `/api/${selectedOrg}/calibration`;
export const CREATE_SUPPRESSION  = BASE_URL + `/api/${selectedOrg}/suppression`;



