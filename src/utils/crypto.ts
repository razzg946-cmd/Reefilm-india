/**
 * Secure hashing utility for Enterprise Admin Authentication.
 * Never stores plain-text passwords or exposes them in the frontend.
 */

/**
 * Computes the SHA-256 hash of a string using the Web Crypto API,
 * with a robust pure JS fallback if called in a non-secure/test environment.
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(password);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      return hashHex;
    }
  } catch (e) {
    console.warn("Web Crypto API failed, using standard fallback", e);
  }

  // Pure JavaScript SHA-256 implementation fallback
  return sha256Fallback(password);
}

function sha256Fallback(ascii: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = "length";
  let i, j; // Used as a counter across the whole file

  const result: string[] = [];
  const words: number[] = [];
  const asciiLength = ascii[lengthProperty];

  const hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isPrime = (n: number) => {
    for (let factor = 2; factor * factor <= n; factor++) {
      if (n % factor === 0) return false;
    }
    return true;
  };

  let candidate = 2;
  while (primeCounter < 64) {
    if (isPrime(candidate)) {
      if (primeCounter < 8) {
        hash[primeCounter] = ((mathPow(candidate, 1 / 2) % 1) * maxWord) | 0;
      }
      k[primeCounter] = ((mathPow(candidate, 1 / 3) % 1) * maxWord) | 0;
      primeCounter++;
    }
    candidate++;
  }

  let asciiBitLength = asciiLength * 8;
  const wordsLength = ((asciiBitLength + 64) >> 9 << 4) + 15;

  for (i = 0; i < wordsLength; i++) words[i] = 0;

  for (i = 0; i < asciiLength; i++) {
    words[i >> 2] |= (ascii.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }

  words[asciiLength >> 2] |= 0x80 << (24 - (asciiLength % 4) * 8);
  words[wordsLength] = asciiBitLength;

  for (let chunkIndex = 0; chunkIndex < wordsLength; chunkIndex += 16) {
    const w: number[] = [];
    const localHash = [...hash];

    for (i = 0; i < 64; i++) {
      if (i < 16) {
        w[i] = words[chunkIndex + i] | 0;
      } else {
        const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }

      const temp1 = (localHash[7] +
        (rightRotate(localHash[4], 6) ^ rightRotate(localHash[4], 11) ^ rightRotate(localHash[4], 25)) +
        ((localHash[4] & localHash[5]) ^ (~localHash[4] & localHash[6])) +
        k[i] +
        w[i]) | 0;

      const temp2 = ((rightRotate(localHash[0], 2) ^ rightRotate(localHash[0], 13) ^ rightRotate(localHash[0], 22)) +
        ((localHash[0] & localHash[1]) ^ (localHash[0] & localHash[2]) ^ (localHash[1] & localHash[2]))) | 0;

      localHash[7] = localHash[6];
      localHash[6] = localHash[5];
      localHash[5] = localHash[4];
      localHash[4] = (localHash[3] + temp1) | 0;
      localHash[3] = localHash[2];
      localHash[2] = localHash[1];
      localHash[1] = localHash[0];
      localHash[0] = (temp1 + temp2) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + localHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    const hex = (hash[i] >>> 0).toString(16);
    result.push(hex.padStart(8, "0"));
  }

  return result.join("");
}
