export const BASE_URL =  "https://9.212.148.153:8443"; 
export const GET_DEVIATIONS = BASE_URL + '/api/deviations/zz1/policy/';

export const GET_HC_CYCLES = BASE_URL + '/api/zz1/health-check-cycles';
export const GET_SCANNED_DATES = BASE_URL + '/api/zz1/scans?hc_cycle=none';
export const GET_CYCLE_DETAILS = BASE_URL + '/api/deviations/zz1/hcc/';
export const GET_CYCLE_HOSTNAMES = BASE_URL + '/api/zz1/health-check-cycle/';

export const GET_SCANNED_HOSTNAMES = BASE_URL + '/api/zz1/scan/';
export const GET_UNSCANNED = BASE_URL + '/api/deviations/zz1/scan/';

export const CREATE_HC_CYCLE = BASE_URL + '/api/zz1/health-check-cycle/create';
export const GET_POLICIES = BASE_URL + '/api/deviations/zz1/policies';

export const CHANGE_REQUEST  = BASE_URL + '/api/zz1/changeTicket/';
export const GET_CHANGE_REQUEST  = BASE_URL + '/api/zz1/changeTickets';


