#!/usr/bin/env node
/**
 * Generates the illustrative SVG artwork used by Rescue Beacon.
 *
 * These are deliberately stylised, human-made vector scenes — not photos and not
 * AI-generated imagery. The Stories page labels them as illustrations. Replace
 * them with real, consent-cleared photographs whenever you have them.
 *
 * Run with: npm run assets
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const OUT = join(here, '..', 'public')

const svg = (w, h, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
  (defs ? `<defs>${defs}</defs>` : '') +
  body +
  '</svg>'

const lin = (id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">` +
  stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('') +
  '</linearGradient>'

const rad = (id, stops, cx = 0.5, cy = 0.5, r = 0.5) =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">` +
  stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('') +
  '</radialGradient>'

const g = (x, y, s, body) => `<g transform="translate(${x} ${y}) scale(${s})">${body}</g>`

const paw = (x, y, s, fill, opacity = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}" opacity="${opacity}">` +
  '<ellipse cx="0" cy="13" rx="17" ry="13"/>' +
  '<ellipse cx="-20" cy="-6" rx="8" ry="11" transform="rotate(-18 -20 -6)"/>' +
  '<ellipse cx="-7" cy="-19" rx="7.6" ry="10"/>' +
  '<ellipse cx="8" cy="-19" rx="7.6" ry="10"/>' +
  '<ellipse cx="21" cy="-6" rx="8" ry="11" transform="rotate(18 21 -6)"/>' +
  '</g>'

const heart = (x, y, s, fill, opacity = 1) =>
  `<path transform="translate(${x} ${y}) scale(${s})" fill="${fill}" opacity="${opacity}" d="M0 12 C-22 -4 -25 -20 -13 -26 C-5 -30 0 -23 0 -17 C0 -23 5 -30 13 -26 C25 -20 22 -4 0 12 Z"/>`

const sparkle = (x, y, s, fill, opacity = 1) =>
  `<path transform="translate(${x} ${y}) scale(${s})" fill="${fill}" opacity="${opacity}" d="M0 -13 L3.4 -3.4 L13 0 L3.4 3.4 L0 13 L-3.4 3.4 L-13 0 L-3.4 -3.4 Z"/>`

const drop = (x, y, s, fill, opacity = 1) =>
  `<path transform="translate(${x} ${y}) scale(${s})" fill="${fill}" opacity="${opacity}" d="M0 -13 C8 -3 11 4 7 9 C4 14 -4 14 -7 9 C-11 4 -8 -3 0 -13 Z"/>`

const sun = (cx, cy, r, fill = '#f0a63c') => {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6
    const x1 = cx + Math.cos(a) * (r + 14)
    const y1 = cy + Math.sin(a) * (r + 14)
    const x2 = cx + Math.cos(a) * (r + 32)
    const y2 = cy + Math.sin(a) * (r + 32)
    return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${fill}" stroke-width="6" stroke-linecap="round" opacity=".7"/>`
  }).join('')
  return `<g>${rays}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.8}" fill="#ffd27a" opacity=".55"/></g>`
}

const bandage = (x, y, r = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${r})">` +
  '<rect x="-27" y="-10" width="54" height="20" rx="9" fill="#fdf7ea" opacity=".95"/>' +
  '<path d="M-8 -10 V 10 M8 -10 V 10" stroke="#d9c3a0" stroke-width="4"/>' +
  '</g>'

const grass = (color, flip = false) => {
  const blades = [
    [0, 0, -6, -54],
    [10, 0, 18, -70],
    [22, 0, 38, -48],
    [34, 0, 58, -64],
    [48, 0, 76, -38],
  ]
  return `<g transform="${flip ? 'scale(-1 1)' : ''}" stroke="${color}" stroke-width="7" stroke-linecap="round" fill="none">` +
    blades.map(([x, y, x2, y2]) => `<path d="M${x} ${y} Q ${(x + x2) / 2} ${y2 * 0.6} ${x2} ${y2}"/>`).join('') +
    '</g>'
}

/* ── Animal portraits ─────────────────────────────────────── */

function dog({ coat = '#d99a5b', dark = '#b3743a', light = '#f6dcb8', collar = '#0f4c46', mood = 'after', patch = false, wire = false, bandana = null }) {
  const happy = mood === 'after'
  return `
  <g>
    <path d="M-150 250 C-142 168 -78 138 0 138 C78 138 142 168 150 250 Z" fill="${dark}"/>
    <ellipse cx="-116" cy="-4" rx="38" ry="88" fill="${dark}" transform="rotate(15 -116 -4)"/>
    <ellipse cx="116" cy="-4" rx="38" ry="88" fill="${dark}" transform="rotate(-15 116 -4)"/>
    <path d="M-120 10 C-130 -66 -74 -116 0 -116 C74 -116 130 -66 120 10 C110 88 56 126 0 126 C-56 126 -110 88 -120 10 Z" fill="${coat}"/>
    ${patch ? `<ellipse cx="-58" cy="-54" rx="44" ry="34" fill="${dark}" opacity=".5" transform="rotate(-18 -58 -54)"/>` : ''}
    <ellipse cx="0" cy="52" rx="66" ry="50" fill="${light}"/>
    ${happy
      ? `<ellipse cx="-47" cy="-22" rx="10" ry="13" fill="#243029"/>
         <ellipse cx="47" cy="-22" rx="10" ry="13" fill="#243029"/>
         <circle cx="-50" cy="-26" r="3.2" fill="#fff" opacity=".8"/>
         <circle cx="44" cy="-26" r="3.2" fill="#fff" opacity=".8"/>
         <path d="M-72 -52 Q -49 -64 -30 -50" fill="none" stroke="${dark}" stroke-width="5" stroke-linecap="round"/>
         <path d="M30 -50 Q 49 -64 72 -52" fill="none" stroke="${dark}" stroke-width="5" stroke-linecap="round"/>`
      : `<path d="M-62 -25 Q -47 -39 -32 -25" fill="none" stroke="#243029" stroke-width="5" stroke-linecap="round"/>
         <path d="M32 -25 Q 47 -39 62 -25" fill="none" stroke="#243029" stroke-width="5" stroke-linecap="round"/>
         <circle cx="-54" cy="-6" r="3.4" fill="#8fc3c9" opacity=".8"/>
         <circle cx="54" cy="-6" r="3.4" fill="#8fc3c9" opacity=".8"/>`}
    <path d="M-22 22 C-12 15 12 15 22 22 C26 38 12 54 0 56 C-12 54 -26 38 -22 22 Z" fill="#26332d"/>
    <ellipse cx="-7" cy="28" rx="5" ry="2.6" fill="#fff" opacity=".3"/>
    ${happy
      ? `<path d="M-26 66 Q 0 88 26 66" fill="none" stroke="#26332d" stroke-width="4" stroke-linecap="round"/>
         <path d="M-11 78 Q 0 98 11 78 Z" fill="#ef8a8a"/>`
      : `<path d="M-26 74 Q 0 64 26 74" fill="none" stroke="#26332d" stroke-width="4" stroke-linecap="round"/>`}
    ${wire ? '<path d="M-104 130 C-50 160 50 160 104 130" fill="none" stroke="#8d8d8d" stroke-width="6"/>' : ''}
    <path d="M-102 128 C-58 160 58 160 102 128 L106 154 C58 186 -58 186 -106 154 Z" fill="${collar}"/>
    ${bandana ? `<path d="M-62 150 L0 214 L62 150 Z" fill="${bandana}"/>` : ''}
    <circle cx="0" cy="170" r="15" fill="#f5b942"/>
    ${paw(0, 170, 0.34, collar)}
  </g>`
}

