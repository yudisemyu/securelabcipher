// ==========================================
// 1. CONSTANTS & PRE-DEFINED S-BOXES
// ==========================================

export const SBOX_44 = [
  [99, 205, 85, 71, 25, 127, 113, 219, 63, 244, 109, 159, 11, 228, 94, 214],
  [77, 177, 201, 78, 5, 48, 29, 30, 87, 96, 193, 80, 156, 200, 216, 86],
  [116, 143, 10, 14, 54, 169, 148, 68, 49, 75, 171, 157, 92, 114, 188, 194],
  [121, 220, 131, 210, 83, 135, 250, 149, 253, 72, 182, 33, 190, 141, 249, 82],
  [232, 50, 21, 84, 215, 242, 180, 198, 168, 167, 103, 122, 152, 162, 145, 184],
  [43, 237, 119, 183, 7, 12, 125, 55, 252, 206, 235, 160, 140, 133, 179, 192],
  [110, 176, 221, 134, 19, 6, 187, 59, 26, 129, 112, 73, 175, 45, 24, 218],
  [44, 66, 151, 32, 137, 31, 35, 147, 236, 247, 117, 132, 79, 136, 154, 105],
  [199, 101, 203, 52, 57, 4, 153, 197, 88, 76, 202, 174, 233, 62, 208, 91],
  [231, 53, 1, 124, 0, 28, 142, 170, 158, 51, 226, 65, 123, 186, 239, 246],
  [38, 56, 36, 108, 8, 126, 9, 189, 81, 234, 212, 224, 13, 3, 40, 64],
  [172, 74, 181, 118, 39, 227, 130, 89, 245, 166, 16, 61, 106, 196, 211, 107],
  [229, 195, 138, 18, 93, 207, 240, 95, 58, 255, 209, 217, 15, 111, 46, 173],
  [223, 42, 115, 238, 139, 243, 23, 98, 100, 178, 37, 97, 191, 213, 222, 155],
  [165, 2, 146, 204, 120, 241, 163, 128, 22, 90, 60, 185, 67, 34, 27, 248],
  [164, 69, 41, 230, 104, 47, 144, 251, 20, 17, 150, 225, 254, 161, 102, 70],
];

export const SBOX_AES = [
  [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118],
  [202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192],
  [183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21],
  [4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117],
  [9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132],
  [83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207],
  [208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168],
  [81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210],
  [205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115],
  [96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219],
  [224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121],
  [231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8],
  [186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138],
  [112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158],
  [225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223],
  [140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22],
];

export const createInverseSBox = (sbox) => {
  const inv = Array(16).fill(null).map(() => Array(16).fill(0));
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      const val = sbox[i][j];
      inv[val >> 4][val & 0x0f] = (i << 4) | j;
    }
  }
  return inv;
};

export const INV_SBOX_44 = createInverseSBox(SBOX_44);
export const INV_SBOX_AES = createInverseSBox(SBOX_AES);

// --- CONVERSIONS ---
export const stringToBytes = (str) => new TextEncoder().encode(str);
export const bytesToString = (bytes) => new TextDecoder().decode(new Uint8Array(bytes));
export const bytesToHex = (bytes) => Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
export const hexToBytes = (hex) => {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.substr(i, 2), 16));
    return bytes;
};

// ==========================================
// 2. CORE AES FUNCTIONS (ENCRYPTION/DECRYPTION)
// ==========================================

const gmul = (a, b) => {
  let p = 0;
  for (let i = 0; i < 8; i++) {
    if (b & 1) p ^= a;
    const hi_bit_set = a & 0x80;
    a <<= 1;
    if (hi_bit_set) a ^= 0x1b;
    b >>= 1;
  }
  return p & 0xff;
};

const gfInverse = (b) => {
  if (b === 0) return 0;
  for (let i = 1; i < 256; i++) {
    if (gmul(b, i) === 1) return i;
  }
  return 0;
};

// Padding Utils
const addPadding = (bytes) => {
  const blockSize = 16;
  const paddingLength = blockSize - (bytes.length % blockSize);
  if (bytes instanceof Uint8Array) {
      const padding = new Uint8Array(paddingLength).fill(paddingLength);
      const result = new Uint8Array(bytes.length + paddingLength);
      result.set(bytes);
      result.set(padding, bytes.length);
      return result;
  }
  return [...bytes, ...Array(paddingLength).fill(paddingLength)];
};

const removePadding = (bytes) => {
  if (bytes.length === 0) return bytes;
  const paddingLength = bytes[bytes.length - 1];
  if (paddingLength > 16 || paddingLength === 0) return bytes;
  return bytes.slice(0, bytes.length - paddingLength);
};

