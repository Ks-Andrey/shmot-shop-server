import crypto from 'crypto';

export const verifyChecksum = (
    secretKey: string,
    params: Record<string, string>,
): boolean => {
    try {
        const { checksum, sign_alias, ...filteredParams } = params;

        const sortedParams = Object.entries(filteredParams).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

        const dataString = sortedParams.map(([key, value]) => `${key};${value};`).join('');

        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(dataString);
        const calculatedChecksum = hmac.digest('hex').toUpperCase();

        return calculatedChecksum === checksum;
    } catch (error) {
        return false;
    }
};