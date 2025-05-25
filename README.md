# WhatsApp Message Sender App

A web-based application that allows you to send messages to WhatsApp contacts using the WhatsApp Cloud API.

## 🚀 Features

-  ✅ **Send Text Messages**  
   Supports sending plain text messages (with optional URL previews) to individual WhatsApp users via the Cloud API.

-  ✅ **Progress Feedback with Animations**  
   Includes dynamic progress indicators showing the sending status, including:

   -  Delay progress (based on debounce time between messages)
   -  Successfully sent
   -  Failed messages

-  ✅ **Template Verification Flow**  
   Automatically sends a pre-approved template message (`hello_world`) as required by WhatsApp Cloud API before allowing regular text messages.

-  ✅ **Contact Selection & Verification Status**  
   Contacts are displayed with selection options and verification indicators to distinguish between test-ready numbers and others.

-  ✅ **Zustand Global Store**  
   Lightweight state management with Zustand for managing alerts, selected contacts, templates, and verification flow.

-  ✅ **Alert System**  
   Visual success or failure alerts appear and disappear automatically after a few seconds.

## 🛠 Tech Stack

-  **React + TypeScript**
-  **Tailwind CSS**
-  **Zustand** for state management
-  **Fetch API** for HTTP requests
-  **DaisyUI** for UI components

---

## ⚠️ WhatsApp Cloud API Limitations

Due to restrictions imposed by the WhatsApp Cloud API, there are important usage limitations:

### 1. ✅ Pre-approved Template Must Be Sent First

-  **Requirement:** You must send a pre-approved template message (e.g., `hello_world`) to a contact **before** sending any regular text message.
-  **Why?** This ensures the recipient has opted-in or is recognized by WhatsApp as having accepted messages from your business.
-  **Solution:** A **"Verify"** button is shown in the app next to unverified contacts. When clicked, it sends the required template message.

### 2. ⚠️ Contacts Must Be Added to WhatsApp Business Manager

-  Any recipient phone number must be manually added and approved in the **WhatsApp Business Manager** under **Test Numbers**.
-  Without this step, you will receive a `403` error or `recipient not allowed` error even if the number is real.

---

## ✅ Setup & Configuration

### 1. Clone the repo

````bash
git clone https://github.com/yourusername/whatsapp-sender-app.git
cd whatsapp-sender-app


```bash
npm install
````

```env
<!-- free of use my supabase key -->
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjcHZ1bml4cXhrZnNncXdvaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwOTQzNjUsImV4cCI6MjA2MzY3MDM2NX0.tD8QiBVadN7yjEJobjp7CSe2x8Zpwsbpn3v24qyUdGk

VITE_PHONE_ID=your_whatsapp_phone_number_id
VITE_ACCESS_TOKEN=your_whatsapp_access_token
```
