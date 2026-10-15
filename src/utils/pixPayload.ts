/**
 * Generates an official Brazilian Central Bank (BACEN) BR Code EMV payload for PIX.
 * Compatible with all Brazilian banking apps (Nubank, Itaú, Bradesco, Santander, Banco do Brasil, Inter, etc.)
 */

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
 * Normalizes text to ASCII (removing accents) and limits length
 */
function normalizeText(text: string, maxLength: number): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Generates the EMV PIX Copia e Cola payload
 */
export function generatePixPayload(
  key: string,
  name: string = 'Mariana',
  city: string = 'Rio de Janeiro',
  amount?: number
): string {
  const cleanKey = key.trim();
  if (!cleanKey) return '';

  const merchantName = normalizeText(name || 'Mariana', 25) || 'Mariana';
  const merchantCity = normalizeText(city || 'Rio de Janeiro', 15) || 'Rio de Janeiro';

  // Tag 00: Format Indicator (01)
  const format = formatField('00', '01');

  // Tag 26: Merchant Account Information
  const gui = formatField('00', 'br.gov.bcb.pix');
  const pixKeyField = formatField('01', cleanKey);
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

  // Tag 62: Additional Data Field (TXID = ***)
  const txid = formatField('05', '***');
  const additionalData = formatField('62', txid);

  // Partial payload for CRC calculation
  const rawPayload = `${format}${merchantAccountInfo}${mcc}${currency}${amountField}${country}${merchantNameField}${merchantCityField}${additionalData}6304`;

  // Calculate CRC16 checksum
  const checksum = crc16(rawPayload);

  return `${rawPayload}${checksum}`;
}

/**
 * Returns a high-res QR Code image URL for the PIX payload
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
