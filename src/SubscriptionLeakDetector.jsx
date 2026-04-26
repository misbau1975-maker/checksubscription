import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Upload,
  FileText,
  Shield,
  Zap,
  AlertTriangle,
  TrendingDown,
  Sparkles,
  X,
  Loader2,
  Check,
  Lock,
  Eye,
  EyeOff,
  Droplet,
  ArrowRight,
  Clipboard,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────
   THEME
   Editorial-financial: warm paper cream, deep ink, rust accent.
   Numbers presented like newspaper headlines.
   ────────────────────────────────────────────────────────────── */
const THEME = {
  paper: '#f6f1e6',
  paperDeep: '#efe8d6',
  ink: '#141322',
  inkSoft: '#3a3a52',
  inkMute: '#6b6b80',
  rule: '#d9d1bd',
  ruleSoft: '#e8e1cd',
  card: '#fffdf8',
  rust: '#c0432a',
  rustDeep: '#94321e',
  amber: '#d68a26',
  forest: '#2f5d44',
  flag: '#a55a1a',
  shadow: '0 1px 0 rgba(20,19,34,0.04), 0 8px 28px -12px rgba(20,19,34,0.18)',
};

const FONTS = {
  display: '"Fraunces", "Iowan Old Style", "Hoefler Text", Georgia, serif',
  body: '"Geist", "Söhne", -apple-system, BlinkMacSystemFont, "SF Pro Text", Segoe UI, sans-serif',
  mono: '"JetBrains Mono", "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
};

/* ──────────────────────────────────────────────────────────────
   KNOWN MERCHANT DICTIONARY (for confidence scoring)
   ────────────────────────────────────────────────────────────── */
const KNOWN_MERCHANTS = {
  NETFLIX: { name: 'Netflix', category: 'Streaming' },
  SPOTIFY: { name: 'Spotify', category: 'Music' },
  'APPLE MUSIC': { name: 'Apple Music', category: 'Music' },
  'APPLE.COM/BILL': { name: 'Apple', category: 'App Store' },
  'APPLE COM BILL': { name: 'Apple', category: 'App Store' },
  ITUNES: { name: 'Apple', category: 'App Store' },
  ICLOUD: { name: 'iCloud', category: 'Storage' },
  'AMAZON PRIME': { name: 'Amazon Prime', category: 'Membership' },
  'PRIME VIDEO': { name: 'Amazon Prime Video', category: 'Streaming' },
  'AMAZON MUSIC': { name: 'Amazon Music', category: 'Music' },
  'AMAZON KINDLE': { name: 'Kindle Unlimited', category: 'Reading' },
  'AUDIBLE': { name: 'Audible', category: 'Audio' },
  HULU: { name: 'Hulu', category: 'Streaming' },
  DISNEY: { name: 'Disney+', category: 'Streaming' },
  'DISNEY+': { name: 'Disney+', category: 'Streaming' },
  HBO: { name: 'HBO Max', category: 'Streaming' },
  MAX: { name: 'HBO Max', category: 'Streaming' },
  YOUTUBE: { name: 'YouTube Premium', category: 'Streaming' },
  PARAMOUNT: { name: 'Paramount+', category: 'Streaming' },
  PEACOCK: { name: 'Peacock', category: 'Streaming' },
  CRUNCHYROLL: { name: 'Crunchyroll', category: 'Streaming' },
  AUDIBLE: { name: 'Audible', category: 'Audiobooks' },
  KINDLE: { name: 'Kindle Unlimited', category: 'Books' },
  DROPBOX: { name: 'Dropbox', category: 'Storage' },
  GOOGLE: { name: 'Google', category: 'Cloud' },
  'GOOGLE STORAGE': { name: 'Google One', category: 'Storage' },
  'GOOGLE ONE': { name: 'Google One', category: 'Storage' },
  ADOBE: { name: 'Adobe', category: 'Software' },
  CANVA: { name: 'Canva', category: 'Software' },
  NOTION: { name: 'Notion', category: 'Software' },
  FIGMA: { name: 'Figma', category: 'Software' },
  GITHUB: { name: 'GitHub', category: 'Software' },
  CHATGPT: { name: 'ChatGPT', category: 'AI' },
  OPENAI: { name: 'ChatGPT', category: 'AI' },
  CLAUDE: { name: 'Claude', category: 'AI' },
  ANTHROPIC: { name: 'Claude', category: 'AI' },
  MIDJOURNEY: { name: 'Midjourney', category: 'AI' },
  PERPLEXITY: { name: 'Perplexity', category: 'AI' },
  COPILOT: { name: 'GitHub Copilot', category: 'AI' },
  PLAYSTATION: { name: 'PlayStation Plus', category: 'Gaming' },
  'PLAYSTATION NETWORK': { name: 'PlayStation Plus', category: 'Gaming' },
  'XBOX': { name: 'Xbox Live / Game Pass', category: 'Gaming' },
  'NINTENDO ONLINE': { name: 'Nintendo Online', category: 'Gaming' },
  STEAM: { name: 'Steam', category: 'Gaming' },
  LINKEDIN: { name: 'LinkedIn Premium', category: 'Software' },
  ZOOM: { name: 'Zoom', category: 'Software' },
  MICROSOFT: { name: 'Microsoft 365', category: 'Software' },
  'OFFICE 365': { name: 'Microsoft 365', category: 'Software' },
  PELOTON: { name: 'Peloton', category: 'Fitness' },
  STRAVA: { name: 'Strava', category: 'Fitness' },
  CALM: { name: 'Calm', category: 'Wellness' },
  HEADSPACE: { name: 'Headspace', category: 'Wellness' },
  DUOLINGO: { name: 'Duolingo', category: 'Education' },
  NYT: { name: 'NY Times', category: 'News' },
  'NEW YORK TIMES': { name: 'NY Times', category: 'News' },
  WSJ: { name: 'WSJ', category: 'News' },
  ECONOMIST: { name: 'The Economist', category: 'News' },
  PATREON: { name: 'Patreon', category: 'Membership' },
  SUBSTACK: { name: 'Substack', category: 'News' },
  TINDER: { name: 'Tinder', category: 'Dating' },
  HINGE: { name: 'Hinge', category: 'Dating' },
  BUMBLE: { name: 'Bumble', category: 'Dating' },
  'PLANET FITNESS': { name: 'Planet Fitness', category: 'Fitness' },
  EQUINOX: { name: 'Equinox', category: 'Fitness' },
  'FITNESS FIRST': { name: 'Fitness First', category: 'Fitness' },
  'ANYTIME FITNESS': { name: 'Anytime Fitness', category: 'Fitness' },
  'PURE GYM': { name: 'PureGym', category: 'Fitness' },
  PUREGYM: { name: 'PureGym', category: 'Fitness' },
  'GOLDS GYM': { name: "Gold's Gym", category: 'Fitness' },
  'CRUNCH FITNESS': { name: 'Crunch Fitness', category: 'Fitness' },
  'F45': { name: 'F45 Training', category: 'Fitness' },
  CLASSPASS: { name: 'ClassPass', category: 'Fitness' },
  MYPROTEIN: { name: 'MyProtein', category: 'Fitness' },
  '1PASSWORD': { name: '1Password', category: 'Software' },
  LASTPASS: { name: 'LastPass', category: 'Software' },
  NORDVPN: { name: 'NordVPN', category: 'Software' },
  EXPRESSVPN: { name: 'ExpressVPN', category: 'Software' },
  GRAMMARLY: { name: 'Grammarly', category: 'Software' },
  EVERNOTE: { name: 'Evernote', category: 'Software' },
  SLACK: { name: 'Slack', category: 'Software' },
  ASANA: { name: 'Asana', category: 'Software' },
  TRELLO: { name: 'Trello', category: 'Software' },
  MAILCHIMP: { name: 'Mailchimp', category: 'Software' },
  SHOPIFY: { name: 'Shopify', category: 'Software' },
  SQUARESPACE: { name: 'Squarespace', category: 'Software' },
  WORDPRESS: { name: 'WordPress', category: 'Software' },
  'GOOGLE WORKSPACE': { name: 'Google Workspace', category: 'Software' },
};

const KNOWN_KEYS = Object.keys(KNOWN_MERCHANTS).sort((a, b) => b.length - a.length);

/* Words that mean "money coming IN" — never a subscription */
const INCOME_KEYWORDS = [
  'SALARY', 'WAGE', 'WAGES', 'PAYROLL', 'PAYCHECK', 'PAYCHEQUE',
  'REFUND', 'REVERSAL', 'CASHBACK', 'CASH BACK', 'REWARD', 'REWARDS',
  'INTEREST EARNED', 'DIVIDEND', 'BONUS',
  'TRANSFER IN', 'INCOMING TRANSFER', 'CREDIT TRANSFER', 'INCOMING',
  'DEPOSIT', 'CASH DEPOSIT', 'CHECK DEPOSIT', 'CHEQUE DEPOSIT',
  'OPENING BALANCE', 'CLOSING BALANCE',
  'SALARY CREDIT', 'PAYMENT RECEIVED',
];

/* Keywords that strongly suggest a recurring charge even with 1 occurrence */
const SUBSCRIPTION_KEYWORDS = [
  'SUBSCRIPTION', 'MEMBERSHIP', 'MONTHLY PLAN', 'ANNUAL PLAN',
  'GYM', 'FITNESS', 'YOGA STUDIO',
  'STREAMING', 'PREMIUM', 'PRO PLAN',
  'INSURANCE PREMIUM', 'POLICY',
  'TUITION', 'COURSE FEE',
  'HOSTING', 'DOMAIN',
];

/* Categories that look like transactions but aren't subscriptions —
   transport, food delivery, fuel, groceries, pharmacies, parking, airlines.
   We use this to suppress false positives when the algorithm sees 3+ similar
   charges from a transport/food/etc. merchant in the same week. Only applied
   to UNKNOWN merchants — known SaaS/streaming/etc. brands always surface. */
const NON_SUBSCRIPTION_KEYWORDS = [
  'RIDE', 'TAXI', 'CAB', 'UBER', 'LYFT', 'OLA', 'CAREEM HALA', 'CAREEM RIDE',
  'CAREEM FOOD', 'DELIVERY', 'DELIVEROO', 'TALABAT', 'GRUBHUB', 'DOORDASH',
  'GRUBHUB', 'INSTASHOP', 'ZOMATO',
  'GAS', 'PETROL', 'FUEL', 'ENOC', 'ADNOC', 'SHELL', 'EPPCO',
  'SUPERMARKET', 'MARKET', 'GROCERY', 'CARREFOUR', 'LULU', 'SPINNEYS',
  // E-commerce — Amazon.ae, AMZNMktplace, eBay etc. are shopping not subs.
  // We still flag actual Prime/Kindle/Audible via the matchKnown dict.
  'AMAZON.AE', 'AMAZON.COM', 'AMZNMKTPLACE', 'AMZN MKTP', 'AMZN MKT', 'EBAY',
  'NOON.COM', 'NOON FOOD',
  'KFC', 'MCDONALDS', 'STARBUCKS', 'NANDOS', 'KRISPY KREME', 'CHILL ICE',
  'BUTCHERY', 'CATERING', 'PHARMACY', 'CLINIC', 'HOSPITAL', 'MEDICLINIC',
  'PARKING', 'MAWGIF', 'PARKONIC',
  'AIRPORT', 'AIRWAYS', 'AIRLINE', 'KLM', 'EMIRATES AIR',
  'GOLF', 'BUTCHERY',
];

