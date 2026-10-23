/**
 * SauceDemo's published demo accounts (shown on the login page itself).
 * These are public, so it is safe to keep them in source control.
 * Real credentials must never be committed - use environment variables instead.
 */
const PASSWORD = 'secret_sauce';

export const users = {
    standard: { username: 'standard_user', password: PASSWORD },
    lockedOut: { username: 'locked_out_user', password: PASSWORD },
    problem: { username: 'problem_user', password: PASSWORD },
    performanceGlitch: { username: 'performance_glitch_user', password: PASSWORD },
} as const;
