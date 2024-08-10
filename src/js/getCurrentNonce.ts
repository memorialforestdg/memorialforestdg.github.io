// getCurrentNonce.js
import crypto from 'crypto';

const nonce = crypto.randomBytes(16).toString('hex');

export const getCurrentNonce = () => nonce;