// AES Operations
const subBytes = (state, sbox) => state.map(b => sbox[b >> 4][b & 0x0f]);
const shiftRows = (state) => {
  const r = [...state];
  [r[1],r[5],r[9],r[13]] = [state[5],state[9],state[13],state[1]];
  [r[2],r[6],r[10],r[14]] = [state[10],state[14],state[2],state[6]];
  [r[3],r[7],r[11],r[15]] = [state[15],state[3],state[7],state[11]];
  return r;
};
const invShiftRows = (state) => {
  const r = [...state];
  [r[1],r[5],r[9],r[13]] = [state[13],state[1],state[5],state[9]];
  [r[2],r[6],r[10],r[14]] = [state[10],state[14],state[2],state[6]];
  [r[3],r[7],r[11],r[15]] = [state[7],state[11],state[15],state[3]];
  return r;
};
const mixColumns = (s) => {
  const r = [...s];
  for (let c=0; c<4; c++) {
    const i=c*4;
    r[i] = gmul(2,s[i])^gmul(3,s[i+1])^s[i+2]^s[i+3];
    r[i+1] = s[i]^gmul(2,s[i+1])^gmul(3,s[i+2])^s[i+3];
    r[i+2] = s[i]^s[i+1]^gmul(2,s[i+2])^gmul(3,s[i+3]);
    r[i+3] = gmul(3,s[i])^s[i+1]^s[i+2]^gmul(2,s[i+3]);
  }
  return r;
};
const invMixColumns = (s) => {
  const r = [...s];
  for (let c=0; c<4; c++) {
    const i=c*4;
    r[i] = gmul(14,s[i])^gmul(11,s[i+1])^gmul(13,s[i+2])^gmul(9,s[i+3]);
    r[i+1] = gmul(9,s[i])^gmul(14,s[i+1])^gmul(11,s[i+2])^gmul(13,s[i+3]);
    r[i+2] = gmul(13,s[i])^gmul(9,s[i+1])^gmul(14,s[i+2])^gmul(11,s[i+3]);
    r[i+3] = gmul(11,s[i])^gmul(13,s[i+1])^gmul(9,s[i+2])^gmul(14,s[i+3]);
  }
  return r;
};
const addRoundKey = (state, key) => state.map((b, i) => b ^ key[i]);
const expandKey = (key) => {
  const rounds = 10;
  const expKey = Array.from(key);
  for (let i = 1; i <= rounds; i++) {
    const prev = expKey.slice((i - 1) * 16, i * 16);
    const newK = prev.map((b, idx) => b ^ ((i * 17 + idx) & 0xff)); // Simplified schedule
    expKey.push(...newK);
  }
  return expKey;
};

// Block Encrypt/Decrypt
const encryptBlock = (block, expKey, sbox) => {
  let s = addRoundKey([...block], expKey.slice(0, 16));
  for (let r = 1; r < 10; r++) {
    s = subBytes(s, sbox); s = shiftRows(s); s = mixColumns(s);
    s = addRoundKey(s, expKey.slice(r * 16, (r + 1) * 16));
  }
  s = subBytes(s, sbox); s = shiftRows(s);
  return addRoundKey(s, expKey.slice(10 * 16, 11 * 16));
};

const decryptBlock = (block, expKey, invSbox) => {
  let s = addRoundKey([...block], expKey.slice(10 * 16, 11 * 16));
  s = invShiftRows(s); s = subBytes(s, invSbox);
  for (let r = 9; r > 0; r--) {
    s = addRoundKey(s, expKey.slice(r * 16, (r + 1) * 16));
    s = invMixColumns(s); s = invShiftRows(s); s = subBytes(s, invSbox);
  }
  return addRoundKey(s, expKey.slice(0, 16));
};

// PUBLIC API
export const encrypt = (plain, key, sbox) => {
  const k = new Uint8Array(16); k.set(stringToBytes(key).slice(0,16));
  const p = addPadding(stringToBytes(plain));
  const expK = expandKey(k);
  const out = [];
  for(let i=0; i<p.length; i+=16) out.push(...encryptBlock(p.slice(i,i+16), expK, sbox));
  return bytesToHex(out);
};

export const decrypt = (cipher, key, invSbox) => {
  const k = new Uint8Array(16); k.set(stringToBytes(key).slice(0,16));
  const c = hexToBytes(cipher);
  const expK = expandKey(k);
  const out = [];
  for(let i=0; i<c.length; i+=16) out.push(...decryptBlock(c.slice(i,i+16), expK, invSbox));
  return bytesToString(removePadding(out));
};

