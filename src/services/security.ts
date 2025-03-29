import type { APIRoute } from 'astro';

interface SecurityCheck {
    ip: string;
    timestamp: number;
    requestCount: number;
    failedAttempts: number;
    userAgent: string;
    path: string;
}

// In-memory storage for security checks (in production, use a database)
const securityLogs: Map<string, SecurityCheck> = new Map();

// Rate limiting configuration
const RATE_LIMIT = {
    requestsPerMinute: 60,
    failedAttemptsThreshold: 5,
    suspiciousPatterns: [
        /bot/i,
        /crawler/i,
        /spider/i,
        /scraper/i
    ]
};

export async function checkSecurity({ request, clientAddress }: { request: Request, clientAddress: string }) {
    const now = Date.now();
    const userAgent = request.headers.get('user-agent') || '';
    const path = new URL(request.url).pathname;

    // Get or create security check for this IP
    let securityCheck = securityLogs.get(clientAddress) || {
        ip: clientAddress,
        timestamp: now,
        requestCount: 0,
        failedAttempts: 0,
        userAgent,
        path
    };

    // Update request count
    securityCheck.requestCount++;

    // Check for rate limiting
    if (securityCheck.requestCount > RATE_LIMIT.requestsPerMinute) {
        return {
            blocked: true,
            reason: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests from this IP address'
        };
    }

    // Check for suspicious user agent
    if (RATE_LIMIT.suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
        return {
            blocked: true,
            reason: 'SUSPICIOUS_USER_AGENT',
            message: 'Suspicious user agent detected'
        };
    }

    // Check for failed authentication attempts
    if (securityCheck.failedAttempts >= RATE_LIMIT.failedAttemptsThreshold) {
        return {
            blocked: true,
            reason: 'BRUTE_FORCE_ATTEMPT',
            message: 'Multiple failed authentication attempts detected'
        };
    }

    // Check for rapid requests (potential DDoS)
    const timeDiff = now - securityCheck.timestamp;
    if (timeDiff < 1000 && securityCheck.requestCount > 10) {
        return {
            blocked: true,
            reason: 'DDOS_ATTEMPT',
            message: 'Multiple rapid requests detected'
        };
    }

    // Update security log
    securityLogs.set(clientAddress, securityCheck);

    // Clean up old logs (older than 1 hour)
    for (const [ip, check] of securityLogs.entries()) {
        if (now - check.timestamp > 3600000) {
            securityLogs.delete(ip);
        }
    }

    return {
        blocked: false,
        reason: 'ALLOWED',
        message: 'Request allowed'
    };
}

// API endpoint for security checks
export const POST: APIRoute = async ({ request, clientAddress }) => {
    try {
        const securityCheck = await checkSecurity({ request, clientAddress });
        return new Response(JSON.stringify(securityCheck), {
            status: securityCheck.blocked ? 403 : 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}; 