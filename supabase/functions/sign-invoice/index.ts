
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.5'
import { encode as encodeHex } from 'https://deno.land/std@0.170.0/encoding/hex.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

async function generateRSAKeyPairIfNeeded() {
  // Try get private key from secrets
  const privateKeyPem = Deno.env.get("INVOICE_PRIVATE_KEY");
  if (privateKeyPem) {
    // Import
    const pkcs8 = privateKeyPem
      .replace(/-----BEGIN PRIVATE KEY-----/, '')
      .replace(/-----END PRIVATE KEY-----/, '')
      .replace(/\s+/g, '');
    const binaryDerString = atob(pkcs8);
    const binaryDer = new Uint8Array(Array.from(binaryDerString, ch => ch.charCodeAt(0)));
    try {
      const key = await crypto.subtle.importKey(
        "pkcs8",
        binaryDer.buffer,
        {
          name: "RSASSA-PKCS1-v1_5",
          hash: "SHA-256",
        },
        true,
        ["sign"]
      );
      return { key, privateKeyPem };
    } catch (_e) {
      // fallback to generate
    }
  }
  // Generate new keypair
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  );
  // Export the private key as PEM
  const exported = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  const exportedAsBase64 = arrayBufferToBase64(exported);
  const pemExported = [
    "-----BEGIN PRIVATE KEY-----",
    exportedAsBase64.match(/.{1,64}/g)?.join('\n'),
    "-----END PRIVATE KEY-----",
  ].join('\n');
  // Store as secret
  // This is a NO-OP here, but in a real production setup, 
  // you must use CLI/API to set the Supabase secret after getting this PEM! 
  // For the Lovable/Supabase edge function, envs are static after deploy: 
  // So, for *persistency*, you need to copy the PEM from the logs and set it using the Secrets UI. 
  // For now, return it as "newPrivateKeyPem" to surface to the operator.
  return { key: keyPair.privateKey, privateKeyPem: pemExported, newPrivateKeyPem: pemExported, publicKey: keyPair.publicKey };
}

async function exportPublicKeyPEM(publicKey: CryptoKey): Promise<string> {
  const spki = await crypto.subtle.exportKey("spki", publicKey);
  const exportedAsBase64 = arrayBufferToBase64(spki);
  const pemExported = [
    "-----BEGIN PUBLIC KEY-----",
    exportedAsBase64.match(/.{1,64}/g)?.join('\n'),
    "-----END PUBLIC KEY-----",
  ].join('\n');
  return pemExported;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { payload } = await req.json();

    // Validate required payload fields
    const requiredFields = [
      'user_id', 'invoice_number', 'total_amount', 'issue_date', 'client_id', 'previous_hash'
    ];
    for (const field of requiredFields) {
      if (!(field in payload)) {
        return new Response(JSON.stringify({ error: `Missing required field: ${field}` }), {
          headers: { ...corsHeaders, "content-type": "application/json" },
          status: 400
        });
      }
    }

    // 1. Generate/Import private key
    const keyResult = await generateRSAKeyPairIfNeeded();

    let privateKey = (keyResult as any).key;
    let privateKeyPem = (keyResult as any).privateKeyPem;
    let newKeyGenerated = !!(keyResult as any).newPrivateKeyPem;
    let publicKeyObj = (keyResult as any).publicKey;

    // 2. If new key, also export public key PEM
    let publicKeyPem: string | null = null;
    if (publicKeyObj) {
      publicKeyPem = await exportPublicKeyPEM(publicKeyObj);
    }

    // 3. Build data string (serialize significant fiscal data + previous_hash)
    const canonicalString = [
      payload.user_id,
      payload.invoice_number,
      payload.total_amount,
      payload.issue_date,
      payload.client_id,
      payload.previous_hash || ''
    ].join('|');
    // 4. Hash the canonical string
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalString));
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
    // 5. Sign the hash
    const signatureBuffer = await crypto.subtle.sign(
      {
        name: "RSASSA-PKCS1-v1_5"
      },
      privateKey,
      hashBuffer
    );
    const signatureBase64 = arrayBufferToBase64(signatureBuffer);

    // Return both hash and signature
    const responseBody: any = {
      hash: hashHex,
      signature: signatureBase64
    };
    if (newKeyGenerated && publicKeyPem) {
      responseBody.new_private_key_pem = (keyResult as any).newPrivateKeyPem;
      responseBody.public_key_pem = publicKeyPem;
      responseBody.notice = "ATENÇÃO: Guarde a nova chave privada com segurança! Copie para o Supabase Secret INVOICE_PRIVATE_KEY.";
    } else if (publicKeyPem) {
      responseBody.public_key_pem = publicKeyPem;
    }
    // Log for diagnostics (only for operator, not for user interface)
    console.log(JSON.stringify({
      generated_key: !!newKeyGenerated,
      user_id: payload.user_id,
      invoice_number: payload.invoice_number,
      hash: hashHex,
      public_key_pem: publicKeyPem ? publicKeyPem.substring(0, 200) + "..." : undefined,
      time: new Date().toISOString()
    }));
    return new Response(JSON.stringify(responseBody), {
      headers: { ...corsHeaders, "content-type": "application/json" }
    });
  } catch (error) {
    console.error("Erro na sign-invoice:", error);
    return new Response(JSON.stringify({ error: error.message || error.toString() }), {
      headers: { ...corsHeaders, "content-type": "application/json" },
      status: 500
    });
  }
});