function cat({ fur = '#e9c89a', dark = '#c99a62', light = '#f7ead4', eye = '#3f8f5a', mood = 'after' }) {
  const happy = mood === 'after'
  return `
  <g>
    <path d="M-108 250 C-100 170 -50 140 0 140 C50 140 100 170 108 250 Z" fill="${dark}"/>
    <path d="M-112 -30 L-98 -180 L-16 -92 Z" fill="${fur}"/>
    <path d="M112 -30 L98 -180 L16 -92 Z" fill="${fur}"/>
    <path d="M-96 -56 L-90 -144 L-40 -88 Z" fill="#e8a3a3" opacity=".65"/>
    <path d="M96 -56 L90 -144 L40 -88 Z" fill="#e8a3a3" opacity=".65"/>
    <circle cx="0" cy="0" r="116" fill="${fur}"/>
    <g stroke="${dark}" stroke-width="10" stroke-linecap="round" opacity=".5" fill="none">
      <path d="M-26 -114 Q -22 -88 -24 -70"/>
      <path d="M0 -118 V -72"/>
      <path d="M26 -114 Q 22 -88 24 -70"/>
    </g>
    <ellipse cx="-52" cy="52" rx="34" ry="26" fill="${light}" opacity=".6"/>
    <ellipse cx="52" cy="52" rx="34" ry="26" fill="${light}" opacity=".6"/>
    ${happy
      ? `<ellipse cx="-44" cy="-12" rx="19" ry="23" fill="${eye}"/>
         <ellipse cx="-44" cy="-12" rx="5" ry="17" fill="#1c2b24"/>
         <circle cx="-50" cy="-20" r="4" fill="#fff" opacity=".85"/>
         <ellipse cx="44" cy="-12" rx="19" ry="23" fill="${eye}"/>
         <ellipse cx="44" cy="-12" rx="5" ry="17" fill="#1c2b24"/>
         <circle cx="38" cy="-20" r="4" fill="#fff" opacity=".85"/>`
      : `<path d="M-62 -14 Q -44 -30 -26 -14" fill="none" stroke="#4b3c30" stroke-width="5" stroke-linecap="round"/>
         <ellipse cx="44" cy="-12" rx="17" ry="21" fill="${eye}" opacity=".7"/>
         <ellipse cx="44" cy="-12" rx="4.6" ry="15" fill="#1c2b24"/>
         <circle cx="37" cy="-19" r="3.4" fill="#fff" opacity=".8"/>
         <path d="M-52 16 C-44 24 -34 24 -26 16" fill="none" stroke="#d98b86" stroke-width="4" stroke-linecap="round"/>`}
    <path d="M-9 36 L9 36 L0 46 Z" fill="#d97b8a"/>
    <path d="M0 46 V 54 M0 54 Q -12 64 -20 54 M0 54 Q 12 64 20 54" fill="none" stroke="#5b4a3f" stroke-width="3" stroke-linecap="round"/>
    <g stroke="${dark}" stroke-width="2.5" stroke-linecap="round" opacity=".65">
      <path d="M-38 44 L-104 34"/><path d="M-40 54 L-108 56"/><path d="M-36 64 L-100 80"/>
      <path d="M38 44 L104 34"/><path d="M40 54 L108 56"/><path d="M36 64 L100 80"/>
    </g>
  </g>`
}

function cow({ hide = '#f3e6d2', spot = '#8a6a52', horn = '#e7d3ad', mood = 'after' }) {
  const happy = mood === 'after'
  return `
  <g>
    <path d="M-140 260 C-130 180 -70 150 0 150 C70 150 130 180 140 260 Z" fill="${hide}"/>
    <ellipse cx="-128" cy="-8" rx="48" ry="24" fill="${hide}" transform="rotate(-16 -128 -8)"/>
    <ellipse cx="128" cy="-8" rx="48" ry="24" fill="${hide}" transform="rotate(16 128 -8)"/>
    <path d="M-70 -108 C-102 -158 -72 -188 -42 -172" fill="none" stroke="${horn}" stroke-width="17" stroke-linecap="round"/>
    <path d="M70 -108 C102 -158 72 -188 42 -172" fill="none" stroke="${horn}" stroke-width="17" stroke-linecap="round"/>
    <ellipse cx="0" cy="0" rx="118" ry="124" fill="${hide}"/>
    <path d="M-88 -66 C-58 -88 -26 -80 -20 -50 C-20 -20 -58 -12 -92 -30 Z" fill="${spot}" opacity=".65"/>
    <path d="M60 14 C94 4 112 26 100 50 C84 70 56 62 50 40 Z" fill="${spot}" opacity=".55"/>
    <path d="M-14 -104 C0 -118 22 -118 34 -102 C24 -88 4 -88 -14 -104 Z" fill="${spot}" opacity=".45"/>
    <ellipse cx="0" cy="62" rx="72" ry="52" fill="#f7c9b4"/>
    <ellipse cx="-26" cy="58" rx="9" ry="13" fill="#c98f7d"/>
    <ellipse cx="26" cy="58" rx="9" ry="13" fill="#c98f7d"/>
    ${happy
      ? `<ellipse cx="-46" cy="-24" rx="11" ry="14" fill="#2b2a24"/>
         <ellipse cx="46" cy="-24" rx="11" ry="14" fill="#2b2a24"/>
         <circle cx="-49" cy="-29" r="3.4" fill="#fff" opacity=".8"/>
         <circle cx="43" cy="-29" r="3.4" fill="#fff" opacity=".8"/>
         <path d="M-30 86 Q 0 104 30 86" fill="none" stroke="#8f5b4c" stroke-width="4" stroke-linecap="round"/>`
      : `<path d="M-60 -26 Q -46 -38 -32 -26" fill="none" stroke="#2b2a24" stroke-width="5" stroke-linecap="round"/>
         <path d="M32 -26 Q 46 -38 60 -26" fill="none" stroke="#2b2a24" stroke-width="5" stroke-linecap="round"/>
         <path d="M-28 92 Q 0 82 28 92" fill="none" stroke="#8f5b4c" stroke-width="4" stroke-linecap="round"/>`}
    ${happy
      ? `<g>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = Math.PI + (i * Math.PI) / 7
          return `<circle cx="${Math.cos(a) * 118}" cy="${145 + Math.sin(a) * 28}" r="9" fill="${i % 2 ? '#f0a63c' : '#e2602c'}"/>`
        }).join('')}</g>`
      : `<g fill="#8a6a52" opacity=".35"><ellipse cx="-78" cy="96" rx="20" ry="10" transform="rotate(-16 -78 96)"/><ellipse cx="84" cy="118" rx="16" ry="8" transform="rotate(12 84 118)"/></g>`}
  </g>`
}

