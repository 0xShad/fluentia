import Vapi from "@vapi-ai/web";

let vapiInstance: Vapi | null = null;

export function getVapiClient(): Vapi {
  if (!vapiInstance) {
    // The public key must be exposed in .env.local as NEXT_PUBLIC_VAPI_PUBLIC_KEY
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    
    if (!publicKey) {
      throw new Error("Missing NEXT_PUBLIC_VAPI_PUBLIC_KEY in environment variables");
    }

    vapiInstance = new Vapi(publicKey);
  }
  
  return vapiInstance;
}