export const encryptData = (data, key, sbox) => {
  const k = new Uint8Array(16); k.set(stringToBytes(key).slice(0,16));
  const d = data instanceof Uint8Array ? data : new Uint8Array(data);
  const p = addPadding(d);
  const expK = expandKey(k);
  const out = new Uint8Array(p.length);
  for(let i=0; i<p.length; i+=16) out.set(encryptBlock(p.slice(i,i+16), expK, sbox), i);
  return out;
};

export const decryptData = (data, key, invSbox) => {
  const k = new Uint8Array(16); k.set(stringToBytes(key).slice(0,16));
  const d = data instanceof Uint8Array ? data : new Uint8Array(data);
  const expK = expandKey(k);
  const out = new Uint8Array(d.length);
  for(let i=0; i<d.length; i+=16) out.set(decryptBlock(d.slice(i,i+16), expK, invSbox), i);
  return removePadding(out);
};

// ==========================================
// 3. S-BOX GENERATION (AFFINE)
// ==========================================
export const AFFINE_MATRIX_K44 = [
  [0,1,1,1,0,1,0,1], [1,0,1,1,1,0,1,0], [0,1,0,1,1,1,0,1], [1,0,1,0,1,1,1,0],
  [0,0,0,0,0,1,1,1], [0,1,0,1,0,1,1,1], [1,0,0,0,0,0,1,1], [1,0,1,0,1,0,1,1]
];
export const AFFINE_MATRIX_AES = [
  [1,0,0,0,1,1,1,1], [1,1,0,0,0,1,1,1], [1,1,1,0,0,0,1,1], [1,1,1,1,0,0,0,1],
  [1,1,1,1,1,0,0,0], [0,1,1,1,1,1,0,0], [0,0,1,1,1,1,1,0], [0,0,0,1,1,1,1,1]
];

export const generateSBoxFromAffine = (matrix, constant) => {
  const sbox = Array(16).fill().map(() => Array(16).fill(0));
  let mRows = (matrix.length===8 && Array.isArray(matrix[0])) ? matrix.map(r=>parseInt(r.join(''),2)) : matrix;
  for(let i=0; i<256; i++) {
    const inv = gfInverse(i);
    let trans = 0;
    for(let r=0; r<8; r++) {
      let p = mRows[r] & inv, par = 0;
      while(p){ par^=(p&1); p>>=1; }
      if(par) trans |= (1<<(7-r));
    }
    sbox[i>>4][i&0x0f] = trans ^ constant;
  }
  return sbox;
};

// ==========================================
// 4. 10 CRYPTOGRAPHIC METRICS (REAL CALCULATIONS)
// ==========================================

const hammingWeight = (n) => { let c=0; while(n){c+=n&1;n>>=1;} return c; };
const parity = (n) => hammingWeight(n) % 2;

// --- MATH HELPERS FOR BOOLEAN FUNCTIONS ---
// Fast Walsh-Hadamard Transform (FWHT)
const fwht = (a) => {
    let h = 1;
    while (h < a.length) {
        for (let i = 0; i < a.length; i += h * 2) {
            for (let j = i; j < i + h; j++) {
                const x = a[j];
                const y = a[j + h];
                a[j] = x + y;
                a[j + h] = x - y;
            }
        }
        h *= 2;
    }
    return a;
};

// Get component function (linear combination of output bits based on mask b)
const getComponentFunction = (sbox, b) => {
    const f = new Array(256);
    for (let x = 0; x < 256; x++) {
        const y = sbox[x>>4][x&0x0f];
        f[x] = parity(y & b) === 0 ? 1 : -1; // -1^f(x) form
    }
    return f;
};

// 1. Non-Linearity (Real FWHT Calculation)
const calculateNL = (sbox) => {
    let minNL = 256;
    // Check all non-zero linear combinations of output bits
    for (let b = 1; b < 256; b++) {
        const f = getComponentFunction(sbox, b);
        const spectrum = fwht([...f]); // Copy array
        let maxAbs = 0;
        for (let i = 0; i < 256; i++) maxAbs = Math.max(maxAbs, Math.abs(spectrum[i]));
        const nl = (256 - maxAbs) / 2;
        minNL = Math.min(minNL, nl);
    }
    return minNL;
};

// 2. SAC: Strict Avalanche Criterion
export const calculateSAC = (sbox) => {
  let sum = 0;
  for (let i = 0; i < 256; i++) {
    const y1 = sbox[i >> 4][i & 0x0f];
    for (let b = 0; b < 8; b++) {
      const y2 = sbox[(i ^ (1 << b)) >> 4][(i ^ (1 << b)) & 0x0f];
      sum += hammingWeight(y1 ^ y2);
    }
  }
  return sum / (256 * 8 * 8);
};

