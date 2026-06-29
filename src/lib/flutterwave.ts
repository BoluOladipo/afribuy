export const FLW_PUBLIC_KEY = "FLWPUBK-a3deaf49f06ff8900dd8db968e1d5978-X";

declare global {
  interface Window {
    FlutterwaveCheckout?: (config: any) => void;
  }
}

let scriptPromise: Promise<void> | null = null;
export function loadFlutterwave(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.FlutterwaveCheckout) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.flutterwave.com/v3.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Flutterwave"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export interface FlwPayParams {
  amount: number;
  email: string;
  name: string;
  phone?: string;
  tx_ref: string;
  onSuccess: (response: any) => void;
  onClose: () => void;
}

export async function payWithFlutterwave(p: FlwPayParams) {
  await loadFlutterwave();
  window.FlutterwaveCheckout!({
    public_key: FLW_PUBLIC_KEY,
    tx_ref: p.tx_ref,
    amount: p.amount,
    currency: "NGN",
    payment_options: "card,banktransfer,ussd",
    customer: {
      email: p.email,
      name: p.name,
      phone_number: p.phone || "",
    },
    customizations: {
      title: "Afribuy",
      description: "Order Payment",
    },
    callback: (response: any) => {
      p.onSuccess(response);
    },
    onclose: () => p.onClose(),
  });
}
