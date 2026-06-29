import emailjs from "@emailjs/browser";
const SERVICE_ID = "service_a54nm3r";
const PUBLIC_KEY = "FYOriEIArK3tXNeAg";
const OTP_TEMPLATE = "template_aj6xot2";
const ORDER_TEMPLATE = "template_vze2tkb";




emailjs.init({ publicKey: PUBLIC_KEY });

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpEmail(params: {
  to_email: string;
  user_name: string;
  otp: string;
  store_name?: string;
}) {
  return emailjs.send(SERVICE_ID, OTP_TEMPLATE, {
    to_email: params.to_email,
    user_email: params.to_email,
    email: params.to_email,
    user_name: params.user_name,
    name: params.user_name,
    otp: params.otp,
    passcode: params.otp,
    store_name: params.store_name ?? "Afribuy",
  });
}

export async function sendOrderEmail(params: {
  to_email: string;
  user_name: string;
  order_id: string;
  amount: number | string;
  store_name?: string;
}) {
  return emailjs.send(SERVICE_ID, ORDER_TEMPLATE, {
    to_email: params.to_email,
    user_email: params.to_email,
    email: params.to_email,
    user_name: params.user_name,
    name: params.user_name,
    order_id: params.order_id,
    amount: String(params.amount),
    store_name: params.store_name ?? "Afribuy",
  });
}