function looksLikeNonSubscription(text) {
  const u = text.toUpperCase();
  return NON_SUBSCRIPTION_KEYWORDS.some((kw) => u.includes(kw));
}

/* ──────────────────────────────────────────────────────────────
   PARSING
   Pulls dates, amounts and merchant names from messy lines.
   Tries to be tolerant of pasted statement formats.
   ────────────────────────────────────────────────────────────── */
const MONTHS = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

/* Pre-pass over the whole document to decide DD/MM vs MM/DD.
   Looks at every numeric date and asks: does any first number exceed 12?
   That's a smoking gun for DD/MM. Inverse for MM/DD.
   When ambiguous (all numbers ≤ 12), default to DD/MM since most non-US
   bank statements use it and our detector doesn't care which a priori. */
function detectDateFormat(text) {
  const candidates = [];
  const re = /\b(\d{1,2})[\/.](\d{1,2})[\/.](\d{2,4})\b/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    candidates.push([+m[1], +m[2]]);
  }
  if (candidates.length === 0) return 'DD/MM';
  const firstOver12 = candidates.some(([a]) => a > 12);
  const secondOver12 = candidates.some(([, b]) => b > 12);
  if (firstOver12 && !secondOver12) return 'DD/MM';
  if (secondOver12 && !firstOver12) return 'MM/DD';
  return 'DD/MM';
}

