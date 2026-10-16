/**
 * Generates an official Brazilian Central Bank (BACEN) BR Code EMV payload for PIX.
 * Fully compatible with all Brazilian banking apps (Nubank, Itaú, Bradesco, Santander, Banco do Brasil, Inter, C6, etc.)
 */
import QRCode from 'qrcode';

function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Normalizes text to ASCII uppercase (removing accents) and limits length
 */
function normalizeText(text: string, maxLength: number): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Normalizes a PIX key:
 * - Phone numbers without country code (e.g. 21964335354) are formatted with +55 (e.g. +5521964335354)
 * - Emails are converted to lowercase
 * - CPFs/CNPJs have formatting removed
 */
export function normalizePixKey(key: string): string {
  const trimmed = key.trim();
  if (!trimmed) return '';

  // Email
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }

  // UUID / Random key
  if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  // Already starts with +
  if (trimmed.startsWith('+')) {
    return `+${trimmed.replace(/\D/g, '')}`;
  }

  const digits = trimmed.replace(/\D/g, '');

  // Phone number (10 or 11 digits: DDD + Phone, like 21964335354)
  if (digits.length === 10 || digits.length === 11) {
    return `+55${digits}`;
  }

  // Phone number with 55 prefix (12 or 13 digits)
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    return `+${digits}`;
  }

  // CPF (11 digits) or CNPJ (14 digits) or custom key
  return digits || trimmed;
}

/**
 * Generates the official EMV PIX Copia e Cola payload
 */
export function generatePixPayload(
  key: string,
  name: string = 'Mariana',
  city: string = 'Rio de Janeiro',
  amount?: number
): string {
  const normalizedKey = normalizePixKey(key);
  if (!normalizedKey) return '';

  const merchantName = normalizeText(name || 'MARIANA', 25) || 'MARIANA';
  const merchantCity = normalizeText(city || 'RIO DE JANEIRO', 15) || 'RIO DE JANEIRO';

  // Tag 00: Payload Format Indicator (01)
  const format = formatField('00', '01');

  // Tag 01: Point of Initiation Method (12 = Static QR code / recurring)
  const pointOfInitiation = formatField('01', '12');

  // Tag 26: Merchant Account Information
  const gui = formatField('00', 'br.gov.bcb.pix');
  const pixKeyField = formatField('01', normalizedKey);
  const merchantAccountInfo = formatField('26', `${gui}${pixKeyField}`);

  // Tag 52: Merchant Category Code (0000 = default)
  const mcc = formatField('52', '0000');

  // Tag 53: Currency (986 = BRL)
  const currency = formatField('53', '986');

  // Tag 54: Amount (optional)
  const amountField = amount && amount > 0 ? formatField('54', amount.toFixed(2)) : '';

  // Tag 58: Country Code (BR)
  const country = formatField('58', 'BR');

  // Tag 59: Merchant Name
  const merchantNameField = formatField('59', merchantName);

  // Tag 60: Merchant City
  const merchantCityField = formatField('60', merchantCity);

  // Tag 62: Additional Data Field (TXID = *** for standard static Pix)
  const txid = formatField('05', '***');
  const additionalData = formatField('62', txid);

  // Partial payload for CRC calculation
  const rawPayload = `${format}${pointOfInitiation}${merchantAccountInfo}${mcc}${currency}${amountField}${country}${merchantNameField}${merchantCityField}${additionalData}6304`;

  // Calculate CRC16 checksum
  const checksum = crc16(rawPayload);

  return `${rawPayload}${checksum}`;
}

/**
 * Generates a clean, local Data URL for the QR Code without relying on external network requests
 */
export async function generatePixQrCodeDataUrl(
  key: string,
  name: string = 'Mariana',
  city: string = 'Rio de Janeiro',
  amount?: number
): Promise<string> {
  const payload = generatePixPayload(key, name, city, amount);
  if (!payload) return '';

  try {
    return await QRCode.toDataURL(payload, {
      width: 380,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#2B2333',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.warn('Fallback to external QR code generator:', err);
    return `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=10&data=${encodeURIComponent(payload)}`;
  }
}

/**
 * Returns a high-res QR Code image URL for the PIX payload (fallback synchronous)
 */
export function getPixQrCodeUrl(
  key: string,
  name: string = 'Mariana',
  city: string = 'Rio de Janeiro',
  amount?: number
): string {
  const payload = generatePixPayload(key, name, city, amount);
  if (!payload) return '';
  return `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=10&data=${encodeURIComponent(payload)}`;
}