function bird({ body = '#5ea7c9', wing = '#3d7f9e', belly = '#e8f2f5', mood = 'after' }) {
  const happy = mood === 'after'
  return `
  <g>
    <path d="M-250 158 Q 0 126 250 164" fill="none" stroke="#8a6a4a" stroke-width="16" stroke-linecap="round"/>
    <path d="M-40 150 L-40 132 M20 150 L20 132" stroke="#8a6a4a" stroke-width="7" stroke-linecap="round"/>
    <path d="M-10 30 C 44 32 94 74 96 134 C 98 190 48 220 -12 212 C -68 204 -96 158 -86 108 C -78 58 -52 28 -10 30 Z" fill="${body}"/>
    <path d="M-8 78 C 30 88 54 118 48 154 C 18 172 -22 158 -38 128 Z" fill="${belly}"/>
    <path d="M-86 132 C -142 122 -178 152 -192 190 C -150 200 -110 190 -84 168 Z" fill="${wing}" opacity=".8"/>
    <circle cx="24" cy="-34" r="63" fill="${body}"/>
    <path d="M-30 -86 C -6 -108 30 -104 54 -80 C 34 -92 2 -92 -30 -86 Z" fill="${wing}"/>
    <path d="M82 -40 L146 -20 L82 -2 Z" fill="#f0a63c"/>
    <circle cx="42" cy="-44" r="8" fill="#243029"/>
    <circle cx="45" cy="-47" r="2.6" fill="#fff" opacity=".9"/>
    <path d="M-8 92 C 32 82 62 104 60 140 C 32 158 0 146 -14 120 Z" fill="${wing}"/>
    ${happy
      ? '<path d="M4 108 C 28 108 42 122 40 136" fill="none" stroke="#8ccbd2" stroke-width="4" stroke-linecap="round" opacity=".75"/>'
      : bandage(26, 120, 22)}
  </g>`
}

function rabbit({ fur = '#cdb59a', dark = '#a98f74', light = '#f3e8d8', ear = '#e3aaa9', mood = 'after' }) {
  const happy = mood === 'after'
  return `
  <g>
    <ellipse cx="0" cy="244" rx="132" ry="34" fill="#3f5a45" opacity=".22"/>
    <ellipse cx="0" cy="156" rx="112" ry="104" fill="${fur}"/>
    <ellipse cx="-66" cy="226" rx="42" ry="23" fill="${light}" opacity=".85"/>
    <ellipse cx="66" cy="226" rx="42" ry="23" fill="${light}" opacity=".85"/>
    <ellipse cx="-55" cy="-118" rx="30" ry="126" fill="${fur}" transform="rotate(-9 -55 -118)"/>
    <ellipse cx="55" cy="-118" rx="30" ry="126" fill="${fur}" transform="rotate(9 55 -118)"/>
    <ellipse cx="-55" cy="-118" rx="15" ry="100" fill="${ear}" opacity=".72" transform="rotate(-9 -55 -118)"/>
    <ellipse cx="55" cy="-118" rx="15" ry="100" fill="${ear}" opacity=".72" transform="rotate(9 55 -118)"/>
    <circle cx="0" cy="16" r="102" fill="${fur}"/>
    <ellipse cx="0" cy="70" rx="49" ry="37" fill="${light}"/>
    <ellipse cx="-72" cy="44" rx="26" ry="18" fill="${light}" opacity=".35"/>
    <ellipse cx="72" cy="44" rx="26" ry="18" fill="${light}" opacity=".35"/>
    ${happy
      ? `<circle cx="-37" cy="4" r="10" fill="#2b2a24"/>
         <circle cx="37" cy="4" r="10" fill="#2b2a24"/>
         <circle cx="-40" cy="0" r="3.2" fill="#fff" opacity=".9"/>
         <circle cx="34" cy="0" r="3.2" fill="#fff" opacity=".9"/>`
      : `<path d="M-51 4 Q -37 -8 -23 4" fill="none" stroke="#4b3c30" stroke-width="5" stroke-linecap="round"/>
         <path d="M23 4 Q 37 -8 51 4" fill="none" stroke="#4b3c30" stroke-width="5" stroke-linecap="round"/>`}
    <path d="M-13 47 Q 0 39 13 47 Q 8 58 0 58 Q -8 58 -13 47 Z" fill="#d97b8a"/>
    <path d="M0 58 V 66 M0 66 Q -12 78 -22 66 M0 66 Q 12 78 22 66" fill="none" stroke="#5b4a3f" stroke-width="3.4" stroke-linecap="round"/>
    <g stroke="${dark}" stroke-width="2.6" stroke-linecap="round" opacity=".6">
      <path d="M-42 58 L-112 48"/><path d="M-44 68 L-116 74"/>
      <path d="M42 58 L112 48"/><path d="M44 68 L116 74"/>
    </g>
  </g>`
}

function tortoise({ shell = '#7b5c3a', shellDark = '#56402a', shellLight = '#c9a06a', skin = '#8b8967', mood = 'after' }) {
  const happy = mood === 'after'
  return `
  <g>
    <ellipse cx="0" cy="214" rx="218" ry="38" fill="#3f5a45" opacity=".22"/>
    <ellipse cx="-138" cy="168" rx="50" ry="33" fill="${skin}" transform="rotate(-10 -138 168)"/>
    <ellipse cx="132" cy="168" rx="50" ry="33" fill="${skin}" transform="rotate(10 132 168)"/>
    <path d="M-196 128 C-196 2 -118 -104 0 -104 C118 -104 196 2 196 128 Z" fill="${shell}"/>
    <path d="M-202 124 C-166 158 166 158 202 124 L194 152 C158 186 -158 186 -194 152 Z" fill="${shellDark}"/>
    <path d="M0 -96 L-64 -24 L-36 68 L36 68 L64 -24 Z" fill="${shellLight}" opacity=".4"/>
    <g fill="none" stroke="${shellDark}" stroke-width="5" stroke-linecap="round" opacity=".55">
      <path d="M0 -96 L0 -118"/><path d="M-64 -24 L-146 8"/><path d="M64 -24 L146 8"/>
      <path d="M-36 68 L-104 116"/><path d="M36 68 L104 116"/>
    </g>
    <g fill="${shellLight}" opacity=".28">
      <ellipse cx="-118" cy="46" rx="34" ry="26"/>
      <ellipse cx="118" cy="46" rx="34" ry="26"/>
      <ellipse cx="0" cy="-50" rx="30" ry="24"/>
    </g>
    <path d="M166 112 C214 92 250 108 258 138 C266 172 234 196 198 182 C180 174 168 154 166 136 Z" fill="${skin}"/>
    <path d="M198 180 C216 190 238 188 250 176" fill="none" stroke="${shellDark}" stroke-width="4" stroke-linecap="round" opacity=".45"/>
    ${happy
      ? `<circle cx="222" cy="136" r="8" fill="#2b2a24"/><circle cx="224" cy="133" r="2.4" fill="#fff" opacity=".9"/>
         <path d="M226 158 Q 240 166 250 156" fill="none" stroke="#3f4a35" stroke-width="4" stroke-linecap="round"/>`
      : `<path d="M214 136 Q 222 129 230 136" fill="none" stroke="#2b2a24" stroke-width="4.4" stroke-linecap="round"/>
         <path d="M226 160 Q 238 154 250 160" fill="none" stroke="#3f4a35" stroke-width="4" stroke-linecap="round"/>`}
    <g fill="${shellLight}" opacity=".65">
      <ellipse cx="-154" cy="182" rx="8" ry="5"/><ellipse cx="-132" cy="184" rx="8" ry="5"/>
      <ellipse cx="152" cy="182" rx="8" ry="5"/><ellipse cx="174" cy="180" rx="8" ry="5"/>
    </g>
    <path d="M-188 116 L-220 140 L-196 150 Z" fill="${skin}"/>
  </g>`
}