function parseDate(str, dateFormat = 'DD/MM') {
  if (!str) return null;
  const s = str.trim();
  // ISO YYYY-MM-DD (unambiguous)
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  // Numeric date — apply detected document format
  m = s.match(/^(\d{1,2})[\/.](\d{1,2})[\/.](\d{2,4})$/);
  if (m) {
    let a = +m[1], b = +m[2], y = +m[3];
    if (y < 100) y += 2000;
    let day, month;
    if (dateFormat === 'MM/DD') {
      month = a; day = b;
    } else {
      day = a; month = b;
    }
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return new Date(y, month - 1, day);
  }
  // DD Mon or DD Mon YYYY
  m = s.match(/^(\d{1,2})[\s\-]([A-Za-z]{3,9})\.?(?:[\s\-,]+(\d{2,4}))?$/);
  if (m) {
    const month = MONTHS[m[2].toLowerCase()];
    if (month === undefined) return null;
    let y = m[3] ? +m[3] : new Date().getFullYear();
    if (y < 100) y += 2000;
    return new Date(y, month, +m[1]);
  }
  // Mon DD or Mon DD, YYYY
  m = s.match(/^([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:,?\s+(\d{2,4}))?$/);
  if (m) {
    const month = MONTHS[m[1].toLowerCase()];
    if (month === undefined) return null;
    let y = m[3] ? +m[3] : new Date().getFullYear();
    if (y < 100) y += 2000;
    return new Date(y, month, +m[2]);
  }
  return null;
}

function findDate(line, dateFormat = 'DD/MM') {
  const patterns = [
    /\b\d{4}-\d{1,2}-\d{1,2}\b/,
    /\b\d{1,2}[\/.]\d{1,2}[\/.]\d{2,4}\b/,
    /\b\d{1,2}[\s\-][A-Za-z]{3,9}\.?(?:[\s\-,]+\d{2,4})?\b/,
    /\b[A-Za-z]{3,9}\.?\s+\d{1,2}(?:,?\s+\d{2,4})?\b/,
  ];
  for (const p of patterns) {
    const m = line.match(p);
    if (m) {
      const d = parseDate(m[0], dateFormat);
      if (d && !isNaN(d.getTime())) return { match: m[0], date: d };
    }
  }
  return null;
}

/* Find the transaction amount in a line that may also contain a balance.
   Strategy: prefer currency-prefixed amounts; otherwise grab the first
   decimal number after the merchant text. When multiple decimals exist
   (e.g. "Debit Balance" columns), the first non-balance one is the one
   we want — balances are usually the largest, so we exclude the max. */
function findAmount(line) {
  // Currency-prefixed wins outright
  const currencyRe =
    /(?:[\$£€¥]|USD|GBP|EUR|AED|INR|CAD|AUD)\s*(-?\s*\d{1,3}(?:[,]\d{3})*(?:\.\d{2})?|-?\s*\d+\.\d{2})/i;
  const cm = line.match(currencyRe);
  if (cm) {
    const raw = cm[1].replace(/[,\s]/g, '');
    const v = Math.abs(parseFloat(raw));
    if (!isNaN(v) && v > 0 && v < 1000000) {
      return { match: cm[0], amount: v };
    }
  }
  // Otherwise collect every decimal candidate
  const decRe = /(-?\d{1,3}(?:,\d{3})*\.\d{2})\b/g;
  const found = [];
  let m;
  while ((m = decRe.exec(line)) !== null) {
    const raw = m[1].replace(/,/g, '');
    const v = Math.abs(parseFloat(raw));
    if (!isNaN(v) && v > 0 && v < 1000000) {
      found.push({ match: m[0], amount: v, index: m.index });
    }
  }
  if (found.length === 0) return null;
  if (found.length === 1) return found[0];
  // Multiple decimals — likely amount + balance (or debit + credit + balance).
  // Drop the maximum (almost certainly the running balance) and take the
  // remaining one closest to the merchant text (i.e. the smallest index).
  const maxAmt = Math.max(...found.map((f) => f.amount));
  const candidates = found.filter((f) => f.amount !== maxAmt);
  const pick = candidates.length > 0 ? candidates[0] : found[0];
  return pick;
}

function isIncome(merchantUpper) {
  return INCOME_KEYWORDS.some((kw) => merchantUpper.includes(kw));
}

function looksLikeSubscription(merchantUpper) {
  return SUBSCRIPTION_KEYWORDS.some((kw) => merchantUpper.includes(kw));
}

function normalizeMerchant(raw) {
  let s = raw
    .toUpperCase()
    .replace(/\s+/g, ' ');

  // Strip HSBC-style transaction-method prefixes (NFC/IAP variants)
  s = s.replace(/^NFC\s*-\s*\(?(AP-PAY|G-PAY|APPLE\s*PAY|GOOGLE\s*PAY|SAMSUNG\s*PAY)?\)?\s*-?\s*/i, '');
  s = s.replace(/^IAP\s*-\s*\(?(AP-PAY|G-PAY)?\)?\s*-?\s*/i, '');
  s = s.replace(/^POS\s*-\s*/i, '');

  // Replace "*" separator (PAYPAL *MICROSOFT, OPENAI *CHATGPT, GEIDEA*AIS)
  // Keep both sides so matchKnown still finds either name
  s = s.replace(/\s*\*\s*/g, ' ');

  // Fix PDF-extraction artifacts: single capital letter followed by an
  // uppercase word should merge ("S TARBUCKS" → "STARBUCKS",
  // "T ABBY" → "TABBY", "A L FUTTAIM" → "ALFUTTAIM").
  // Run iteratively because cascading splits like "A L FUTTAIM" need
  // multiple passes.
  let prev;
  do {
    prev = s;
    s = s.replace(/\b([A-Z])\s+([A-Z]{2,})\b/, '$1$2');
  } while (s !== prev);

  s = s
    .replace(/[*#].*$/, '')
    .replace(/^(TX|TXN|REF|TRX|TR)[#\-:]?\d+\s*/i, '')
    .replace(/\b(TX|TXN|REF|TRX|TR)[#\-:]?\d{3,}\b/gi, '')
    .replace(/\b\d{6,}\b/g, '')                          // long ref numbers
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '')        // phone numbers
    .replace(/\s+(LTD|LLC|INC|CO|CORP|GMBH|PLC|SA|BV|LIMITED)\.?\b.*$/i, '')
    // Strip just the TLD token (.COM, .NET, etc.) without eating useful
    // merchant text that follows. The old ".*$" greedy version chewed up
    // valuable info — e.g. "APPLE.COM/BILL ITUNES.COM IE" became just
    // "APPLE", losing the ITUNES signal that lets matchKnown identify it.
    .replace(/\.(COM|NET|ORG|IO|CO|UK|AE)\b/gi, '')
    .replace(/\b(SUBSCRIPTION|SUBSCRIPT|SUBSCR|MONTHLY|RECURRING|PMT|PAYMENT|RENEWAL|MEMBERSHIP|UTILITY|BILL)\b/gi, '')
    // Strip trailing currency / country / city tokens (HSBC pattern)
    .replace(/\b(USD|EUR|GBP|AED|CAD|AUD|JPY|INR|SAR)\b/gi, '')
    .replace(/\b(AE|ARE|UAE|GB|GBR|US|USA|NL|NLD|IE|IRL|DE|DEU|FR|FRA|JP|JPN|CA|CAN|AU|AUS|DXB|784)\b/gi, '')
    .replace(/\b(DUBAI|ABU\s*DHABI|SHARJAH|LONDON|SAN\s*JOSE|SCHIPHOL|AMSTERDAM|BRISTOL|TRURO|STIRLING|NEW\s*YORK|SAN\s*FRANCISCO)\b/gi, '')
    .replace(/\s+\d{4,}\s*$/, '')
    .replace(/\s+\d+$/, '')
    .replace(/\s+REF[:#]?.*$/i, '')
    .replace(/\s+ID[:#]?.*$/i, '')
    .replace(/[^A-Z0-9\s\+\&\.\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return s;
}

function matchKnown(normalized) {
  for (const key of KNOWN_KEYS) {
    if (normalized.includes(key)) return KNOWN_MERCHANTS[key];
  }
  return null;
}

function canonicalKey(normalized) {
  const known = matchKnown(normalized);
  if (known) return known.name.toUpperCase();
  // Use first 2 words as canonical key for unknowns
  return normalized.split(' ').slice(0, 2).join(' ');
}

/* ─── Statement format detection ───
   HSBC and similar credit-card statements use "Original Amount … Total Amount"
   with the AED total on the LAST visible amount of the row (which may be
   spread across multiple PDF lines). Bank statements with "Debit Credit
   Balance" columns put the running balance LAST and it's typically the
   largest number. Different formats need different "which amount is the
   real one?" strategies.
*/
function detectStatementFormat(text) {
  const lower = text.toLowerCase();
  if (/original\s+amount/.test(lower) && /total\s+amount/.test(lower)) {
    return 'original-total';
  }
  if (/\bbalance\b/.test(lower) &&
      (/debit\s+credit/.test(lower) ||
       /credit\s+balance/.test(lower) ||
       /balance\s*\(/.test(lower))) {
    return 'with-balance';
  }
  return 'simple';
}

/* All decimal amounts in a line, with their string positions. */
function findAllAmounts(line) {
  const re = /(-?\d{1,3}(?:,\d{3})*\.\d{2})\b/g;
  const out = [];
  let m;
  while ((m = re.exec(line)) !== null) {
    const v = Math.abs(parseFloat(m[1].replace(/,/g, '')));
    if (!isNaN(v) && v > 0 && v < 1000000) {
      out.push({ amount: v, position: m.index, match: m[0] });
    }
  }
  return out;
}

function selectFinalAmount(amounts, format) {
  if (!amounts || amounts.length === 0) return null;
  if (amounts.length === 1) return amounts[0].amount;

  if (format === 'with-balance') {
    // Running balance is the largest. Drop it, take the first remaining.
    const max = Math.max(...amounts.map((a) => a.amount));
    const filtered = amounts.filter((a) => a.amount !== max);
    return filtered.length > 0 ? filtered[0].amount : amounts[0].amount;
  }
  // 'original-total' and 'simple': the LAST amount in document order is the
  // AED total (HSBC multi-line FX puts it on the final fee line). The
  // amounts array is already in insertion order across lines, so take the
  // last element directly — don't sort by string position, which is local
  // to each line and gives wrong answers across blocks.
  return amounts[amounts.length - 1].amount;
}

/* Lines that pdfplumber/pdf.js extracts that aren't real transactions. */
function isHeaderOrJunkLine(line) {
  const t = line.trim();
  if (t.length === 0) return true;
  // English column headers and statement chrome
  if (/^(transaction|posting|page|details|date|description|amount|balance|debit|credit|account|statement|period|opening|closing|original\s+amount|total\s+amount|vat|get\s+a|save\s+up|international\s+transactions|plans\s+you|important|the\s+number|the\s+total|please\s+note|your\s+cash|the\s+above|warning|tcs\s+apply|details\s+of\s+your|credit\s+card\s+statement|premier\s+credit|mobile\s+app|terms\s+and\s+conditions)\b/i.test(t)) return true;
  // Page footer
  if (/^page\s+\d+(\s+of\s+\d+)?$/i.test(t)) return true;
  // Marketing footer markers
  if (/\bT&Cs?\b/i.test(t)) return true;
  if (/\bpromo\s+code\b/i.test(t)) return true;
  if (/\bschedule\s+of\s+(services|tariffs)\b/i.test(t)) return true;
  if (/^applicable\.?\s*$/i.test(t)) return true;
  // Arabic-script lines (high proportion of Arabic Unicode chars)
  // Only flag if the line is ACTUALLY Arabic — don't eat amount-only lines
  // like " 126.55   126.55" which have no Latin letters but no Arabic either.
  const arabic = (t.match(/[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length;
  if (arabic > 0 && arabic / t.length > 0.3) return true;
  return false;
}

/* "CR" suffix indicates a credit (refund or payment-to-card) — never a subscription. */
function isCreditLine(line) {
  return /\d+(?:,\d{3})*\.\d{2}\s*C\s*R\b/i.test(line);
}

/* Lines that are continuation/fee items, NOT new transaction starters. */
function isFeeContinuationText(merchantText) {
  const t = merchantText.toUpperCase().trim();
  // Empty text means amounts-only line — that's a transaction starter, not
  // a fee continuation. Real HSBC fee lines always have a descriptive label
  // ("FOREIGN CURRENCY PROCESSING FEE", "STND PROC. FEE", etc.), so the
  // empty case should fall through to the starter branch.
  if (!t) return false;
  return /^(STND PROC|FOREIGN CURRENCY|ISSUER DCC|USD\/AED|GBP\/AED|EUR\/AED|FX RATE|EXCHANGE RATE|CONVERSION)/i.test(t) ||
         /^(STND|PROC|FEE|DCC|FX)\b/i.test(t) && t.length < 30;
}

/* Bank-charged fees that look like merchants but aren't subscriptions. */
function isBankFeeMerchant(merchantText) {
  const t = merchantText.toUpperCase();
  return /\b(OVERLIMIT|LATE\s*FEE|FINANCE\s*CHARGE|INTEREST\s*CHARGE|ANNUAL\s*FEE|CARD\s*FEE|ATM\s*FEE|CASH\s*ADVANCE|FOREIGN\s*TRANSACTION\s*FEE|MIN\s*PAYMENT|MINIMUM\s*PAYMENT)\b/.test(t);
}

/* Strip dates, amounts, and CR markers from a line — what's left is merchant text. */
function extractMerchantText(line, dateFormat) {
  let s = line;
  // Numeric dates DD/MM/YY etc.
  s = s.replace(/\b\d{1,2}[\/.]\d{1,2}[\/.]\d{2,4}\b/g, ' ');
  // ISO dates YYYY-MM-DD
  s = s.replace(/\b\d{4}-\d{1,2}-\d{1,2}\b/g, ' ');
  // DD-Mmm-YY / DD Mmm YY — validated against month names so we don't
  // accidentally eat patterns like "USD 7" or "DUBAI 39" (which would
  // otherwise leave ghost ".99" / ".00" trails in the merchant text).
  const monthGroup = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)';
  s = s.replace(new RegExp(`\\b\\d{1,2}[\\s\\-]${monthGroup}\\.?(?:[\\s\\-,]+\\d{2,4})?\\b`, 'gi'), ' ');
  // Mmm DD / Mmm DD, YYYY
  s = s.replace(new RegExp(`\\b${monthGroup}\\.?\\s+\\d{1,2}(?:,?\\s+\\d{2,4})?\\b`, 'gi'), ' ');
  // Decimal amounts
  s = s.replace(/-?\d{1,3}(?:,\d{3})*\.\d{2}\b/g, ' ');
  // CR indicators
  s = s.replace(/\bC\s*R\b/g, ' ');
  // Cleanup
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

/*
  STATE-MACHINE PARSER

  Real-world bank statements split a single transaction across multiple PDF
  text lines, and the order varies dramatically by extractor. pdf.js groups
  by Y-coordinate, which often produces:

    [amounts]
    [merchant]
    [date pair]
    [continuation]
    [next tx amounts]
    ...

  while other PDFs/extractors put dates first. We can't assume any single
  line contains "merchant + amounts together" — those events arrive on
  separate lines.

  We classify each line by what it CONTAINS (amounts? merchant text? a date
  pair? a fee keyword?) and update a "pending" transaction:
   - Amounts-only line is a transaction starter (or a continuation, if pending
     has no dates yet — like FX lines)
   - Date-pair-only line fills in the pending's dates
   - Merchant-only line fills in or appends the pending's merchant
   - Fee lines append amounts only (never trigger a flush)
   - Credit (CR) lines flush pending and discard the credit

  We flush pending when a NEW amounts-line arrives AFTER pending has dates
  (signaling the previous tx is complete). Critical: a merchant-only line
  with no pending is IGNORED (prevents card-transfer junk like
  "TO 4183 4899 1354 0452" from starting a fake transaction).
*/
function parseTransactions(text) {
  if (!text) return [];
  const dateFormat = detectDateFormat(text);
  const format = detectStatementFormat(text);
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

  const txns = [];
  let pending = null;

  const flush = () => {
    if (!pending) return;
    if (!pending.dates || pending.amounts.length === 0 || !pending.merchant) {
      pending = null;
      return;
    }
    const norm = normalizeMerchant(pending.merchant);
    if (!norm || norm.length < 2) { pending = null; return; }
    if (isIncome(norm) || isIncome(pending.merchant.toUpperCase())) { pending = null; return; }
    if (isBankFeeMerchant(pending.merchant)) { pending = null; return; }
    const amount = selectFinalAmount(pending.amounts, format);
    if (!amount) { pending = null; return; }
    txns.push({
      raw: pending.raw,
      merchant: norm,
      rawMerchant: pending.merchant,
      amount,
      date: pending.dates,
    });
    pending = null;
  };

  // Lone-currency-code lines like " USD   21.00   77.14" carry amounts but
  // no real merchant — strip the currency token so we don't treat "USD" as
  // a merchant name.
  const stripLoneCurrency = (s) =>
    s.replace(/^(USD|EUR|GBP|AED|CAD|AUD|JPY|INR|SAR|CNY|HKD|SGD)$/i, '').trim();

  for (const line of lines) {
    if (isHeaderOrJunkLine(line)) continue;
    if (isCreditLine(line)) { flush(); continue; }

    const dpMatch = line.match(/(\d{1,2}-[A-Za-z]{3}-\d{2,4})\s+(\d{1,2}-[A-Za-z]{3}-\d{2,4})/);
    const singleDate = !dpMatch ? findDate(line, dateFormat) : null;
    const amounts = findAllAmounts(line);
    const rawMerchantText = extractMerchantText(line, dateFormat);
    const cleanedMerchant = stripLoneCurrency(rawMerchantText);
    const hasAmounts = amounts.length > 0;
    const hasMerchant = cleanedMerchant.length >= 2 && /[A-Za-z]/.test(cleanedMerchant);
    const hasDate = !!(dpMatch || singleDate);
    const isFee = isFeeContinuationText(rawMerchantText);

    // 1. Fee continuation line — append amounts to pending, never flush
    if (isFee) {
      if (pending && hasAmounts) pending.amounts.push(...amounts);
      continue;
    }

    // 2. Amounts present (with or without merchant on this line)
    if (hasAmounts) {
      if (pending && pending.dates) {
        // Previous transaction is complete — flush and start new
        flush();
        pending = {
          raw: line,
          merchant: hasMerchant ? cleanedMerchant : '',
          amounts: [...amounts],
          dates: dpMatch ? parseDate(dpMatch[1]) : (singleDate ? singleDate.date : null),
        };
      } else if (pending) {
        // Pending exists but no dates yet — could be merchant-without-dates
        // followed by amounts (PDF extractor put them in unusual order).
        // Append amounts and any new info we have.
        pending.amounts.push(...amounts);
        if (hasMerchant && !pending.merchant) pending.merchant = cleanedMerchant;
        else if (hasMerchant) pending.merchant = (pending.merchant + ' ' + cleanedMerchant).trim();
        if (hasDate && !pending.dates) {
          pending.dates = dpMatch ? parseDate(dpMatch[1]) : singleDate.date;
        }
      } else {
        // No pending — start a new transaction
        pending = {
          raw: line,
          merchant: hasMerchant ? cleanedMerchant : '',
          amounts: [...amounts],
          dates: dpMatch ? parseDate(dpMatch[1]) : (singleDate ? singleDate.date : null),
        };
      }
      continue;
    }

    // 3. Date pair (or single date) without amounts — fills pending's dates
    if (hasDate && pending) {
      if (!pending.dates) {
        pending.dates = dpMatch ? parseDate(dpMatch[1]) : singleDate.date;
      }
      // Date lines may carry small text fragments like "CA" (country) — fold
      // them into the merchant field if present.
      if (hasMerchant) {
        pending.merchant = pending.merchant
          ? (pending.merchant + ' ' + cleanedMerchant).trim()
          : cleanedMerchant;
      }
      continue;
    }

    // 4. Merchant-only line — fills/appends pending's merchant.
    //    Critical: if no pending exists, IGNORE. A merchant-alone line cannot
    //    start a transaction (would produce false starts from card-transfer
    //    chrome like "TO 4183 4899 1354 0452" left over after credit lines).
    if (hasMerchant && pending) {
      pending.merchant = pending.merchant
        ? (pending.merchant + ' ' + cleanedMerchant).trim()
        : cleanedMerchant;
      continue;
    }
  }

  flush();
  return txns;
}

/* ──────────────────────────────────────────────────────────────
   DETECTION
   Same canonical merchant + similar amount (±5%) + ≥2 hits +
   roughly monthly cadence (25–35 days) → subscription.
   Also catches yearly (300–400 days) and weekly (5–9 days).
   ────────────────────────────────────────────────────────────── */
function detectSubscriptions(txns) {
  const groups = {};
  for (const t of txns) {
    const key = canonicalKey(t.merchant);
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }

  const subs = [];
  const suspected = [];
  const suspectedKeys = new Set();

  for (const [key, list] of Object.entries(groups)) {
    if (list.length < 2) continue;
    list.sort((a, b) => a.date - b.date);

    // Bucket transactions by similar amount (±5% of median)
    const amounts = [...list.map((t) => t.amount)].sort((a, b) => a - b);
    const median = amounts[Math.floor(amounts.length / 2)];
    const similar = list.filter(
      (t) => Math.abs(t.amount - median) / median <= 0.05
    );

    // If amounts vary too much for a clean median match — but the same
    // merchant appears 3+ times — that's still very likely recurring
    // activity (e.g. Apple App Store: subscription renewals mixed with
    // one-off in-app purchases). Flag as suspected so the user can review.
    if (similar.length < 2) {
      if (list.length >= 3) {
        const known = matchKnown(list[0].merchant);
        const looks = looksLikeSubscription((list[0].rawMerchant || list[0].merchant).toUpperCase());
        if (known || looks) {
          const avgAmount = list.reduce((s, t) => s + t.amount, 0) / list.length;
          suspected.push({
            key,
            name: known ? known.name : toTitle(list[0].merchant.split(' ').slice(0, 3).join(' ')),
            category: known?.category || 'Suspected',
            monthlyCost: avgAmount,
            yearlyCost: avgAmount * 12,
            cadence: 'mixed-amounts',
            occurrences: list.length,
            lastSeen: list[list.length - 1].date,
            flagged: !known,
            suspected: true,
            raw: list[0].merchant,
          });
          suspectedKeys.add(key);
        }
      }
      continue;
    }

    const intervals = [];
    for (let i = 1; i < similar.length; i++) {
      const d =
        (similar[i].date - similar[i - 1].date) / (1000 * 60 * 60 * 24);
      intervals.push(d);
    }

    let cadence = null;
    let monthlyCost = 0;
    const avgInterval =
      intervals.reduce((a, b) => a + b, 0) / Math.max(1, intervals.length);
    const avgAmount =
      similar.reduce((s, t) => s + t.amount, 0) / similar.length;

    if (avgInterval >= 25 && avgInterval <= 35) {
      cadence = 'monthly';
      monthlyCost = avgAmount;
    } else if (avgInterval >= 5 && avgInterval <= 9) {
      cadence = 'weekly';
      monthlyCost = avgAmount * 4.33;
    } else if (avgInterval >= 80 && avgInterval <= 100) {
      cadence = 'quarterly';
      monthlyCost = avgAmount / 3;
    } else if (avgInterval >= 350 && avgInterval <= 380) {
      cadence = 'yearly';
      monthlyCost = avgAmount / 12;
    } else if (similar.length >= 3 && avgInterval >= 25 && avgInterval <= 40) {
      cadence = 'monthly';
      monthlyCost = avgAmount;
    }

    if (!cadence) {
      // Fallback: 3+ similar-amount hits with no clear cadence still
      // smells like a subscription. Surface as "likely recurring" so the
      // user can decide rather than silently drop it. But suppress for
      // known transport/food/grocery merchants (Careem rides, supermarket
      // visits with coincidentally similar amounts) where this is noise.
      if (similar.length >= 3) {
        const known = matchKnown(similar[0].merchant);
        const isTransport = !known && looksLikeNonSubscription(
          (similar[0].rawMerchant || similar[0].merchant)
        );
        if (!isTransport) {
          suspected.push({
            key,
            name: known
              ? known.name
              : toTitle(similar[0].merchant.split(' ').slice(0, 3).join(' ')),
            category: known?.category || 'Suspected',
            monthlyCost: avgAmount,
            yearlyCost: avgAmount * 12,
            cadence: 'irregular',
            occurrences: similar.length,
            lastSeen: similar[similar.length - 1].date,
            flagged: !known,
            suspected: true,
            raw: similar[0].merchant,
          });
          suspectedKeys.add(key);
        }
      }
      continue;
    }

    const known = matchKnown(similar[0].merchant);
    const displayName = known
      ? known.name
      : toTitle(similar[0].merchant.split(' ').slice(0, 3).join(' '));

    subs.push({
      key,
      name: displayName,
      category: known?.category || 'Unknown',
      monthlyCost,
      yearlyCost: monthlyCost * 12,
      cadence,
      occurrences: similar.length,
      lastSeen: similar[similar.length - 1].date,
      flagged: !known,
      suspected: false,
      raw: similar[0].merchant,
    });
    suspectedKeys.add(key);
  }

  // Suspected tier: single-occurrence transactions whose name screams
  // "subscription" — gym memberships, known SaaS brands seen once, etc.
  // We assume monthly cadence (most common) and present these separately
  // so the user can confirm whether to count them.
  for (const [key, list] of Object.entries(groups)) {
    if (suspectedKeys.has(key)) continue;
    if (list.length !== 1) continue;
    const t = list[0];
    const upper = (t.rawMerchant || t.merchant).toUpperCase();
    const known = matchKnown(t.merchant);
    const looks = looksLikeSubscription(upper) || looksLikeSubscription(t.merchant);
    if (!known && !looks) continue;

    // Tiny cleanup for display: remove leading words like "MEMBERSHIP" from
    // generic names like "Gym Membership" so the card reads cleanly.
    const displayRaw = (t.rawMerchant || t.merchant)
      .replace(/\s+/g, ' ')
      .trim();

    suspected.push({
      key,
      name: known?.name || toTitle(displayRaw.split(' ').slice(0, 4).join(' ')),
      category: known?.category || 'Suspected',
      monthlyCost: t.amount,
      yearlyCost: t.amount * 12,
      cadence: 'suspected',
      occurrences: 1,
      lastSeen: t.date,
      flagged: !known,
      suspected: true,
      raw: t.merchant,
    });
  }

  const all = [...subs, ...suspected];
  return all.sort((a, b) => {
    // Confirmed first, then by yearly cost
    if (a.suspected !== b.suspected) return a.suspected ? 1 : -1;
    return b.yearlyCost - a.yearlyCost;
  });
}

function toTitle(s) {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

/* ──────────────────────────────────────────────────────────────
   PDF.js (loaded lazily from CDN)
   ────────────────────────────────────────────────────────────── */
function usePdfJs() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.pdfjsLib) {
      setReady(true);
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setReady(true);
      }
    };
    document.head.appendChild(s);
  }, []);
  return ready;
}

async function extractPdfText(file) {
  const buf = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
  const out = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // group items by rough Y position to recover line breaks
    const rows = {};
    for (const it of content.items) {
      const y = Math.round(it.transform[5]);
      if (!rows[y]) rows[y] = [];
      rows[y].push({ x: it.transform[4], str: it.str });
    }
    const sorted = Object.keys(rows)
      .map(Number)
      .sort((a, b) => b - a);
    for (const y of sorted) {
      const line = rows[y]
        .sort((a, b) => a.x - b.x)
        .map((c) => c.str)
        .join(' ');
      out.push(line);
    }
  }
  return out.join('\n');
}

/* ──────────────────────────────────────────────────────────────
   FONT INJECTION + GLOBAL STYLES
   ────────────────────────────────────────────────────────────── */
function GlobalStyles() {
  return (
    <>
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        crossOrigin=""
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin=""
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..800,0..100&family=Geist:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"
      />
      <style>{`
        :root {
          --paper: ${THEME.paper};
          --paper-deep: ${THEME.paperDeep};
          --ink: ${THEME.ink};
          --ink-soft: ${THEME.inkSoft};
          --ink-mute: ${THEME.inkMute};
          --rule: ${THEME.rule};
          --rule-soft: ${THEME.ruleSoft};
          --card: ${THEME.card};
          --rust: ${THEME.rust};
          --rust-deep: ${THEME.rustDeep};
          --amber: ${THEME.amber};
          --forest: ${THEME.forest};
          --flag: ${THEME.flag};
        }
        body { margin: 0; }
        .sld-app {
          background: var(--paper);
          color: var(--ink);
          font-family: ${FONTS.body};
          min-height: 100vh;
          font-feature-settings: "ss01", "ss02", "cv11";
          -webkit-font-smoothing: antialiased;
          background-image:
            radial-gradient(1200px 600px at 80% -10%, rgba(192,67,42,0.05), transparent 60%),
            radial-gradient(900px 500px at -10% 110%, rgba(47,93,68,0.04), transparent 60%);
        }
        .sld-display { font-family: ${FONTS.display}; font-feature-settings: "ss01"; }
        .sld-mono { font-family: ${FONTS.mono}; font-variant-numeric: tabular-nums; }
        .sld-grain {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
        }
        @keyframes drip {
          0%, 100% { transform: translateY(0); opacity: 0.9; }
          50% { transform: translateY(2px); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
        .sld-fade-up { animation: fadeUp 0.5s ease-out both; }
        .sld-drip { animation: drip 2.4s ease-in-out infinite; }
        .sld-shimmer {
          background: linear-gradient(110deg, transparent 30%, rgba(192,67,42,0.12) 50%, transparent 70%);
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }
        .sld-textarea::placeholder { color: ${THEME.inkMute}; opacity: 0.7; }
        .sld-btn-primary {
          background: var(--ink);
          color: var(--paper);
          transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
        }
        .sld-btn-primary:hover { background: var(--rust); transform: translateY(-1px); }
        .sld-btn-primary:active { transform: translateY(0); }
        .sld-link { color: var(--ink); border-bottom: 1px solid var(--rule); transition: border-color 0.2s; }
        .sld-link:hover { border-color: var(--rust); color: var(--rust); }
        details > summary { list-style: none; cursor: pointer; }
        details > summary::-webkit-details-marker { display: none; }
        @media (max-width: 900px) {
          .sld-display-xl { font-size: clamp(2rem, 8vw, 3rem) !important; }
          .sld-display-2xl { font-size: clamp(2.6rem, 14vw, 5rem) !important; }
        }
      `}</style>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   AD SLOT
   Reusable, intentional. <AdSlot position="..." />
   ────────────────────────────────────────────────────────────── */
function AdSlot({ position, variant = 'card', stickyTop }) {
  const sticky = position === 'left-sidebar' || position === 'right-sidebar';
  const wrapStyle = sticky
    ? { position: 'sticky', top: stickyTop || 32 }
    : {};

  if (variant === 'inline') {
    return (
      <aside
        data-ad-slot={position}
        className="sld-fade-up"
        style={{
          background: THEME.card,
          border: `1px solid ${THEME.rule}`,
          borderRadius: 14,
          padding: '20px 22px',
          margin: '18px 0',
          boxShadow: THEME.shadow,
          position: 'relative',
        }}
      >
        <div
          className="sld-mono"
          style={{
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: THEME.inkMute,
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>Sponsored</span>
          <span style={{ opacity: 0.7 }}>Partner offer</span>
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 22,
            lineHeight: 1.2,
            fontWeight: 500,
            marginBottom: 6,
            color: THEME.ink,
          }}
        >
          Recommended money-saving tools
        </div>
        <div style={{ color: THEME.inkSoft, fontSize: 14, marginBottom: 14 }}>
          Curated partner offers will appear here. Replace with Google AdSense
          or direct sponsor markup.
        </div>
        <div
          style={{
            height: 90,
            background:
              'repeating-linear-gradient(45deg, rgba(20,19,34,0.03) 0 8px, transparent 8px 16px)',
            border: `1px dashed ${THEME.rule}`,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: THEME.inkMute,
            fontSize: 12,
          }}
          className="sld-mono"
        >
          AD-SLOT · {position}
        </div>
      </aside>
    );
  }

  return (
    <aside data-ad-slot={position} style={wrapStyle}>
      <div
        style={{
          background: THEME.card,
          border: `1px solid ${THEME.rule}`,
          borderRadius: 14,
          padding: 20,
          boxShadow: THEME.shadow,
        }}
      >
        <div
          className="sld-mono"
          style={{
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: THEME.inkMute,
            marginBottom: 10,
          }}
        >
          Sponsored
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 18,
            lineHeight: 1.25,
            fontWeight: 500,
            color: THEME.ink,
            marginBottom: 8,
          }}
        >
          Smarter money tools
        </div>
        <div style={{ color: THEME.inkSoft, fontSize: 13, marginBottom: 14 }}>
          Partner offers, budgeting apps and cashback tools.
        </div>
        <div
          style={{
            height: 200,
            background:
              'repeating-linear-gradient(45deg, rgba(20,19,34,0.03) 0 8px, transparent 8px 16px)',
            border: `1px dashed ${THEME.rule}`,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: THEME.inkMute,
            fontSize: 11,
          }}
          className="sld-mono"
        >
          AD · {position}
        </div>
      </div>
    </aside>
  );
}

/* ──────────────────────────────────────────────────────────────
   CADENCE BADGE
   ────────────────────────────────────────────────────────────── */
function CadenceBadge({ cadence }) {
  // Friendly labels — internal cadence keys aren't user-facing terminology.
  const labels = {
    'mixed-amounts': 'varied amounts',
    'irregular': 'irregular',
    'suspected': 'unconfirmed',
    'unconfirmed': 'unconfirmed',
    'monthly': 'monthly',
    'weekly': 'weekly',
    'quarterly': 'quarterly',
    'yearly': 'yearly',
  };
  return (
    <span
      className="sld-mono"
      style={{
        fontSize: 10,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: THEME.inkMute,
        background: 'transparent',
        border: `1px solid ${THEME.rule}`,
        padding: '3px 8px',
        borderRadius: 999,
      }}
    >
      {labels[cadence] || cadence}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────
   SUBSCRIPTION ROW
   ────────────────────────────────────────────────────────────── */
function SubRow({ sub, idx, currency }) {
  const isSuspected = sub.suspected;
  return (
    <div
      className="sld-fade-up"
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: 16,
        alignItems: 'center',
        padding: '20px 0',
        borderTop: idx === 0 ? 'none' : `1px solid ${THEME.ruleSoft}`,
        animationDelay: `${idx * 60}ms`,
        opacity: isSuspected ? 0.92 : 1,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: isSuspected
            ? '#f4ecdb'
            : sub.flagged
            ? '#fbf0e2'
            : THEME.paperDeep,
          border: `1px solid ${
            isSuspected ? '#e0d3b2' : sub.flagged ? '#e8c899' : THEME.rule
          }`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isSuspected
            ? THEME.amber
            : sub.flagged
            ? THEME.flag
            : THEME.inkSoft,
          fontFamily: FONTS.display,
          fontWeight: 600,
          fontSize: 18,
          fontStyle: isSuspected ? 'italic' : 'normal',
        }}
      >
        {isSuspected ? '?' : sub.name.charAt(0).toUpperCase()}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 20,
              fontWeight: 500,
              color: THEME.ink,
              letterSpacing: '-0.01em',
              fontStyle: isSuspected ? 'italic' : 'normal',
            }}
          >
            {sub.name}
          </div>
          {isSuspected && (
            <span
              title="Seen once — looks like a subscription, can't fully confirm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                color: THEME.amber,
                background: '#f4ecdb',
                border: '1px solid #e0d3b2',
                padding: '2px 8px',
                borderRadius: 999,
                fontWeight: 500,
              }}
            >
              <Sparkles size={11} strokeWidth={2.4} />
              Likely recurring
            </span>
          )}
          {!isSuspected && sub.flagged && (
            <span
              title="Low recognition — possibly forgotten"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                color: THEME.flag,
                background: '#fbf0e2',
                border: '1px solid #e8c899',
                padding: '2px 8px',
                borderRadius: 999,
                fontWeight: 500,
              }}
            >
              <AlertTriangle size={11} strokeWidth={2.4} />
              Possibly forgotten
            </span>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 10,
            marginTop: 4,
            fontSize: 13,
            color: THEME.inkMute,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span>{sub.category}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <CadenceBadge cadence={isSuspected ? 'unconfirmed' : sub.cadence} />
          <span style={{ opacity: 0.4 }}>·</span>
          <span className="sld-mono" style={{ fontSize: 12 }}>
            {sub.occurrences}× seen
          </span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div
          className="sld-mono"
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: THEME.ink,
            letterSpacing: '-0.02em',
          }}
        >
          {currency}
          {sub.monthlyCost.toFixed(2)}
        </div>
        <div
          style={{
            fontSize: 11,
            color: THEME.inkMute,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginTop: 2,
          }}
          className="sld-mono"
        >
          {isSuspected ? 'est. ' : ''}/mo · {currency}
          {sub.yearlyCost.toFixed(0)}/yr
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   MAIN APP
   ────────────────────────────────────────────────────────────── */
const SAMPLE = `12 Mar 2025 - Netflix - $15.99
14 Mar 2025 - Tesco Superstore - $84.20
18 Mar 2025 - Spotify Premium - $10.99
22 Mar 2025 - Amazon Prime - $14.99
01 Apr 2025 - Salary - +$3,400.00
05 Apr 2025 - Shell Petrol - $52.10
11 Apr 2025 - Netflix - $15.99
16 Apr 2025 - Spotify Premium - $10.99
20 Apr 2025 - Adobe Creative Cloud - $54.99
22 Apr 2025 - Amazon Prime - $14.99
27 Apr 2025 - Anytime Fitness - $39.99
03 May 2025 - Uber Eats - $28.40
10 May 2025 - Netflix - $15.99
15 May 2025 - Spotify Premium - $10.99
19 May 2025 - ChatGPT Plus - $20.00
20 May 2025 - Adobe Creative Cloud - $54.99
22 May 2025 - Amazon Prime - $14.99
26 May 2025 - Anytime Fitness - $39.99
30 May 2025 - Calm App - $7.99
08 Jun 2025 - Netflix - $15.99
14 Jun 2025 - Spotify Premium - $10.99
19 Jun 2025 - ChatGPT Plus - $20.00
20 Jun 2025 - Adobe Creative Cloud - $54.99
22 Jun 2025 - Amazon Prime - $14.99
27 Jun 2025 - Anytime Fitness - $39.99
30 Jun 2025 - Calm App - $7.99
05 Jul 2025 - Sketchy Box Subs Ltd - $12.49
30 Jul 2025 - Calm App - $7.99`;

/* ──────────────────────────────────────────────────────────────
   LEGAL PAGES
   Reachable via #/privacy and #/terms hash routes. Plain prose,
   matching the editorial typography of the main page so they don't
   look like a corporate dump-zone. The shared LegalPage shell
   provides the back-link and consistent layout.
   ────────────────────────────────────────────────────────────── */
function LegalPage({ title, children }) {
  return (
    <div
      style={{
        background: THEME.paper,
        color: THEME.ink,
        minHeight: '100vh',
        fontFamily: FONTS.body,
      }}
    >
      <GlobalStyles />
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '48px 24px 80px',
        }}
      >
        <a
          href="#/"
          onClick={(e) => {
            // hashchange doesn't fire when only removing the hash, so we
            // explicitly push and dispatch.
            e.preventDefault();
            window.history.pushState(
              null,
              '',
              window.location.pathname + window.location.search
            );
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: THEME.inkMute,
            textDecoration: 'none',
            fontSize: 13,
            marginBottom: 36,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = THEME.ink)}
          onMouseLeave={(e) => (e.currentTarget.style.color = THEME.inkMute)}
        >
          ← Back to The Leak Detector
        </a>
        <div
          className="sld-mono"
          style={{
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: THEME.rust,
            marginBottom: 14,
          }}
        >
          The Leak Detector
        </div>
        <h1
          className="sld-display"
          style={{
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            margin: '0 0 8px',
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        <div
          style={{
            fontSize: 13,
            color: THEME.inkMute,
            marginBottom: 36,
            fontStyle: 'italic',
            fontFamily: FONTS.display,
          }}
        >
          Last updated: 26 April 2026
        </div>
        <div
          style={{
            fontSize: 15.5,
            lineHeight: 1.7,
            color: THEME.inkSoft,
          }}
          className="sld-legal-prose"
        >
          {children}
        </div>
        <div
          style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: `1px solid ${THEME.rule}`,
            fontSize: 12,
            color: THEME.inkMute,
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <a
            href="#/privacy"
            style={{ color: THEME.inkMute, textDecoration: 'none' }}
          >
            Privacy Policy
          </a>
          <span style={{ opacity: 0.4 }}>·</span>
          <a
            href="#/terms"
            style={{ color: THEME.inkMute, textDecoration: 'none' }}
          >
            Terms of Use
          </a>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>© {new Date().getFullYear()} The Leak Detector</span>
        </div>
      </div>
      <style>{`
        .sld-legal-prose h2 {
          font-family: ${FONTS.display};
          font-size: 22px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: ${THEME.ink};
          margin: 36px 0 12px;
          line-height: 1.25;
        }
        .sld-legal-prose h3 {
          font-family: ${FONTS.display};
          font-size: 17px;
          font-weight: 500;
          color: ${THEME.ink};
          margin: 28px 0 8px;
        }
        .sld-legal-prose p { margin: 0 0 16px; }
        .sld-legal-prose ul { padding-left: 22px; margin: 0 0 16px; }
        .sld-legal-prose li { margin-bottom: 6px; }
        .sld-legal-prose a { color: ${THEME.rust}; text-decoration: underline; }
        .sld-legal-prose strong { color: ${THEME.ink}; font-weight: 500; }
      `}</style>
    </div>
  );
}

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        The Leak Detector is a free, browser-based tool that helps people spot
        recurring subscriptions in their bank or credit card statements. We
        designed this service around a simple commitment: <strong>your
        statement data never leaves your device.</strong>
      </p>

      <h2>1. The data you provide to the detector</h2>
      <p>
        When you paste statement text or upload a PDF, that content is parsed
        entirely inside your web browser using JavaScript that runs on your
        own device. We do not transmit, store, or retain any of the
        transactions, account numbers, names, balances, or other information
        contained in your statements.
      </p>
      <p>
        Refreshing the page or closing the tab clears the data from memory.
        We have no servers that receive your statements, no databases that
        retain them, and no logs that capture them. Even we cannot see what
        you scanned.
      </p>

      <h2>2. The data we do collect</h2>
      <p>
        Although your statement data stays on your device, like most websites
        we use third-party services that may collect limited information for
        operational and revenue purposes:
      </p>
      <ul>
        <li>
          <strong>Anonymous analytics</strong> (such as Google Analytics or a
          privacy-friendly equivalent) — to understand how many people use
          the site, which pages they visit, and which countries they come
          from. We do not link this data to your identity.
        </li>
        <li>
          <strong>Advertising networks</strong> — this site is supported by
          ads, which require advertising partners to set cookies or similar
          identifiers. These partners may use information about your visits
          to this and other websites to provide advertisements about goods
          and services that may interest you. They do not receive your
          statement data; they only see the standard browsing signals
          available to any website.
        </li>
        <li>
          <strong>Hosting and content delivery</strong> — your browser's IP
          address and standard request metadata are visible to our hosting
          provider as a normal part of serving the page, the same as any
          website you visit.
        </li>
      </ul>

      <h2>3. Cookies and tracking</h2>
      <p>
        We don't set any cookies of our own. Third parties (advertising and
        analytics) may set cookies as described above. You can block or
        delete cookies via your browser settings without affecting the
        detector's core functionality.
      </p>

      <h2>4. Your rights</h2>
      <p>
        Depending on where you live, you may have rights under data
        protection laws such as the GDPR (EU/UK) or comparable legislation
        in the UAE, US, and elsewhere. Because we do not collect personal
        information ourselves, most of these rights apply only to data held
        by our analytics and advertising partners. You can typically exercise
        these rights by adjusting your browser's privacy settings or by
        contacting those providers directly.
      </p>

      <h2>5. Children</h2>
      <p>
        The Leak Detector is intended for adult use. We do not knowingly
        collect information from children under 13 (or under 16 in
        jurisdictions where that is the applicable age).
      </p>

      <h2>6. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect
        changes to our practices, our advertising partners, or applicable
        law. The "last updated" date at the top of this page indicates when
        it was most recently revised.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about this policy or how the detector handles your data?
        Reach us at{' '}
        <a href="mailto:misbau1975coding@gmail.com">
          misbau1975coding@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}

function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <p>
        By using The Leak Detector, you agree to these terms. If you don't
        agree, please don't use the service.
      </p>

      <h2>1. What this service is</h2>
      <p>
        The Leak Detector is a free, browser-based tool that scans bank or
        credit card statement text and identifies transactions that look like
        recurring subscriptions. It is provided as-is, for informational
        purposes only, and is funded by display advertising.
      </p>

      <h2>2. What this service is not</h2>
      <p>
        <strong>The Leak Detector is not financial advice.</strong> The
        detector identifies <em>likely</em> recurring charges based on
        patterns in the text you provide. It can miss subscriptions, flag
        non-subscription charges as recurring, or get amounts and cadences
        wrong. Always verify any output against your actual statements
        before making financial decisions.
      </p>
      <p>
        We are not affiliated with any bank, credit card issuer, or
        merchant. We do not cancel subscriptions, contact merchants on your
        behalf, dispute charges, or interact with your accounts in any way.
      </p>

      <h2>3. Your responsibilities</h2>
      <ul>
        <li>
          You're responsible for the data you paste or upload. Don't upload
          statements that aren't yours, or that you don't have permission
          to process.
        </li>
        <li>
          You're responsible for verifying the detector's output. Treat it
          as a starting point for review, not a definitive list.
        </li>
        <li>
          You agree not to attempt to reverse-engineer, scrape, attack,
          overload, or otherwise interfere with the service.
        </li>
      </ul>

      <h2>4. Intellectual property</h2>
      <p>
        The site's design, code, copy, and brand are owned by us. You may
        link to the site freely. You may not copy, modify, or redistribute
        the site itself without permission.
      </p>

      <h2>5. Advertising</h2>
      <p>
        The Leak Detector is supported by advertising. Ads are clearly
        labelled and are served by third-party networks. We don't endorse
        the products advertised, and we're not responsible for any
        third-party site you reach by clicking an ad.
      </p>

      <h2>6. Disclaimer of warranties</h2>
      <p>
        The service is provided "as is" and "as available," without
        warranties of any kind, express or implied, including warranties of
        merchantability, fitness for a particular purpose, accuracy, or
        non-infringement. We do not guarantee that the detector will be
        error-free, uninterrupted, or available at any particular time.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, we are not liable for any
        indirect, incidental, special, consequential, or punitive damages
        arising from your use of the service — including missed
        subscriptions, financial loss from acting on the detector's output,
        or any other consequence of using or being unable to use the site.
        Because the service is free and processes your data locally, you
        accept the full risk of how you use the output.
      </p>

      <h2>8. Changes to the service</h2>
      <p>
        We may change, suspend, or discontinue the service (or any part of
        it) at any time, with or without notice. We may also revise these
        Terms; the "last updated" date at the top of this page reflects the
        most recent change. Your continued use of the service after changes
        means you accept the new terms.
      </p>

      <h2>9. Governing law</h2>
      <p>
        These terms are governed by the laws of the United Arab Emirates.
        Any disputes arising from your use of the service will be handled
        in the appropriate courts of the United Arab Emirates.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these terms? Reach us at{' '}
        <a href="mailto:misbau1975coding@gmail.com">
          misbau1975coding@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}

export default function App() {
  const pdfReady = usePdfJs();
  const [text, setText] = useState('');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const fileRef = useRef(null);
  const resultsRef = useRef(null);

  // Hash-based routing: '/privacy' and '/terms' render dedicated pages.
  // Everything else renders the main detector. We use hash routing because
  // it requires no build config — works whether deployed to a static host,
  // a CDN, or behind any framework. The trade-off vs. real routes is that
  // the URL has a # in it, which is fine for legal pages users rarely
  // hit but ad networks need to be able to crawl.
  const [route, setRoute] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash : ''
  );
  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  if (route === '#/privacy') return <PrivacyPage />;
  if (route === '#/terms') return <TermsPage />;

  const currency = useMemo(() => {
    if (!text) return '$';
    if (text.includes('£')) return '£';
    if (text.includes('€')) return '€';
    if (/\bAED\b/.test(text)) return 'AED ';
    return '$';
  }, [text]);

  const runScan = async (overrideText) => {
    setError('');
    const source = overrideText ?? text;
    if (!source || source.trim().length < 10) {
      setError('Paste some transactions or upload a PDF first.');
      return;
    }
    setScanning(true);
    setResults(null);
    // small delay so the UI breathes
    await new Promise((r) => setTimeout(r, 700));
    try {
      const txns = parseTransactions(source);
      const subs = detectSubscriptions(txns);
      const confirmed = subs.filter((s) => !s.suspected);
      const suspected = subs.filter((s) => s.suspected);
      const confirmedMonthly = confirmed.reduce((s, x) => s + x.monthlyCost, 0);
      const confirmedYearly = confirmed.reduce((s, x) => s + x.yearlyCost, 0);
      const suspectedMonthly = suspected.reduce((s, x) => s + x.monthlyCost, 0);
      const suspectedYearly = suspected.reduce((s, x) => s + x.yearlyCost, 0);
      setResults({
        txnCount: txns.length,
        subs,
        confirmedCount: confirmed.length,
        suspectedCount: suspected.length,
        // Headline totals include BOTH confirmed and likely-recurring so the
        // user sees a useful number even when they've pasted a single month
        // (where most subs only appear once and can't be confirmed yet).
        // The breakdown stat shows what fraction is estimated.
        totalMonthly: confirmedMonthly + suspectedMonthly,
        totalYearly: confirmedYearly + suspectedYearly,
        confirmedMonthly,
        confirmedYearly,
        suspectedMonthly,
        suspectedYearly,
        isEstimate: confirmed.length === 0 && suspected.length > 0,
      });
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 80);
    } catch (e) {
      setError('Could not parse the data. Try a different format.');
    } finally {
      setScanning(false);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file.');
      return;
    }
    if (!pdfReady) {
      setError('PDF reader is still loading. Try again in a moment.');
      return;
    }
    setPdfName(file.name);
    try {
      setScanning(true);
      const extracted = await extractPdfText(file);
      setText(extracted);
      await runScan(extracted);
    } catch (e) {
      setError('Could not read that PDF. Try pasting the text instead.');
      setScanning(false);
    }
  };

  const useSample = () => {
    setText(SAMPLE);
    setPdfName('');
    runScan(SAMPLE);
  };

  const reset = () => {
    setText('');
    setPdfName('');
    setResults(null);
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="sld-app">
      <GlobalStyles />

      {/* Top bar */}
      <header
        style={{
          borderBottom: `1px solid ${THEME.rule}`,
          background: 'rgba(246,241,230,0.85)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: THEME.ink,
                color: THEME.paper,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Droplet size={15} className="sld-drip" strokeWidth={2.2} />
            </div>
            <div>
              <div
                className="sld-mono"
                style={{
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: THEME.inkSoft,
                  lineHeight: 1,
                }}
              >
                The Leak Detector
              </div>
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 13,
                  fontStyle: 'italic',
                  color: THEME.inkMute,
                  marginTop: 2,
                  lineHeight: 1,
                }}
              >
                Find what's quietly draining your account.
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 12,
              color: THEME.inkSoft,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={12} /> No login
            </span>
            <span
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              className="hidden sm:flex"
            >
              <Shield size={12} /> Runs in your browser
            </span>
          </div>
        </div>
      </header>

      {/* Main grid */}
      <div
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '32px 24px 80px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 220px)',
          gap: 28,
        }}
        className="sld-main-grid"
      >
        {/* Centre column */}
        <main style={{ minWidth: 0 }}>
          {/* Hero */}
          <section style={{ paddingTop: 16, paddingBottom: 28 }}>
            <div
              className="sld-mono"
              style={{
                fontSize: 11,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: THEME.rust,
                marginBottom: 18,
              }}
            >
              ◆ A 60-second money audit
            </div>
            <h1
              className="sld-display sld-display-2xl"
              style={{
                fontSize: 'clamp(2.8rem, 6.4vw, 5.5rem)',
                lineHeight: 0.96,
                fontWeight: 400,
                letterSpacing: '-0.025em',
                margin: 0,
                color: THEME.ink,
              }}
            >
              Find the subscriptions{' '}
              <span style={{ fontStyle: 'italic', color: THEME.rust }}>
                quietly leaking
              </span>{' '}
              your money.
            </h1>
            <p
              style={{
                marginTop: 22,
                fontSize: 'clamp(1rem, 1.4vw, 1.18rem)',
                lineHeight: 1.55,
                color: THEME.inkSoft,
                maxWidth: 620,
              }}
            >
              Paste your transactions or drop a bank statement PDF. We'll
              surface every recurring charge and total the damage —{' '}
              <span style={{ color: THEME.ink, fontWeight: 500 }}>
                no login, no bank connection, nothing leaves your device.
              </span>
            </p>
            <div
              style={{
                display: 'flex',
                gap: 18,
                marginTop: 24,
                flexWrap: 'wrap',
              }}
            >
              {[
                { icon: Lock, label: 'No login required' },
                { icon: Shield, label: 'No bank connection' },
                { icon: Zap, label: 'Runs in your browser' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    color: THEME.inkSoft,
                  }}
                >
                  <Icon size={14} strokeWidth={2} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Input card */}
          <section
            style={{
              background: THEME.card,
              border: `1px solid ${THEME.rule}`,
              borderRadius: 18,
              padding: 'clamp(20px, 2.5vw, 32px)',
              boxShadow: THEME.shadow,
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  alignItems: 'center',
                  fontSize: 12,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: THEME.inkMute,
                }}
                className="sld-mono"
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: THEME.rust,
                  }}
                />
                Step 1 — Give us your transactions
              </div>
              <button
                onClick={useSample}
                className="sld-link"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  paddingBottom: 1,
                }}
              >
                Try with sample data
              </button>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
              }}
              style={{ position: 'relative' }}
            >
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 13,
                  fontStyle: 'italic',
                  color: THEME.inkMute,
                  marginBottom: 10,
                  lineHeight: 1.5,
                }}
              >
                Tip: paste 2–3 months of statements together for the cleanest
                results. Most subscriptions only show up once per statement,
                so a single month surfaces them as “likely recurring” rather
                than confirmed. Want extra peace of mind? Black out your name
                or account number first — the detector only reads merchant
                rows.
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Paste rows from your statement, e.g.\n\n12 Mar 2025 - Netflix - $15.99\n10 Mar 2025 - Spotify - $10.99\n08 Feb 2025 - Netflix - $15.99\n\n…or drag a PDF anywhere on this card.`}
                spellCheck={false}
                className="sld-textarea sld-mono"
                style={{
                  width: '100%',
                  minHeight: 220,
                  resize: 'vertical',
                  background: dragOver ? '#fbf6e8' : THEME.paper,
                  border: `1.5px ${dragOver ? 'dashed' : 'solid'} ${
                    dragOver ? THEME.rust : THEME.rule
                  }`,
                  borderRadius: 12,
                  padding: 18,
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  color: THEME.ink,
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: FONTS.mono,
                  transition: 'border-color 0.18s, background 0.18s',
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = THEME.ink)
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = dragOver ? THEME.rust : THEME.rule)
                }
              />
              {dragOver && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    color: THEME.rust,
                    fontFamily: FONTS.display,
                    fontSize: 22,
                    fontStyle: 'italic',
                  }}
                >
                  Drop the PDF to scan
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: 18,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'transparent',
                  color: THEME.ink,
                  border: `1px solid ${THEME.rule}`,
                  padding: '12px 18px',
                  borderRadius: 999,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.18s, color 0.18s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = THEME.ink;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = THEME.rule;
                }}
              >
                <Upload size={15} strokeWidth={2} />
                {pdfName ? `PDF: ${pdfName}` : 'Upload PDF statement'}
              </button>
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 13,
                  fontStyle: 'italic',
                  color: THEME.inkMute,
                  whiteSpace: 'nowrap',
                }}
              >
                or drop a PDF on the box
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf,.pdf"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  // Clear AFTER capturing the file so re-uploading the same
                  // file works (browsers suppress change events on duplicate
                  // selections otherwise).
                  e.target.value = '';
                  handleFile(file);
                }}
              />
              {(text || pdfName) && (
                <button
                  onClick={reset}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'transparent',
                    color: THEME.inkMute,
                    border: 'none',
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <X size={14} /> Clear
                </button>
              )}

              <div style={{ flex: 1 }} />

              <button
                onClick={() => runScan()}
                disabled={scanning}
                className="sld-btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  border: 'none',
                  padding: '14px 26px',
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: scanning ? 'wait' : 'pointer',
                  fontFamily: 'inherit',
                  opacity: scanning ? 0.85 : 1,
                  letterSpacing: '0.01em',
                }}
              >
                {scanning ? (
                  <>
                    <Loader2 size={16} className="sld-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    Scanning…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} strokeWidth={2.2} />
                    Scan my subscriptions
                    <ArrowRight size={15} strokeWidth={2.2} />
                  </>
                )}
              </button>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {error && (
              <div
                style={{
                  marginTop: 14,
                  padding: '10px 14px',
                  background: '#fbe9e3',
                  border: `1px solid ${THEME.rust}40`,
                  color: THEME.rustDeep,
                  borderRadius: 10,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <div
              style={{
                marginTop: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: THEME.inkMute,
              }}
            >
              <Shield size={12} />
              <span>
                Everything is processed locally in your browser. We never
                upload, store, or see your data.
              </span>
            </div>
          </section>

          {/* Results */}
          <section ref={resultsRef} style={{ marginTop: 36 }}>
            {scanning && !results && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 0',
                  color: THEME.inkSoft,
                }}
              >
                <div
                  className="sld-mono"
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}
                >
                  Sniffing for leaks
                </div>
                <div
                  style={{
                    width: 220,
                    height: 3,
                    background: THEME.rule,
                    borderRadius: 99,
                    margin: '0 auto',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="sld-shimmer"
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
              </div>
            )}

            {results && (
              <div className="sld-fade-up">
                {/* Big headline number */}
                <div
                  style={{
                    borderTop: `1px solid ${THEME.rule}`,
                    borderBottom: `1px solid ${THEME.rule}`,
                    padding: '36px 0',
                    marginBottom: 28,
                    position: 'relative',
                  }}
                >
                  <div
                    className="sld-mono"
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: THEME.rust,
                      marginBottom: 10,
                    }}
                  >
                    The verdict
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.display,
                      fontStyle: 'italic',
                      fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                      color: THEME.inkSoft,
                      marginBottom: 8,
                    }}
                  >
                    You're spending approximately
                  </div>
                  <div
                    className="sld-mono sld-display-xl"
                    style={{
                      fontSize: 'clamp(2.6rem, 9vw, 5.6rem)',
                      fontWeight: 500,
                      color: THEME.ink,
                      letterSpacing: '-0.04em',
                      lineHeight: 0.95,
                    }}
                  >
                    {currency}
                    {results.totalYearly.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                    <span
                      style={{
                        fontSize: '0.36em',
                        color: THEME.inkMute,
                        fontWeight: 400,
                        marginLeft: 12,
                      }}
                    >
                      /year on subscriptions
                    </span>
                  </div>
                  {results.suspectedYearly > 0 && (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 13,
                        color: THEME.inkMute,
                        fontFamily: FONTS.display,
                        fontStyle: 'italic',
                        lineHeight: 1.5,
                      }}
                    >
                      {results.confirmedCount === 0 ? (
                        <>
                          Estimate based on charges that look recurring but
                          haven't been confirmed across enough statements yet.
                          Paste another month or two to firm this up.
                        </>
                      ) : (
                        <>
                          {currency}
                          {results.confirmedYearly.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                          /yr confirmed · {currency}
                          {results.suspectedYearly.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                          /yr likely recurring (estimated).
                        </>
                      )}
                    </div>
                  )}
                  <div
                    style={{
                      marginTop: 16,
                      display: 'flex',
                      gap: 28,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Stat
                      label="Per month"
                      value={`${currency}${results.totalMonthly.toFixed(2)}`}
                    />
                    <Stat
                      label="Confirmed subs"
                      value={results.confirmedCount.toString()}
                    />
                    {results.suspectedCount > 0 && (
                      <Stat
                        label="Likely recurring"
                        value={results.suspectedCount.toString()}
                        accent={THEME.amber}
                      />
                    )}
                    <Stat
                      label="Transactions read"
                      value={results.txnCount.toString()}
                    />
                  </div>
                </div>

                {/* Subscriptions list */}
                <div style={{ marginBottom: 36 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: 6,
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <h2
                      className="sld-display"
                      style={{
                        fontSize: 'clamp(1.5rem, 2.4vw, 2rem)',
                        fontWeight: 400,
                        margin: 0,
                        letterSpacing: '-0.015em',
                      }}
                    >
                      Detected recurring charges
                    </h2>
                    <button
                      onClick={() => setShowRaw((v) => !v)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: THEME.inkMute,
                        fontSize: 13,
                        fontFamily: 'inherit',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {showRaw ? <EyeOff size={13} /> : <Eye size={13} />}
                      {showRaw ? 'Hide' : 'Show'} parsed text
                    </button>
                  </div>
                  {results.subs.length === 0 ? (
                    <div
                      style={{
                        padding: '32px 24px',
                        textAlign: 'center',
                        color: THEME.inkSoft,
                        background: THEME.paperDeep,
                        borderRadius: 12,
                        marginTop: 12,
                      }}
                    >
                      <div
                        className="sld-display"
                        style={{
                          fontSize: 22,
                          fontStyle: 'italic',
                          marginBottom: 8,
                        }}
                      >
                        No recurring charges spotted.
                      </div>
                      <div style={{ fontSize: 14 }}>
                        Either you're a subscription saint, or the format
                        wasn't recognised. Try pasting more rows or a longer
                        date range.
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: 8 }}>
                      {results.subs.map((s, i) => (
                        <SubRow key={s.key} sub={s} idx={i} currency={currency} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Insight callout */}
                {results.subs.length > 0 && (
                  <div
                    style={{
                      background: THEME.ink,
                      color: THEME.paper,
                      borderRadius: 16,
                      padding: 'clamp(22px, 3vw, 32px)',
                      marginBottom: 28,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className="sld-grain"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.4,
                        pointerEvents: 'none',
                      }}
                    />
                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        gap: 24,
                        flexWrap: 'wrap',
                        alignItems: 'center',
                      }}
                    >
                      <TrendingDown
                        size={48}
                        strokeWidth={1}
                        style={{ color: THEME.rust, flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <div
                          className="sld-mono"
                          style={{
                            fontSize: 11,
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            color: THEME.amber,
                            marginBottom: 8,
                          }}
                        >
                          Insight
                        </div>
                        <div
                          className="sld-display"
                          style={{
                            fontSize: 'clamp(1.3rem, 2.4vw, 1.85rem)',
                            lineHeight: 1.25,
                            fontWeight: 400,
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {buildInsight(results, currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* After-results ad — best monetisation slot */}
                <AdSlot position="after-results" variant="inline" />

                {/* Share + Scan-another card.
                    Replaces the old premium teaser. Designed for an ad-supported
                    model: the share CTA drives viral acquisition (more pageviews
                    = more ad impressions), and the scan-another CTA keeps the
                    current user on the page longer (more impressions per session
                    + more confirmed detections). Both compound the ad business. */}
                <div
                  style={{
                    marginTop: 28,
                    padding: 'clamp(22px, 3vw, 30px)',
                    border: `1px solid ${THEME.rule}`,
                    borderRadius: 16,
                    background: `linear-gradient(180deg, ${THEME.card} 0%, ${THEME.paperDeep} 100%)`,
                  }}
                >
                  <div
                    className="sld-mono"
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: THEME.rust,
                      marginBottom: 10,
                    }}
                  >
                    What now
                  </div>
                  <div
                    className="sld-display"
                    style={{
                      fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)',
                      fontWeight: 400,
                      letterSpacing: '-0.015em',
                      marginBottom: 18,
                      lineHeight: 1.2,
                    }}
                  >
                    Found something surprising? Share it — or scan another month
                    to firm up the suspected ones.
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      onClick={() => {
                        const yr = Math.round(results.totalYearly);
                        const shareText = `I just found ${currency}${yr.toLocaleString()}/year of subscriptions in my bank statement using The Leak Detector — runs in your browser, no login. ${window.location.origin}`;
                        if (navigator.share) {
                          navigator
                            .share({
                              title: 'The Leak Detector',
                              text: shareText,
                            })
                            .catch(() => {});
                        } else if (navigator.clipboard) {
                          navigator.clipboard.writeText(shareText);
                          setShareCopied(true);
                          setTimeout(() => setShareCopied(false), 2000);
                        }
                      }}
                      style={{
                        background: THEME.ink,
                        color: THEME.paper,
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: 999,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        gap: 8,
                        alignItems: 'center',
                        fontWeight: 500,
                      }}
                    >
                      {shareCopied ? (
                        <>
                          <Check size={14} strokeWidth={2.4} /> Copied
                        </>
                      ) : (
                        <>
                          <Clipboard size={14} strokeWidth={2.2} /> Share my
                          result
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        reset();
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 50);
                      }}
                      style={{
                        background: 'transparent',
                        color: THEME.ink,
                        border: `1px solid ${THEME.ink}`,
                        padding: '12px 20px',
                        borderRadius: 999,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        gap: 8,
                        alignItems: 'center',
                        fontWeight: 500,
                      }}
                    >
                      <ArrowRight size={14} strokeWidth={2.2} /> Scan another
                      statement
                    </button>
                  </div>
                  <div
                    style={{
                      marginTop: 14,
                      fontSize: 12,
                      color: THEME.inkMute,
                      fontStyle: 'italic',
                      fontFamily: FONTS.display,
                      lineHeight: 1.5,
                    }}
                  >
                    Adding a second or third month makes the suspected ones
                    confirm into proper monthly subscriptions.
                  </div>
                </div>

                {showRaw && (
                  <div
                    style={{
                      marginTop: 24,
                      padding: 16,
                      background: THEME.paper,
                      border: `1px solid ${THEME.rule}`,
                      borderRadius: 12,
                      maxHeight: 280,
                      overflow: 'auto',
                    }}
                  >
                    <div
                      className="sld-mono"
                      style={{
                        fontSize: 11,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: THEME.inkMute,
                        marginBottom: 10,
                      }}
                    >
                      Parsed transactions ({results.txnCount})
                    </div>
                    <pre
                      className="sld-mono"
                      style={{
                        margin: 0,
                        fontSize: 12,
                        lineHeight: 1.5,
                        color: THEME.inkSoft,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {parseTransactions(text)
                        .map(
                          (t) =>
                            `${t.date.toISOString().slice(0, 10)}  ${t.merchant.padEnd(28).slice(0, 28)}  ${currency}${t.amount.toFixed(2)}`
                        )
                        .join('\n') || 'Nothing parseable.'}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Trust footer */}
          <section
            style={{
              marginTop: 56,
              paddingTop: 32,
              borderTop: `1px solid ${THEME.rule}`,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 24,
              }}
            >
              {[
                {
                  icon: Lock,
                  title: 'No login, ever',
                  body: 'No account creation. No email. Just paste and scan.',
                },
                {
                  icon: Shield,
                  title: 'No bank connection',
                  body: 'We never ask for credentials. You stay in full control.',
                },
                {
                  icon: Zap,
                  title: 'In-browser processing',
                  body: 'Your statement never leaves this page. Refresh and it\u2019s gone.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title}>
                  <Icon size={18} strokeWidth={1.6} style={{ color: THEME.rust }} />
                  <div
                    className="sld-display"
                    style={{
                      marginTop: 10,
                      fontSize: 18,
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 13.5,
                      color: THEME.inkSoft,
                      lineHeight: 1.5,
                    }}
                  >
                    {body}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 32,
                fontSize: 12,
                color: THEME.inkMute,
                textAlign: 'center',
              }}
            >
              Detection works best on statements with clear date · merchant ·
              amount rows. Got a format that doesn't parse?{' '}
              <a
                href="mailto:misbau1975coding@gmail.com?subject=Statement%20format%20feedback&body=Hi%2C%0A%0AThe%20detector%20didn%27t%20parse%20my%20statement%20well.%20A%20few%20details%20that%20might%20help%3A%0A%0A-%20Bank%20%2F%20card%20issuer%3A%0A-%20Country%3A%0A-%20What%20I%20expected%20to%20see%3A%0A-%20What%20it%20showed%20instead%3A%0A%0A%28Feel%20free%20to%20paste%20a%20redacted%20sample%20row%20or%20two%20below.%29%0A%0AThanks%21"
                style={{
                  color: THEME.rust,
                  textDecoration: 'underline',
                }}
              >
                Tell us
              </a>
              {' '}— we'll teach the detector.
            </div>
            <div
              style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: `1px solid ${THEME.ruleSoft}`,
                display: 'flex',
                gap: 18,
                justifyContent: 'center',
                flexWrap: 'wrap',
                fontSize: 12,
                color: THEME.inkMute,
              }}
            >
              <a
                href="#/privacy"
                style={{ color: THEME.inkMute, textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = THEME.ink)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = THEME.inkMute)
                }
              >
                Privacy Policy
              </a>
              <span style={{ opacity: 0.4 }}>·</span>
              <a
                href="#/terms"
                style={{ color: THEME.inkMute, textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = THEME.ink)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = THEME.inkMute)
                }
              >
                Terms of Use
              </a>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>© {new Date().getFullYear()} The Leak Detector</span>
            </div>
          </section>
        </main>

        {/* Right ad — desktop only */}
        <div className="hidden lg:block">
          <AdSlot position="right-sidebar" stickyTop={96} />
        </div>
      </div>

      {/* Hide ad columns on mobile via CSS — Tailwind alternative */}
      <style>{`
        @media (max-width: 1100px) {
          .sld-main-grid { grid-template-columns: 1fr !important; }
          .sld-main-grid > .hidden.lg\\:block { display: none !important; }
        }
        @media (min-width: 1101px) {
          .lg\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div>
      <div
        className="sld-mono"
        style={{
          fontSize: 10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: THEME.inkMute,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        className="sld-mono"
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: accent || THEME.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function buildInsight(results, currency) {
  const top = results.subs[0];
  const flagged = results.subs.filter((s) => s.flagged);
  if (!top) return 'No recurring charges detected in this batch.';

  if (flagged.length > 0) {
    const f = flagged[0];
    return (
      <>
        <span style={{ color: THEME.amber }}>
          {f.name}
        </span>{' '}
        looks unfamiliar — {currency}
        {f.yearlyCost.toFixed(0)}/year you might not remember signing up for.
        Cancelling just that one would save you{' '}
        <span style={{ fontStyle: 'italic' }}>
          {currency}
          {f.yearlyCost.toFixed(0)}
        </span>{' '}
        a year.
      </>
    );
  }

  return (
    <>
      Your biggest leak is{' '}
      <span style={{ color: THEME.rust }}>{top.name}</span> at {currency}
      {top.yearlyCost.toFixed(0)}/year. If you cut your three smallest
      subscriptions, you'd save roughly{' '}
      <span style={{ fontStyle: 'italic' }}>
        {currency}
        {results.subs
          .slice(-3)
          .reduce((s, x) => s + x.yearlyCost, 0)
          .toFixed(0)}
      </span>{' '}
      annually.
    </>
  );
}
