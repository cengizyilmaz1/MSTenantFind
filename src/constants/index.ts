// Re-export site configuration
export { siteConfig } from '../config/site';

// Domain validation
export const DOMAIN_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
export const MAX_DOMAIN_LENGTH = 253;