function donkey({ coat = '#a8a29a', dark = '#7c766e', light = '#e8e2d8', collar = '#0f4c46', mood = 'after' }) {
  const happy = mood === 'after'
  return `
  <g>
    <path d="M-150 250 C-144 170 -78 138 0 138 C78 138 144 170 150 250 Z" fill="${dark}"/>
    <ellipse cx="-62" cy="-146" rx="31" ry="140" fill="${coat}" transform="rotate(-13 -62 -146)"/>
    <ellipse cx="62" cy="-146" rx="31" ry="140" fill="${coat}" transform="rotate(13 62 -146)"/>
    <ellipse cx="-62" cy="-146" rx="15" ry="112" fill="${light}" opacity=".5" transform="rotate(-13 -62 -146)"/>
    <ellipse cx="62" cy="-146" rx="15" ry="112" fill="${light}" opacity=".5" transform="rotate(13 62 -146)"/>
    <ellipse cx="0" cy="0" rx="96" ry="120" fill="${coat}"/>
    <path d="M-54 -112 C-32 -138 32 -138 54 -112 C30 -122 -30 -122 -54 -112 Z" fill="${dark}" opacity=".65"/>
    <path d="M-8 -124 C-2 -144 12 -146 20 -132 C14 -120 2 -118 -8 -124 Z" fill="${dark}"/>
    <ellipse cx="0" cy="70" rx="63" ry="61" fill="${light}"/>
    <ellipse cx="-24" cy="76" rx="8" ry="11" fill="${dark}" opacity=".7"/>
    <ellipse cx="24" cy="76" rx="8" ry="11" fill="${dark}" opacity=".7"/>
    <ellipse cx="-46" cy="30" rx="24" ry="14" fill="${light}" opacity=".35"/>
    <ellipse cx="46" cy="30" rx="24" ry="14" fill="${light}" opacity=".35"/>
    ${happy
      ? `<ellipse cx="-41" cy="-18" rx="11" ry="14" fill="#2b2a24"/>
         <ellipse cx="41" cy="-18" rx="11" ry="14" fill="#2b2a24"/>
         <circle cx="-44" cy="-23" r="3.4" fill="#fff" opacity=".85"/>
         <circle cx="38" cy="-23" r="3.4" fill="#fff" opacity=".85"/>`
      : `<path d="M-57 -18 Q -41 -32 -25 -18" fill="none" stroke="#2b2a24" stroke-width="5" stroke-linecap="round"/>
         <path d="M25 -18 Q 41 -32 57 -18" fill="none" stroke="#2b2a24" stroke-width="5" stroke-linecap="round"/>`}
    <path d="M-20 112 Q 0 126 20 112" fill="none" stroke="${dark}" stroke-width="4" stroke-linecap="round"/>
    <path d="M-98 132 C-54 162 54 162 98 132 L102 158 C54 188 -54 188 -102 158 Z" fill="${collar}"/>
    <circle cx="0" cy="172" r="14" fill="#f5b942"/>
    ${paw(0, 172, 0.32, collar)}
  </g>`
}

/* ── Story scenes ─────────────────────────────────────────── */

const STORY_ANIMALS = {
  moti: (mood) => dog({ mood, patch: true }),
  whiskers: (mood) => cat({ mood }),
  lakshmi: (mood) => cow({ mood }),
  bhola: (mood) => dog({ coat: '#8c6239', dark: '#6b4726', light: '#d8b98f', collar: '#1d4ed8', mood, wire: mood === 'before' }),
  chinnu: (mood) => bird({ mood }),
  tuffy: (mood) => dog({ coat: '#e8cfa5', dark: '#c3a273', light: '#f8ecd5', collar: '#bf2c2c', mood, patch: true, bandana: mood === 'after' ? '#bf2c2c' : null }),
  dhanno: (mood) => donkey({ mood }),
  rani: (mood) => rabbit({ mood }),
  tara: (mood) => tortoise({ mood }),
  bittu: (mood) => bird({ body: '#5f9e4a', wing: '#3f7a34', belly: '#e8f1d8', mood }),
  sheru: (mood) => dog({ coat: '#4a4f4b', dark: '#303431', light: '#cfc9bd', collar: '#b85408', mood }),
  kaveri: (mood) => cat({ fur: '#8c8f95', dark: '#6a6d73', light: '#e9e4dc', eye: '#b8822f', mood }),
}

function storyScene(id, mood) {
  const before = mood === 'before'
  const defs =
    lin('sky', before ? [[0, '#5c6d68'], [1, '#9ba7a0']] : [[0, '#fdf6e7'], [1, '#f7dfbb']]) +
    lin('ground', before ? [[0, '#6b7a73'], [1, '#4f5e58']] : [[0, '#a9cdb8'], [1, '#7cae96']]) +
    rad('glow', [[0, '#fff9ec', before ? 0.16 : 0.85], [1, '#fff9ec', 0]]) +
    '<filter id="dim"><feColorMatrix type="saturate" values="0.55"/></filter>'

  const weather = before
    ? `<g fill="#e6ece8" opacity=".5">
         <ellipse cx="180" cy="112" rx="92" ry="30"/><ellipse cx="246" cy="94" rx="60" ry="26"/>
         <ellipse cx="700" cy="150" rx="80" ry="26"/><ellipse cx="752" cy="134" rx="52" ry="22"/>
       </g>
       <g stroke="#dfe7e2" stroke-width="3" stroke-linecap="round" opacity=".35">
         ${[120, 210, 300, 560, 640, 730, 820].map((x, i) => `<path d="M${x} ${170 + i * 18} l-12 54"/>`).join('')}
       </g>`
    : `${sun(756, 132, 56)}${heart(150, 178, 1.25, '#e26a12', 0.75)}${heart(196, 118, 0.7, '#e26a12', 0.5)}
       ${sparkle(300, 122, 0.9, '#f0a63c', 0.85)}${sparkle(650, 214, 0.65, '#f0a63c', 0.75)}
       ${sparkle(120, 300, 0.55, '#fff', 0.75)}`

  const extras = {
    moti: before ? bandage(-92, 40, -18) : '',
    whiskers: before ? bandage(84, -2, 12) : '',
    lakshmi: before ? '' : '',
    bhola: '',
    chinnu: '',
    tuffy: before ? `<g fill="#9c6a43" opacity=".45"><ellipse cx="-74" cy="-62" rx="26" ry="17"/><ellipse cx="70" cy="26" rx="22" ry="14"/><ellipse cx="-34" cy="96" rx="18" ry="12"/></g>` : '',
    dhanno: before
      ? `<g fill="none" stroke="#8c4a3c" stroke-width="4" stroke-linecap="round" opacity=".8">
           <path d="M-58 92 Q 0 116 58 92"/><path d="M-70 108 Q 0 134 70 108" opacity=".6"/>
         </g>`
      : '',
    rani: before ? bandage(-84, 168, -16) : '',
    tara: before
      ? `<g fill="none" stroke="#3f2c1b" stroke-width="4.5" stroke-linecap="round" opacity=".8">
           <path d="M-54 -44 L-20 -6 L-36 42"/><path d="M58 -36 L32 6 L52 44"/><path d="M-4 -96 L18 -58 L-2 -20"/>
         </g>`
      : '',
    bittu: before ? bandage(18, 118, -14) : '',
    sheru: before
      ? `<g fill="#2f2620" opacity=".8">
           <circle cx="-78" cy="-48" r="6"/><circle cx="-52" cy="-70" r="5"/><circle cx="66" cy="-34" r="5.5"/>
           <circle cx="84" cy="20" r="4.5"/><circle cx="-60" cy="102" r="5"/>
         </g>`
      : '',
    kaveri: before
      ? `<g><ellipse cx="62" cy="64" rx="34" ry="24" fill="#d98b86" opacity=".7"/><ellipse cx="52" cy="58" rx="20" ry="14" fill="#efb3ad" opacity=".8"/></g>`
      : '',
  }[id]

  return svg(
    900,
    620,
    defs,
    `<rect width="900" height="620" fill="url(#sky)"/>
     <circle cx="450" cy="292" r="272" fill="url(#glow)"/>
     ${weather}
     <path d="M0 470 C 180 438 320 470 450 464 C 600 456 740 430 900 468 L900 620 L0 620 Z" fill="url(#ground)"/>
     <g opacity="${before ? 0.5 : 0.8}">
       ${g(64, 566, 1, grass(before ? '#46554f' : '#3f7d67'))}
       ${g(836, 574, 0.9, grass(before ? '#46554f' : '#3f7d67', true))}
     </g>
     <g ${before ? 'filter="url(#dim)"' : ''} transform="translate(450 326)">
       ${STORY_ANIMALS[id](mood)}
       ${extras || ''}
     </g>
     ${before ? '<rect width="900" height="620" fill="#3d4d49" opacity=".12"/>' : ''}`
  )
}

