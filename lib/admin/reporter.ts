/**
 * Helper to report events to the Vibers Central Admin.
 * Used for the Push/Webhook model.
 */
export async function reportToAdmin(type: string, data: any) {
  try {
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://vibers.co.kr';
    const apiKey = process.env.NEXT_PUBLIC_VIBERS_ADMIN_KEY || 'vibers-internal-key';

    const response = await fetch(`${adminUrl}/api/vibers/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vibers-apikey': apiKey
      },
      body: JSON.stringify({
        project: 'vibers', // Currently identifying as the 'vibers' project
        type,
        data,
        timestamp: new Date().toISOString()
      }),
      // We don't want to block the user's action if reporting fails
      keepalive: true 
    });

    if (!response.ok) {
      console.warn('Failed to report event to admin:', await response.text());
    }
  } catch (error) {
    console.error('Error reporting to admin:', error);
  }
}
