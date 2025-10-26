export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  ACCESS_DENIED: 'Access denied',
  INVALID_TOKEN: 'Invalid token',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions to perform this action',
  REGISTRATION_DISABLED: 'Registration is disabled. Please contact an administrator',
  USERNAME_EXISTS: 'Username already exists',
  AIRDROP_NOT_FOUND: 'Airdrop not found',
  SERVER_ERROR: 'Server error',
  FAILED_TO_FETCH_AIRDROPS: 'Failed to fetch airdrops',
  FAILED_TO_CREATE_AIRDROP: 'Failed to create airdrop',
  FAILED_TO_UPDATE_AIRDROP: 'Failed to update airdrop',
  FAILED_TO_DELETE_AIRDROP: 'Failed to delete airdrop',
  FAILED_TO_FETCH_STATS: 'Failed to fetch stats',
  JWT_SECRET_MISSING: 'JWT_SECRET environment variable is not set'
};

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register'
  },
  AIRDROPS: {
    BASE: '/api/airdrops',
    BY_ID: '/api/airdrops/:id'
  },
  STATS: '/api/stats'
};