/* ── Article covers ───────────────────────────────────────── */

function coverBase(id, motif, accent = '#0f4c46') {
  return svg(
    1200,
    675,
    lin(`${id}-bg`, [[0, '#fdf8ee'], [1, '#f5e6cf']]) +
      rad(`${id}-glow`, [[0, accent, 0.16], [1, accent, 0]]) +
      `<pattern id="${id}-dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="${accent}" opacity=".16"/></pattern>`,
    `<rect width="1200" height="675" fill="url(#${id}-bg)"/>
     <circle cx="1020" cy="110" r="310" fill="url(#${id}-glow)"/>
     <rect width="1200" height="675" fill="url(#${id}-dots)" opacity=".55"/>
     <path d="M0 566 Q 300 526 600 552 T 1200 544 L1200 675 L0 675 Z" fill="${accent}" opacity=".1"/>
     <path d="M-60 610 C 200 548 400 640 640 586 C 850 540 1010 588 1260 548" fill="none" stroke="${accent}" stroke-opacity=".14" stroke-width="2"/>
     <circle cx="110" cy="612" r="86" fill="${accent}" opacity=".06"/>
     ${motif}`
  )
}

const bowl = (x, y, s, col = '#b5653a') =>
  g(x, y, s, `<path d="M-92 0 C-92 52 -52 78 0 78 C52 78 92 52 92 0 Z" fill="${col}"/>
    <ellipse cx="0" cy="0" rx="92" ry="23" fill="#d98a5a"/>
    <ellipse cx="0" cy="-3" rx="74" ry="16" fill="#3f8f9c"/>
    <ellipse cx="-26" cy="-7" rx="24" ry="5" fill="#8ccbd2" opacity=".75"/>`)

const syringe = (x, y, s, rot = -32) =>
  g(x, y, s, `<g transform="rotate(${rot})">
    <rect x="-90" y="-20" width="168" height="40" rx="16" fill="#fffdf8" stroke="#0f4c46" stroke-width="5"/>
    <rect x="-86" y="-14" width="96" height="28" rx="10" fill="#7fc3cc" opacity=".75"/>
    <rect x="78" y="-28" width="20" height="56" rx="8" fill="#0f4c46"/>
    <rect x="98" y="-7" width="46" height="14" rx="7" fill="#0f4c46"/>
    <path d="M-90 0 H-160" stroke="#5f6f6a" stroke-width="5" stroke-linecap="round"/>
    <path d="M-120 -12 V 12 M-138 -12 V 12" stroke="#0f4c46" stroke-width="4" opacity=".5"/>
  </g>`)

const scales = (x, y, s) =>
  g(x, y, s, `<g stroke="#0f4c46" stroke-width="9" stroke-linecap="round" fill="none">
      <path d="M0 150 V -110"/>
      <path d="M-160 -96 H160"/>
      <path d="M0 150 H-78 M0 150 H78"/>
      <path d="M-160 -96 V -62 M160 -96 V -62"/>
    </g>
    <g stroke="#b5653a" stroke-width="3" fill="none" opacity=".7">
      <path d="M-160 -62 L-214 34 M-160 -62 L-106 34"/>
      <path d="M160 -62 L106 34 M160 -62 L214 34"/>
    </g>
    <path d="M-234 34 H-86 C-86 78 -122 100 -160 100 C-198 100 -234 78 -234 34 Z" fill="#f0a63c"/>
    <path d="M86 34 H234 C234 78 198 100 160 100 C122 100 86 78 86 34 Z" fill="#f0a63c"/>
    <circle cx="0" cy="-110" r="16" fill="#e2602c"/>`)

const phone = (x, y, s, rot = -6) =>
  g(x, y, s, `<g transform="rotate(${rot})">
    <rect x="-138" y="-244" width="276" height="488" rx="44" fill="#0f4c46"/>
    <rect x="-120" y="-222" width="240" height="444" rx="28" fill="#fdf8ee"/>
    <rect x="-44" y="-238" width="88" height="18" rx="9" fill="#0b3b36"/>
    <g stroke="#1b8f80" stroke-width="7" fill="none" stroke-linecap="round">
      <path d="M-88 -176 V -146 H-58"/><path d="M88 -176 V -146 H58"/>
      <path d="M-88 176 V 146 H-58"/><path d="M88 176 V 146 H58"/>
    </g>
    ${paw(0, -18, 1.7, '#0f4c46', 0.9)}
    ${heart(0, 96, 0.9, '#e26a12', 0.9)}
    <circle cx="0" cy="196" r="11" fill="#d8cbb6"/>
  </g>`)

