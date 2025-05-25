import { useState } from "react";
import { db } from "../../db";
import { useAppStore } from "../../store/useAppStore";

const AddTemplate: React.FC = () => {
   const { setTemplates, templates, setAlertActive, setAlertFailed, setAlertText } = useAppStore();
   const [loading, setLoading] = useState(false);
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");

   const handleAddTemplate = async () => {
      if (!title.trim() || !content.trim()) {
         setAlertActive(true);
         setAlertFailed(true);
         setAlertText("Please enter both title and content.");
         return;
      }
      try {
         setLoading(true);
         const newTemplate = await db.templates.insert({
            title: title.trim(),
            content: content.trim(),
         });
         setAlertActive(true);
         setAlertFailed(false);
         setAlertText("Template added");
         console.log("Template added:", newTemplate);
         setTemplates([...templates, newTemplate]);
         setTitle("");
         setContent("");
      } catch (error) {
         console.error("Error adding template:", error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         {/* Modal checkbox toggle */}
         <input type="checkbox" id="add-template-modal" className="modal-toggle" />

         <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-template-title"
            aria-describedby="add-template-desc"
         >
            <div className="modal-box ">
               <h3 id="add-template-title" className="text-lg font-bold mb-2">
                  Add Template
               </h3>

               <input
                  type="text"
                  placeholder="Title"
                  className="input input-bordered w-full mb-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
               />
               <textarea
                  placeholder="Content (use {{variables}})"
                  className="textarea textarea-bordered w-full h-24"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
               />

               <div className="divider"></div>

               <div className="modal-action flex justify-between">
                  <button onClick={handleAddTemplate} className="btn btn-primary" disabled={loading}>
                     {loading ? "Saving..." : "Add"}
                  </button>

                  <label htmlFor="add-template-modal" className="btn">
                     Close
                  </label>
               </div>
            </div>
         </div>
      </>
   );
};

export default AddTemplate;
