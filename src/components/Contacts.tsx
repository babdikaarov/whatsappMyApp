import React, { useEffect, useState } from "react";
import { db } from "../db";
import AddContact from "./modals/AddContact";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { PhoneInput } from "react-international-phone";
import { isPhoneValid } from "../utils";
import { useAppStore } from "../store/useAppStore";
import type { Contact } from "../types";

const Contacts: React.FC = () => {
   const { contacts, setContacts, selectedContacts, setSelectedContacts, setProgressOpen } = useAppStore();

   const [loading, setLoading] = useState(true);
   const [editingId, setEditingId] = useState<number | null>(null);
   const [editName, setEditName] = useState("");
   const [editContact, setEditContact] = useState("");
   const [saving, setSaving] = useState(false);
   const [deletingId, setDeletingId] = useState<number | null>(null);
   const [contactTouched, setContactTouched] = useState(false);

   const valid = isPhoneValid(editContact);

   useEffect(() => {
      const fetchContacts = async () => {
         try {
            const data = await db.contacts.get();

            setContacts(data);
         } catch (error) {
            console.error("Failed to fetch contacts:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchContacts();
   }, [setContacts]);

   const toggleSelectAll = () => {
      setProgressOpen(false);
      if (selectedContacts.length === contacts.length) {
         setSelectedContacts([]);
      } else {
         setSelectedContacts(contacts);
      }
   };

   const toggleSelectOne = (id: number) => {
      setProgressOpen(false);
      const contact = contacts.find((c) => c.id === id);
      if (!contact) return;
      console.log(selectedContacts);
      const exists = selectedContacts.some((c) => c.id === id);
      if (exists) {
         setSelectedContacts(selectedContacts.filter((c) => c.id !== id));
      } else {
         setSelectedContacts([...selectedContacts, contact]);
      }
   };

   const startEditing = (contact: Contact) => {
      setEditingId(contact.id ?? null);
      setEditName(contact.name!);
      setEditContact(String(contact.contact));
      setContactTouched(false);
   };

   const cancelEditing = () => {
      setEditingId(null);
      setEditName("");
      setEditContact("");
      setContactTouched(false);
   };

   const saveEdit = async () => {
      if (!editName.trim() || !editContact.trim()) {
         alert("Please enter both name and contact.");
         return;
      }
      if (editingId === null) return;

      try {
         setSaving(true);
         await db.contacts.update({
            id: editingId,
            name: editName.trim(),
            contact: Number(editContact.trim()),
         });

         const updated = contacts.map((c) =>
            c.id === editingId ? { ...c, name: editName.trim(), contact: Number(editContact.trim()) } : c,
         );
         setContacts(updated);
         cancelEditing();
      } catch (error) {
         console.error("Error updating contact:", error);
         alert("Failed to update contact.");
      } finally {
         setSaving(false);
      }
   };

   const deleteContact = async (id: number) => {
      if (!confirm("Are you sure you want to delete this contact?")) return;

      try {
         setDeletingId(id);
         await db.contacts.delete(id.toString());
         setContacts(contacts.filter((c) => c.id !== id));
         if (editingId === id) cancelEditing();
      } catch (error) {
         console.error("Error deleting contact:", error);
         alert("Failed to delete contact.");
      } finally {
         setDeletingId(null);
      }
   };

   // not possible to implement verification through simple template msg needed manual addition though dashboard !!!

   // const verifyContact = async (phone: number, id: number) => {
   //    try {
   //       const success = await handleSendTemplate(phone.toString());

   //       if (success.ok) {
   //          await db.contacts.update({
   //             id: id,
   //             verified: true,
   //             lastVerified: new Date().toISOString(),
   //          });
   //          console.log(`✅ Verified and updated contact ${phone}`);
   //       } else {
   //          console.warn(`⚠️ Template send failed for ${phone}`);
   //       }
   //    } catch (error) {
   //       console.error("❌ Failed to verify contact", phone, error);
   //    }
   // };

   if (loading) return <div className="p-4">Loading...</div>;

   return (
      <div className="p-4 max-w-xl mx-auto ">
         <div className="flex items-center justify-between border-b pb-2 mb-4">
            <h1 className="text-xl font-semibold">
               Contacts {selectedContacts.length ? `${selectedContacts.length} selected` : ""}
            </h1>
            <div className="flex">
               <AddContact />
               <label className="flex items-center gap-2 cursor-pointer ml-2">
                  <input
                     type="checkbox"
                     checked={selectedContacts.length === contacts.length}
                     onChange={toggleSelectAll}
                     className="checkbox checkbox-sm"
                  />
                  <span>Select All</span>
               </label>
            </div>
         </div>

         <ul className="space-y-2 overflow-scroll min-h-96 scroll-shadow w-5/6 md:w-auto mx-auto">
            {contacts.map((contact) => (
               <li key={contact.id} className="flex items-center gap-4 p-3 border rounded-md">
                  <input
                     type="checkbox"
                     checked={selectedContacts.some((c) => c.id === contact.id)}
                     onChange={() => toggleSelectOne(contact.id!)}
                     className="checkbox checkbox-sm"
                  />

                  <div className="flex-1">
                     {editingId === contact.id ? (
                        <>
                           <input
                              type="text"
                              className="input input-sm input-bordered mb-1 w-full"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                           />
                           <PhoneInput
                              defaultCountry="kg"
                              value={editContact}
                              onChange={(val) => {
                                 setEditContact(val);
                                 setContactTouched(true);
                              }}
                              className="input input-sm input-bordered w-full"
                           />
                           {contactTouched && !valid && (
                              <div className="text-red-500 mt-1 text-sm">Phone number is not valid</div>
                           )}
                        </>
                     ) : (
                        <>
                           <div className="font-medium">{contact.name}</div>
                           <div className="text-sm text-gray-500">{contact.contact}</div>
                        </>
                     )}
                  </div>
                  <div className="flex flex-col">
                     <div className="flex items-center space-x-2">
                        {editingId === contact.id ? (
                           <>
                              <button
                                 onClick={saveEdit}
                                 disabled={saving}
                                 className="btn btn-xs btn-success"
                                 title="Save"
                              >
                                 <Check size={16} />
                              </button>
                              <button
                                 onClick={cancelEditing}
                                 disabled={saving}
                                 className="btn btn-xs btn-warning"
                                 title="Cancel"
                              >
                                 <X size={16} />
                              </button>
                           </>
                        ) : (
                           <>
                              <button
                                 onClick={() => startEditing(contact)}
                                 title="Edit"
                                 className="z-10 cursor-pointer"
                              >
                                 <Edit2 className="hover:stroke-green-300" size={20} />
                              </button>
                              <button
                                 onClick={() => deleteContact(contact.id!)}
                                 disabled={deletingId === contact.id}
                                 title="Delete"
                                 className="z-10 cursor-pointer"
                              >
                                 <Trash2 className="hover:stroke-red-300" size={20} />
                              </button>
                           </>
                        )}
                        {/* logic wount work */}
                        {/* {editingId === contact.id ? null : !contact.verified ? (
                           <button
                              className="btn btn-xs btn-outline"
                              onClick={() => verifyContact(contact.contact!, contact.id!)}
                           >
                              Verify
                           </button>
                        ) : (
                           <span className="badge badge-success text-xs">Verified</span>
                        )} */}
                     </div>
                  </div>
               </li>
            ))}
         </ul>
      </div>
   );
};

export default Contacts;