function coverSummer() {
  return coverBase(
    'summer',
    `<g opacity=".8">
       <path d="M-30 214 C 100 152 210 168 282 228" fill="none" stroke="#2f6b5f" stroke-width="12" stroke-linecap="round"/>
       ${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="${56 + i * 52}" cy="${170 + i * 13}" rx="34" ry="16" fill="#2f6b5f" transform="rotate(${-24 + i * 12} ${56 + i * 52} ${170 + i * 13})"/>`).join('')}
     </g>
     ${sun(952, 158, 92)}${sun(952, 158, 74, '#f5b942')}
     ${g(392, 402, 0.92, dog({ coat: '#d99a5b', dark: '#b3743a', light: '#f6dcb8', collar: '#0f4c46', mood: 'after', patch: true }))}
     ${bowl(762, 474, 1.15)}
     ${drop(716, 386, 1.15, '#3f8f9c', 0.85)}${drop(780, 348, 0.85, '#3f8f9c', 0.65)}
     ${drop(842, 404, 0.65, '#3f8f9c', 0.55)}
     ${sparkle(690, 268, 0.9, '#f0a63c', 0.8)}`
  )
}

function coverVaccination() {
  return coverBase(
    'vaccination',
    `${g(628, 322, 1.05, `<path d="M0 -158 C 64 -126 116 -114 138 -110 L 138 34 C 138 122 64 166 0 188 C -64 166 -138 122 -138 34 L -138 -110 C -116 -114 -64 -126 0 -158 Z" fill="#0f4c46"/>
      <path d="M0 -138 C 54 -110 96 -100 114 -96 L 114 28 C 114 100 54 138 0 156 C -54 138 -114 100 -114 28 L -114 -96 C -96 -100 -54 -110 0 -138 Z" fill="#146b61"/>
      ${paw(0, 0, 1.7, '#fdf5e2', 0.95)}`)}
     ${syringe(846, 508, 0.92, -34)}
     <g transform="translate(922 232)">
       <rect x="-58" y="-86" width="116" height="172" rx="20" fill="#fffdf8" stroke="#0f4c46" stroke-width="5"/>
       <rect x="-34" y="-104" width="68" height="22" rx="8" fill="#0f4c46"/>
       <rect x="-38" y="28" width="76" height="42" rx="12" fill="#7fc3cc" opacity=".8"/>
       <path d="M-22 -40 H22 M-22 -6 H22 M-22 28 H6" stroke="#0f4c46" stroke-width="5" stroke-linecap="round" opacity=".35"/>
     </g>
     <circle cx="378" cy="190" r="86" fill="none" stroke="#e26a12" stroke-width="2.5" stroke-dasharray="7 10" opacity=".6"/>
     ${sparkle(348, 182, 1, '#e26a12', 0.8)}`
  )
}

function coverLegal() {
  return coverBase(
    'legal',
    `<g transform="translate(474 330) rotate(-6)">
       <rect x="-150" y="-180" width="300" height="360" rx="22" fill="#fffdf8" stroke="#d8cbb6" stroke-width="4"/>
       <g stroke="#0f4c46" stroke-width="7" stroke-linecap="round" opacity=".28">
         ${[0, 1, 2, 3, 4].map((i) => `<path d="M-96 ${-110 + i * 42} H ${i === 4 ? 20 : 96}"/>`).join('')}
       </g>
       <circle cx="58" cy="120" r="34" fill="#e26a12" opacity=".85"/>
       ${paw(58, 120, 0.62, '#fdf5e2')}
     </g>
     ${scales(800, 292, 0.95)}
     ${sparkle(350, 120, 0.75, '#e26a12', 0.75)}`
  )
}

function coverStraySafety() {
  return coverBase(
    'safety',
    `${sun(214, 150, 64)}
     <g opacity=".35" fill="#0f4c46">
       <rect x="60" y="250" width="70" height="220" rx="6"/><rect x="150" y="290" width="52" height="180" rx="6"/>
       <rect x="960" y="264" width="64" height="206" rx="6"/><rect x="1042" y="306" width="86" height="164" rx="6"/>
     </g>
     <path d="M520 675 L760 675 L664 356 L604 356 Z" fill="#3f4f4a"/>
     <path d="M632 640 L648 640 M646 580 L656 580 M658 524 L666 524 M669 474 L675 474 M676 428 L681 428" stroke="#fdf8ee" stroke-width="9" stroke-linecap="round"/>
     <path d="M520 675 L760 675 L746 640 L534 640 Z" fill="#f0a63c" opacity=".2"/>
     ${g(354, 468, 0.82, dog({ coat: '#c98a4b', dark: '#8a5a2b', light: '#f6dcb8', collar: '#bf2c2c', mood: 'after' }))}
     <g transform="translate(884 292)">
       <path d="M0 -120 L118 84 H-118 Z" fill="#f0a63c" stroke="#0f4c46" stroke-width="8" stroke-linejoin="round"/>
       ${paw(0, 38, 1.1, '#0f4c46')}
     </g>
     ${drop(298, 650, 0.9, '#3f8f9c', 0.6)}`
  )
}

function coverPetCare() {
  return coverBase(
    'petcare',
    `<g transform="translate(732 334)">
       <path d="M-210 -20 L0 -212 L210 -20" fill="none" stroke="#0f4c46" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
       <path d="M-166 0 V 202 H166 V 0" fill="#fffdf8" stroke="#0f4c46" stroke-width="14" stroke-linejoin="round"/>
       <rect x="-46" y="86" width="92" height="116" rx="10" fill="#146b61"/>
       <circle cx="20" cy="146" r="5" fill="#f0a63c"/>
       <circle cx="-92" cy="66" r="34" fill="#f0a63c" opacity=".85"/>
       ${heart(92, 64, 1.1, '#e2602c', 0.9)}
     </g>
     ${heart(300, 214, 2.3, '#e2602c', 0.9)}
     ${g(300, 356, 0.62, cat({ fur: '#f3e6d2', dark: '#c99a62', mood: 'after' }))}
     ${bowl(232, 592, 0.82)}${paw(392, 566, 0.9, '#0f4c46', 0.5)}
     ${sparkle(486, 176, 0.8, '#f0a63c', 0.8)}`
  )
}

function coverReport() {
  return coverBase(
    'report',
    `${phone(628, 342, 0.92)}
     <g transform="translate(942 226)">
       <circle cx="0" cy="0" r="92" fill="#e26a12" opacity=".14"/>
       <circle cx="0" cy="0" r="62" fill="#e26a12" opacity=".22"/>
       <path d="M0 -88 C 48 -34 76 -6 76 26 C 76 72 42 98 0 98 C -42 98 -76 72 -76 26 C -76 -6 -48 -34 0 -88 Z" fill="#bf2c2c"/>
       <circle cx="0" cy="22" r="24" fill="#fdf8ee"/>
     </g>
     <g transform="translate(286 466)">
       <circle cx="0" cy="0" r="92" fill="#fffdf8" stroke="#d8cbb6" stroke-width="4"/>
       ${paw(0, 0, 1.15, '#0f4c46')}
     </g>
     <g stroke="#1b8f80" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7">
       <path d="M250 180 C 300 120 380 120 430 180"/><path d="M266 208 C 306 166 366 166 406 208"/>
     </g>
     ${sparkle(870, 456, 0.9, '#f0a63c', 0.85)}`
  )
}

/* ── Myth illustrations ───────────────────────────────────── */

const shield = (x, y, s, fill = '#0f4c46') =>
  g(
    x,
    y,
    s,
    `<path d="M0 -124 C54 -98 96 -88 116 -84 L116 30 C116 106 54 144 0 166 C-54 144 -116 106 -116 30 L-116 -84 C-96 -88 -54 -98 0 -124 Z" fill="${fill}"/>
     <path d="M0 -102 C44 -82 78 -74 94 -70 L94 24 C94 88 44 120 0 138 C-44 120 -94 88 -94 24 L-94 -70 C-78 -74 -44 -82 0 -102 Z" fill="#146b61"/>
     ${paw(0, 10, 1.55, '#fdf5e2', 0.96)}`,
  )

const milkBottle = (x, y, s, rot = -8) =>
  g(
    x,
    y,
    s,
    `<g transform="rotate(${rot})">
      <path d="M-26 -94 H26 V-62 C58 -50 72 -22 72 15 V78 C72 92 61 102 47 102 H-47 C-61 102 -72 92 -72 78 V15 C-72 -22 -58 -50 -26 -62 Z" fill="#fffdf8" stroke="#b5653a" stroke-width="5"/>
      <rect x="-34" y="-114" width="68" height="24" rx="9" fill="#d8cbb6"/>
      <rect x="-42" y="-4" width="84" height="58" rx="10" fill="#e4f2ee"/>
      ${drop(0, 24, 0.8, '#3f8f9c', 0.8)}
      <path d="M-98 96 L98 -96" stroke="#bf2c2c" stroke-width="16" stroke-linecap="round"/>
      <path d="M-98 96 L98 -96" stroke="#fffdf8" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 10"/>
    </g>`,
  )

const bone = (x, y, s, rot = -18) =>
  g(
    x,
    y,
    s,
    `<g transform="rotate(${rot})">
      <g fill="#fff7e8" stroke="#b5653a" stroke-width="6">
        <rect x="-64" y="-14" width="128" height="28" rx="14"/>
        <circle cx="-78" cy="-22" r="24"/><circle cx="-78" cy="22" r="24"/>
        <circle cx="78" cy="-22" r="24"/><circle cx="78" cy="22" r="24"/>
      </g>
      <path d="M-102 88 L102 -88" stroke="#bf2c2c" stroke-width="14" stroke-linecap="round"/>
    </g>`,
  )

const toothbrush = (x, y, s, rot = 24) =>
  g(
    x,
    y,
    s,
    `<g transform="rotate(${rot})">
      <rect x="-96" y="-11" width="156" height="22" rx="11" fill="#f0a63c"/>
      <rect x="52" y="-24" width="52" height="48" rx="11" fill="#0f4c46"/>
      ${[0, 1, 2, 3]
        .map(
          (i) =>
            `<path d="M${62 + i * 11} -30 V -42" stroke="#fffdf8" stroke-width="5" stroke-linecap="round"/>`,
        )
        .join('')}
    </g>`,
  )

const chain = (x, y, s) =>
  g(
    x,
    y,
    s,
    `<g fill="none" stroke="#8a6a52" stroke-width="11" opacity=".9">
      <ellipse cx="-58" cy="4" rx="24" ry="36" transform="rotate(-38 -58 4)"/>
      <ellipse cx="-4" cy="-8" rx="24" ry="36" transform="rotate(-38 -4 -8)"/>
      <ellipse cx="50" cy="-20" rx="24" ry="36" transform="rotate(-38 50 -20)"/>
    </g>
    <path d="M92 -36 L126 -62" stroke="#8a6a52" stroke-width="11" stroke-linecap="round"/>
    <path d="M92 -36 L126 -62" stroke="#bf2c2c" stroke-width="4" stroke-linecap="round" stroke-dasharray="3 9"/>
    ${heart(136, -80, 0.62, '#e26a12', 0.85)}`,
  )

const medal = (x, y, s) =>
  g(
    x,
    y,
    s,
    `<path d="M-48 -118 L-22 -34 L0 -48 L22 -34 L48 -118" fill="#0f4c46" opacity=".9"/>
     <circle cx="0" cy="14" r="62" fill="#f0a63c" stroke="#0f4c46" stroke-width="7"/>
     <circle cx="0" cy="14" r="46" fill="#f6c98a"/>
     ${paw(0, 18, 1.05, '#0f4c46', 0.9)}`,
  )

const medicalCross = (x, y, s, fill = '#fffdf8') =>
  g(
    x,
    y,
    s,
    `<path d="M-13 -42 H13 V-13 H42 V13 H13 V42 H-13 V13 H-42 V-13 H-13 Z" fill="${fill}"/>`,
  )

const firework = (cx, cy, r, color) => {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6
    return `<path d="M${cx + Math.cos(a) * (r * 0.3)} ${cy + Math.sin(a) * (r * 0.3)} L${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}"/>`
  }).join('')
  return `<g fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" opacity=".85">${rays}</g><circle cx="${cx}" cy="${cy}" r="5" fill="${color}"/>`
}

