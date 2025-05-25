import { useEffect, useState } from "react";
import AddTemplate from "./modals/AddTemplate";
import { db } from "../db";
import { Edit2, Trash2, Check, X } from "lucide-react";
import type { Template } from "../types";
import { useAppStore } from "../store/useAppStore";

const Templates: React.FC = () => {
   const { templates, setTemplates, setSelectedTemplate } = useAppStore();
   const [loading, setLoading] = useState(false);
   const [editingId, setEditingId] = useState<number | null>(null);
   const [editTitle, setEditTitle] = useState("");
   const [editContent, setEditContent] = useState("");
   const [saving, setSaving] = useState(false);
   const [deletingId, setDeletingId] = useState<number | null>(null);

   useEffect(() => {
      const fetchTemplates = async () => {
         setLoading(true);
         try {
            const allTemplates = await db.templates.get();
            setTemplates(allTemplates);
         } catch (error) {
            console.error("Failed to fetch templates:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchTemplates();
   }, [setTemplates]);

   const startEditing = (template: Template) => {
      setEditingId(template.id ?? null);
      setEditTitle(template.title);
      setEditContent(template.content);
   };

   const cancelEditing = () => {
      setEditingId(null);
      setEditTitle("");
      setEditContent("");
   };

   const saveEdit = async () => {
      if (!editTitle.trim() || !editContent.trim()) {
         alert("Please enter both title and content.");
         return;
      }
      if (editingId === null) return;

      try {
         setSaving(true);
         await db.templates.update({
            id: editingId,
            title: editTitle.trim(),
            content: editContent.trim(),
         });

         const currentTemplates = useAppStore.getState().templates;
         const updatedTemplates = currentTemplates.map((t) =>
            t.id === editingId ? { ...t, title: editTitle.trim(), content: editContent.trim() } : t,
         );
         setTemplates(updatedTemplates);
         cancelEditing();
      } catch (error) {
         console.error("Error updating template:", error);
      } finally {
         setSaving(false);
      }
   };

   const deleteTemplate = async (id: number) => {
      if (!confirm("Are you sure you want to delete this template?")) return;

      try {
         setDeletingId(id);
         await db.templates.delete(id.toString());

         const currentTemplates = useAppStore.getState().templates;
         const updatedTemplates = currentTemplates.filter((t) => t.id !== id);
         setTemplates(updatedTemplates);

         if (editingId === id) cancelEditing();
      } catch (error) {
         console.error("Error deleting template:", error);
      } finally {
         setDeletingId(null);
      }
   };

   return (
      <div className="drawer drawer-end max-w-fit">
         <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
         <div className="drawer-content ">
            <label htmlFor="my-drawer-4" className="btn btn-accent">
               Templates
            </label>
         </div>
         <AddTemplate />
         <div className="drawer-side ">
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="w-80 p-4 menu min-h-full bg-base-200 text-base-content">
               <label htmlFor="add-template-modal" className="btn btn-accent mb-2">
                  Add Template
               </label>
               <div className="divider"></div>

               {loading && <li>Loading templates...</li>}

               {!loading && templates.length === 0 && <li>No templates found</li>}

               {templates.map(({ id, title, content }) => (
                  <li key={id} className="bg-base-100 border border-base-300 mb-2">
                     <label className="collapse bg-base-100 border border-base-300 ">
                        <input type="radio" name="my-accordion-1" />
                        <div className="collapse-title font-semibold flex justify-between w-full items-center">
                           {editingId === id ? (
                              <input
                                 type="text"
                                 className="input input-sm input-bordered flex-grow mr-2 z-10"
                                 value={editTitle}
                                 onChange={(e) => setEditTitle(e.target.value)}
                              />
                           ) : (
                              title
                           )}
                        </div>

                        <div className="collapse-content text-sm">
                           {editingId === id ? (
                              <textarea
                                 className="textarea textarea-bordered w-full"
                                 rows={4}
                                 value={editContent}
                                 onChange={(e) => setEditContent(e.target.value)}
                              />
                           ) : (
                              content
                           )}

                           <div className="flex space-x-2 mt-2.5 justify-between">
                              {editingId === id ? (
                                 <>
                                    <button
                                       onClick={saveEdit}
                                       disabled={saving}
                                       className="btn btn-xs btn-success z-10"
                                       title="Save"
                                    >
                                       <Check />
                                    </button>
                                    <button
                                       onClick={cancelEditing}
                                       disabled={saving}
                                       className="btn btn-xs btn-warning z-10"
                                       title="Cancel"
                                    >
                                       <X />
                                    </button>
                                 </>
                              ) : (
                                 <>
                                    <button
                                       className="z-10 cursor-pointer"
                                       onClick={() => startEditing({ id: id!, title, content })}
                                       title="Edit"
                                    >
                                       <Edit2 className="hover:stroke-green-300" size={20} />
                                    </button>
                                    <button
                                       className="z-10 cursor-pointer"
                                       onClick={() => id && deleteTemplate(id)}
                                       title="Delete"
                                       disabled={deletingId === id}
                                    >
                                       <Trash2 className="hover:stroke-red-300" size={20} />
                                    </button>
                                    <button
                                       className="z-10 btn btn-secondary cursor-pointer"
                                       title="Select Template"
                                       onClick={() => setSelectedTemplate({ id, title, content })}
                                    >
                                       Select Template
                                    </button>
                                 </>
                              )}
                           </div>
                        </div>
                     </label>
                  </li>
               ))}
            </ul>
         </div>
      </div>
   );
};

export default Templates;