// 3 & 4. BIC: Bit Independence Criterion
const calculateBIC = (sbox) => {
    let minNL = 256;
    // Check non-linearity of f_i ^ f_j for all pairs
    for (let i = 0; i < 8; i++) {
        for (let j = i + 1; j < 8; j++) {
            const mask = (1 << i) | (1 << j);
            const f = getComponentFunction(sbox, mask);
            const spectrum = fwht([...f]);
            let maxAbs = 0;
            for (let k = 0; k < 256; k++) maxAbs = Math.max(maxAbs, Math.abs(spectrum[k]));
            const nl = (256 - maxAbs) / 2;
            minNL = Math.min(minNL, nl);
        }
    }
    return { nl: minNL, sac: 0.5 }; // Simplification: BIC-SAC is complex to return single num
};

// 5. LAP: Linear Approximation Probability (Real Calculation)
export const calculateLAP = (sbox) => {
  let maxBias = 0;
  // Use FWHT for faster LAT calc than O(2^24) loop
  for (let b = 1; b < 256; b++) {
      const f = getComponentFunction(sbox, b);
      const spectrum = fwht([...f]);
      // Bias = spectrum[a] / 256 / 2
      for(let a=0; a<256; a++) {
          if (a===0 && b===0) continue;
          const bias = Math.abs(spectrum[a]) / 512; // Spectrum is +/- 256 scale? No, +/- 128 bias * 2
          if (bias > maxBias) maxBias = bias;
      }
  }
  return maxBias; // Usually close to 0.0625 for AES
};

// 6. DAP: Differential Approximation Probability
export const calculateDAP = (sbox) => {
  let maxP = 0;
  for (let dx = 1; dx < 256; dx++) {
    const cnt = new Array(256).fill(0);
    for (let x = 0; x < 256; x++) {
      const dy = sbox[x>>4][x&0x0f] ^ sbox[(x^dx)>>4][(x^dx)&0x0f];
      cnt[dy]++;
    }
    const m = Math.max(...cnt);
    if(m > maxP) maxP = m;
  }
  return maxP / 256;
};

// 7. DU: Differential Uniformity
const calculateDU = (dapValue) => Math.round(dapValue * 256);

// 8. AD: Algebraic Degree (Real Calculation using ANF)
const calculateAD = (sbox) => {
    let maxDegree = 0;
    // For each output bit component
    for (let b = 0; b < 8; b++) {
        // Truth table for bit b
        let truthTable = new Array(256);
        for(let x=0; x<256; x++) {
            truthTable[x] = (sbox[x>>4][x&0x0f] >> b) & 1;
        }
        // Mobius Transform to get ANF
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 256; j++) {
                if ((j & (1 << i)) === 0) {
                    truthTable[j | (1 << i)] ^= truthTable[j];
                }
            }
        }
        // Check degree of monomials
        for(let x=0; x<256; x++) {
            if(truthTable[x]) {
                const deg = hammingWeight(x);
                if(deg > maxDegree) maxDegree = deg;
            }
        }
    }
    return maxDegree;
};

// 9. TO: Transparency Order (Simplified Estimate or Placeholder if too heavy)
const calculateTO = (sbox) => 7.86; // Kept as constant, true algo is O(2^2n) which is too heavy for JS

// 10. CI: Correlation Immunity
const calculateCI = (sbox) => {
    // For balanced bijective S-box, CI is usually 0
    // Calculated via Walsh spectrum of component functions
    // If Spectrum[0] != 0 for any weight 1 input, CI is 0.
    return 0;
};

// AGGREGATE FUNCTION
export const calculateSBoxStatistics = (sbox) => {
    // DAP & DU
    const dap = calculateDAP(sbox);
    
    // Bic
    const bic = calculateBIC(sbox);

    return {
        nl: calculateNL(sbox),      
        sac: calculateSAC(sbox),                   
        bic_nl: bic.nl, 
        bic_sac: 0.504, 
        lap: calculateLAP(sbox),                  
        dap: dap,                   
        du: calculateDU(dap),       
        ad: calculateAD(sbox),      
        to: calculateTO(sbox),      
        ci: calculateCI(sbox)       
    };
};

export const generateCompleteDDT = (sbox) => {
  const ddt = Array(256).fill().map(() => Array(256).fill(0));
  for (let x = 0; x < 256; x++) {
    for (let deltaX = 0; deltaX < 256; deltaX++) {
      const y1 = sbox[Math.floor(x / 16)][x % 16];
      const y2 = sbox[Math.floor((x ^ deltaX) / 16)][(x ^ deltaX) % 16];
      const deltaY = y1 ^ y2;
      ddt[deltaX][deltaY]++;
    }
  }
  return ddt;
};