function mythBase(id, accent, motif, animal, extras = '') {
  return svg(
    760,
    380,
    lin(`${id}-bg`, [
      [0, '#fffaf1'],
      [1, '#f3e6d1'],
    ]) +
      rad(`${id}-glow`, [
        [0, accent, 0.24],
        [1, accent, 0],
      ]) +
      `<pattern id="${id}-dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="${accent}" opacity=".18"/></pattern>`,
    `<rect width="760" height="380" fill="url(#${id}-bg)"/>
     <rect width="760" height="380" fill="url(#${id}-dots)" opacity=".55"/>
     <circle cx="590" cy="128" r="264" fill="url(#${id}-glow)"/>
     <circle cx="190" cy="188" r="132" fill="none" stroke="${accent}" stroke-width="2.5" stroke-dasharray="8 12" opacity=".28"/>
     <path d="M320 328 C390 286 470 286 540 328" fill="none" stroke="${accent}" stroke-width="2.5" stroke-dasharray="6 10" opacity=".25"/>
     <path d="M0 322 C140 292 280 332 400 316 C540 296 660 318 760 302 L760 380 L0 380 Z" fill="${accent}" opacity=".12"/>
     <circle cx="96" cy="330" r="72" fill="${accent}" opacity=".08"/>
     <circle cx="685" cy="330" r="54" fill="${accent}" opacity=".07"/>
     ${motif}
     ${animal}
     ${extras}
     ${sparkle(96, 92, 0.7, '#f0a63c', 0.6)}
     ${sparkle(700, 78, 0.55, '#f0a63c', 0.5)}`,
  )
}

