import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import Templates from "./Templates";
import LoadingState from "./modals/LoadingState";
import { prepareWhatsAppTextMessage } from "../utils";

const Message: React.FC = () => {
   const { selectedTemplate, selectedContacts, setProgressOpen, setAlertActive, setAlertFailed, setAlertText } =
      useAppStore();
   const [debounce, setDebounce] = useState(100);
   const [message, setMessage] = useState(selectedTemplate?.content || "");
   const [mock, setMock] = useState({
      failed: 0,
      success: 0,
   });

   useEffect(() => {
      setMessage(selectedTemplate?.content || "");
   }, [selectedTemplate]);

   const handleSend = async () => {
      setProgressOpen(true);
      setMock({ success: 0, failed: 0 });

      for (let i = 0; i < selectedContacts.length; i++) {
         // Wait debounce ms before sending each message
         if (i !== 0) {
            await new Promise((resolve) => setTimeout(resolve, debounce));
         }

         // Prepare the message payload
         const { url, payload, headers } = prepareWhatsAppTextMessage({
            to: "+" + selectedContacts[i].contact!.toString(),
            body: message,
            previewUrl: true,
         });

         try {
            const response = await fetch(url, {
               method: "POST",
               headers,
               body: JSON.stringify(payload),
            });

            // Attempt to parse response body as JSON (if applicable)
            const data = await response.json().catch(() => null);

            setMock((prev) => ({
               ...prev,
               success: prev.success + (response.ok ? 1 : 0),
            }));

            if (!response.ok) throw new Error(data.error.message);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
         } catch (error: any) {
            setMock((prev) => ({
               ...prev,
               failed: prev.failed + 1,
            }));
            setAlertActive(true);
            setAlertFailed(true);
            setAlertText(error.message);
         }
      }
   };

   return (
      <div className="p-4 max-w-xl mx-auto">
         <div className="flex items-center justify-between border-b pb-2 mb-4">
            <h1 className="text-xl font-semibold">Message</h1>
            <Templates />
         </div>
         <div className="space-y-2 max-h-96">
            <div className="relative">
               <textarea
                  placeholder="Type your message here..."
                  className="textarea textarea-bordered w-full h-48 resize-none pr-8"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
               />
            </div>
         </div>
         <div className="flex items-start flex-col space-x-4 mt-4">
            <div className="flex items-center gap-4">
               <label htmlFor="debounce" className="text-sm text-gray-600 text-right">
                  Delay:
               </label>

               <div className="flex items-center gap-2 w-64">
                  <button
                     onClick={() => setDebounce((prev) => Math.max(0, prev - 100))}
                     className="px-2 py-1 text-lg font-bold rounded hover:scale-125 active:scale-100"
                     type="button"
                  >
                     –
                  </button>

                  <input
                     id="debounce"
                     type="range"
                     min={0}
                     max={10000}
                     step={100}
                     value={debounce}
                     onChange={(e) => setDebounce(Number(e.target.value))}
                     className="range range-sm flex-grow"
                  />

                  <button
                     onClick={() => setDebounce((prev) => Math.min(10000, prev + 100))}
                     className="px-2 py-1 text-lg font-bold rounded hover:scale-125 active:scale-100"
                     type="button"
                  >
                     +
                  </button>
                  {/* Show local range for instant feedback */}
                  <span className="text-sm text-gray-600 w-12 text-right">{debounce / 1000}s</span>
               </div>
            </div>
            <button
               className="btn btn-accent"
               onClick={handleSend}
               disabled={selectedContacts.length === 0 || message.trim() === ""}
            >
               Send
            </button>
         </div>
         <LoadingState totalRecivers={selectedContacts.length} sent={mock.success} failed={mock.failed} />
      </div>
   );
};

export default Message;
