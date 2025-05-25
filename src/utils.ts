import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

export const isPhoneValid = (phone: string) => {
   try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
   } catch (error) {
      return false;
   }
};

interface WhatsAppMessagePayload {
   messaging_product: "whatsapp";
   recipient_type: "individual";
   to: string;
   type: "text";
   text: {
      preview_url: boolean;
      body: string;
   };
}

interface PrepareMessageParams {
   to: string;
   body: string;
   previewUrl?: boolean;
}

export const prepareWhatsAppTextMessage = ({
   to,
   body,
   previewUrl = false,
}: PrepareMessageParams): {
   url: string;
   payload: WhatsAppMessagePayload;
   headers: Record<string, string>;
} => {
   const url = `https://graph.facebook.com/v22.0/${import.meta.env.VITE_PHONE_ID}/messages`;

   const payload: WhatsAppMessagePayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: {
         preview_url: previewUrl,
         body,
      },
   };

   const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
   };

   return { url, payload, headers };
};

export const handleSendTemplate = async (phone: string) => {
   const response = await fetch(`https://graph.facebook.com/v18.0/${import.meta.env.VITE_PHONE_ID}/messages`, {
      method: "POST",
      headers: {
         Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         messaging_product: "whatsapp",
         to: phone,
         type: "template",
         template: {
            name: "hello_world",
            language: {
               code: "en_US",
            },
         },
      }),
   });

   const result = await response.json();
   console.log("Template response:", result);

   return response;
};
