import { useState } from "react";
import { PhoneInput } from "react-international-phone";
import { db } from "../../db";
import { isPhoneValid } from "../../utils";
import { useAppStore } from "../../store/useAppStore";

const AddContact: React.FC = () => {
   const [phone, setPhone] = useState("");
   const [name, setName] = useState("");
   const [loading, setLoading] = useState(false);
   const { setAlertActive, setAlertFailed, setAlertText, setContacts, contacts } = useAppStore();

   const valid = isPhoneValid(phone);

   const handleSubmit = async () => {
      if (!valid) return;

      try {
         setLoading(true);
         console.log({
            name: name,
            contact: Number(phone.replace(/\D/g, "")),
         });

         const contact = await db.contacts.insert({
            name: name,
            contact: Number(phone.replace(/\D/g, "")),
         });

         setContacts([...contacts, contact]);

         console.log("Contact added successfully:", contact);
         setName("");
         setPhone("");
         setAlertActive(true);
         setAlertFailed(false);
         setAlertText("Contact added successfully");
      } catch (error) {
         setAlertActive(true);
         setAlertFailed(true);
         setAlertText("Server error adding contact");
         console.error("Error adding contact:", error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         <label htmlFor="my_modal_6" className="btn btn-accent">
            Add contact
         </label>
         <input type="checkbox" id="my_modal_6" className="modal-toggle" />
         <div className="modal" role="dialog">
            <div className="modal-box">
               <h3 className="text-lg font-bold mb-2">Add contact</h3>
               <input
                  type="text"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full"
               />
               <div className="divider"></div>
               <PhoneInput
                  defaultCountry="kg"
                  placeholder="996777888777"
                  value={phone}
                  defaultMask=""
                  onChange={setPhone}
                  className="input input-bordered w-full"
               />

               {!valid && phone.length > 0 && (
                  <div className="text-red-500 mt-1 text-sm">Phone number is not valid</div>
               )}

               <div className="modal-action flex justify-between">
                  <button onClick={handleSubmit} className="btn btn-primary" disabled={loading || !valid || !name}>
                     {loading ? "Saving..." : "Add"}
                  </button>
                  <label htmlFor="my_modal_6" className="btn">
                     Close
                  </label>
               </div>
            </div>
         </div>
      </>
   );
};

export default AddContact;