function mythScene(id) {
  switch (id) {
    case 'aggressive-by-nature':
      return mythBase(
        'myth-aggressive',
        '#1b8f80',
        `${heart(190, 170, 1.5, '#e26a12', 0.9)}${heart(124, 104, 0.58, '#f0a63c', 0.65)}
         ${g(244, 314, 0.7, grass('#3f7d67'))}`,
        g(
          566,
          178,
          0.55,
          dog({
            coat: '#d99a5b',
            dark: '#b3743a',
            light: '#f6dcb8',
            collar: '#0f4c46',
            mood: 'after',
            patch: true,
          }),
        ),
      )
    case 'feeding-multiplies':
      return mythBase(
        'myth-feeding',
        '#c96a2e',
        `${bowl(178, 258, 0.95)}${paw(142, 126, 0.62, '#b5653a', 0.8)}${drop(300, 220, 0.7, '#3f8f9c', 0.7)}${heart(268, 108, 0.5, '#e26a12', 0.65)}`,
        g(
          566,
          180,
          0.52,
          dog({
            coat: '#c98a4b',
            dark: '#8a5a2b',
            light: '#f6dcb8',
            collar: '#bf2c2c',
            mood: 'after',
          }),
        ),
      )
    case 'milk-and-bread':
      return mythBase(
        'myth-milk',
        '#b5653a',
        `${milkBottle(188, 196, 0.84, -8)}${drop(300, 286, 0.72, '#3f8f9c', 0.65)}`,
        g(
          572,
          180,
          0.52,
          dog({
            coat: '#e8cfa5',
            dark: '#c3a273',
            light: '#f8ecd5',
            collar: '#146b61',
            mood: 'after',
            patch: true,
          }),
        ),
      )
    case 'all-strays-rabid':
      return mythBase(
        'myth-rabies',
        '#2f7f8c',
        `${shield(184, 188, 0.82)}${syringe(292, 286, 0.55, -35)}`,
        g(
          578,
          180,
          0.52,
          dog({
            coat: '#8c6239',
            dark: '#6b4726',
            light: '#d8b98f',
            collar: '#1d4ed8',
            mood: 'after',
          }),
        ),
      )
    case 'kill-after-bite':
      return mythBase(
        'myth-bite',
        '#0f4c46',
        `${scales(184, 202, 0.6)}${heart(300, 112, 0.55, '#e26a12', 0.7)}`,
        g(
          578,
          180,
          0.52,
          dog({
            coat: '#d99a5b',
            dark: '#b3743a',
            light: '#f6dcb8',
            collar: '#0f4c46',
            mood: 'after',
          }),
        ),
      )
    case 'sterilisation-cruel':
      return mythBase(
        'myth-sterilisation',
        '#157347',
        `${heart(190, 170, 1.45, '#157347', 0.92)}${medicalCross(190, 170, 0.72)}${bandage(282, 292, 22)}`,
        g(
          580,
          182,
          0.54,
          cat({
            fur: '#f3e6d2',
            dark: '#c99a62',
            light: '#f7ead4',
            eye: '#3f8f5a',
            mood: 'after',
          }),
        ),
      )
    case 'animals-dont-feel-pain':
      return mythBase(
        'myth-pain',
        '#bf2c2c',
        `${heart(190, 170, 1.4, '#bf2c2c', 0.88)}
         <path d="M126 176 H158 L172 146 L192 210 L208 164 L222 176 H252" fill="none" stroke="#fffdf8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
        g(
          580,
          180,
          0.54,
          dog({
            coat: '#e8cfa5',
            dark: '#c3a273',
            light: '#f8ecd5',
            collar: '#bf2c2c',
            mood: 'after',
            patch: true,
          }),
        ),
      )
    case 'chaining-is-normal':
      return mythBase(
        'myth-chaining',
        '#8a5a2b',
        `${chain(184, 190, 0.9)}`,
        g(
          582,
          180,
          0.54,
          dog({
            coat: '#8c6239',
            dark: '#6b4726',
            light: '#d8b98f',
            collar: '#1d4ed8',
            mood: 'after',
            wire: true,
          }),
        ),
      )
    case 'cats-ungrateful':
      return mythBase(
        'myth-cats',
        '#8a6a52',
        `${heart(190, 168, 1.35, '#e26a12', 0.85)}${heart(130, 100, 0.55, '#f0a63c', 0.6)}${sparkle(262, 122, 0.8, '#f0a63c', 0.8)}`,
        g(
          580,
          180,
          0.55,
          cat({
            fur: '#e9c89a',
            dark: '#c99a62',
            light: '#f7ead4',
            eye: '#3f8f5a',
            mood: 'after',
          }),
        ),
      )
    case 'indies-inferior':
      return mythBase(
        'myth-indies',
        '#b5653a',
        `${medal(190, 184, 0.85)}${sparkle(300, 120, 0.7, '#e26a12', 0.8)}`,
        g(
          580,
          180,
          0.55,
          dog({
            coat: '#d99a5b',
            dark: '#b3743a',
            light: '#f6dcb8',
            collar: '#e26a12',
            mood: 'after',
            patch: true,
            bandana: '#e26a12',
          }),
        ),
      )
    case 'bones-clean-teeth':
      return mythBase(
        'myth-bones',
        '#4a7c59',
        `${bone(178, 190, 0.78, -18)}${toothbrush(276, 286, 0.68, 24)}`,
        g(
          580,
          180,
          0.52,
          dog({
            coat: '#e8cfa5',
            dark: '#c3a273',
            light: '#f8ecd5',
            collar: '#4a7c59',
            mood: 'after',
          }),
        ),
      )
    case 'fireworks-dont-matter':
      return mythBase(
        'myth-fireworks',
        '#c25a4a',
        `${firework(138, 106, 44, '#e26a12')}${firework(262, 80, 32, '#1b8f80')}${firework(98, 232, 28, '#f0a63c')}${heart(254, 214, 0.55, '#e26a12', 0.65)}`,
        g(
          580,
          180,
          0.52,
          dog({
            coat: '#d99a5b',
            dark: '#b3743a',
            light: '#f6dcb8',
            collar: '#bf2c2c',
            mood: 'before',
          }),
        ),
      )
    default:
      return ''
  }
}

const MYTH_IDS = [
  'aggressive-by-nature',
  'feeding-multiplies',
  'milk-and-bread',
  'all-strays-rabid',
  'kill-after-bite',
  'sterilisation-cruel',
  'animals-dont-feel-pain',
  'chaining-is-normal',
  'cats-ungrateful',
  'indies-inferior',
  'bones-clean-teeth',
  'fireworks-dont-matter',
]

/* ── Hero ─────────────────────────────────────────────────── */


function heroArt() {
  const defs =
    lin('hero-bg', [[0, '#0b3b36'], [1, '#071f1d']]) +
    rad('hero-glow', [[0, '#f5b942', 0.38], [1, '#f5b942', 0]]) +
    rad('hero-floor', [[0, '#1b8f80', 0.55], [1, '#1b8f80', 0]]) +
    `<pattern id="hero-dots" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="#fff" opacity=".1"/></pattern>`

  const beams = Array.from({ length: 3 }, (_, i) => {
    const r = 110 + i * 78
    return `<circle cx="450" cy="128" r="${r}" fill="none" stroke="#f5b942" stroke-opacity="${0.22 - i * 0.06}" stroke-width="2"/>`
  }).join('')

  return svg(
    900,
    700,
    defs,
    `<rect width="900" height="700" fill="url(#hero-bg)"/>
     <rect width="900" height="700" fill="url(#hero-dots)"/>
     <circle cx="450" cy="128" r="330" fill="url(#hero-glow)"/>
     <path d="M450 128 L40 40 L120 250 Z" fill="#f5b942" opacity=".07"/>
     <path d="M450 128 L860 40 L780 250 Z" fill="#f5b942" opacity=".07"/>
     ${beams}
     <circle cx="450" cy="128" r="46" fill="#f5b942"/>
     <circle cx="450" cy="128" r="30" fill="#fff3d4"/>
     ${paw(450, 128, 0.5, '#0f4c46')}
     <circle cx="450" cy="600" r="330" fill="url(#hero-floor)"/>
     <path d="M0 566 C 180 526 330 556 450 550 C 600 542 760 518 900 560 L900 700 L0 700 Z" fill="#0a2e2a"/>
     ${g(416, 396, 0.94, dog({ coat: '#d99a5b', dark: '#b3743a', light: '#f6dcb8', collar: '#f0a63c', mood: 'after', patch: true }))}
     ${g(612, 430, 0.6, cat({ fur: '#f3e6d2', dark: '#c99a62', mood: 'after' }))}
     ${g(58, 662, 1.15, grass('#2f6b5f'))}
     ${g(842, 672, 1.05, grass('#2f6b5f', true))}
     ${heart(188, 258, 1.15, '#e26a12', 0.8)}
     ${heart(734, 296, 0.85, '#e26a12', 0.6)}
     ${sparkle(252, 170, 0.85, '#f5b942', 0.8)}
     ${sparkle(700, 168, 0.6, '#f5b942', 0.7)}
     ${sparkle(810, 442, 0.7, '#fff', 0.5)}`
  )
}

/* ── Write files ──────────────────────────────────────────── */

const files = {
  'images/hero.svg': heroArt(),
  'images/cover-summer-water.svg': coverSummer(),
  'images/cover-vaccination.svg': coverVaccination(),
  'images/cover-legal-rights.svg': coverLegal(),
  'images/cover-stray-safety.svg': coverStraySafety(),
  'images/cover-pet-care.svg': coverPetCare(),
  'images/cover-report.svg': coverReport(),
}

for (const id of MYTH_IDS) {
  files[`images/myths/${id}.svg`] = mythScene(id)
}

for (const id of Object.keys(STORY_ANIMALS)) {
  files[`images/story-${id}-before.svg`] = storyScene(id, 'before')
  files[`images/story-${id}-after.svg`] = storyScene(id, 'after')
}

for (const [relative, contents] of Object.entries(files)) {
  const target = join(OUT, relative)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, `${contents}\n`, 'utf8')
  console.log(`wrote public/${relative}`)
}

console.log(`\n${Object.keys(files).length} assets generated in public/`)
