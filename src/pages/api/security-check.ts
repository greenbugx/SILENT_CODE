import type { APIRoute } from 'astro';
import { checkSecurity } from '../../services/security';

// Mark this endpoint as server-rendered
export const prerender = false;

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