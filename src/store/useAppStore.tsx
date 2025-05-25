import { create } from "zustand";
import type { Contact, Template } from "../types";

type AppStore = {
   contacts: Contact[];
   selectedContacts: Contact[];
   templates: Template[];
   selectedTemplate: Template | null;
   alertActive: boolean;
   alertFailed: boolean;
   alertText: string;
   message: string;
   progressOpen: boolean;

   setAlertFailed: (alertFailed: boolean) => void;
   setAlertText: (alertText: string) => void;
   setAlertActive: (alertActive: boolean) => void;
   setProgressOpen: (progressOpen: boolean) => void;
   setContacts: (contacts: Contact[]) => void;
   setSelectedContacts: (contacts: Contact[]) => void;
   setTemplates: (templates: Template[]) => void;
   setSelectedTemplate: (template: Template | null) => void;

   reset: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
   contacts: [],
   selectedContacts: [],
   templates: [],
   selectedTemplate: null,
   alertActive: false,
   alertFailed: false,
   alertText: "",
   message: "",
   progressOpen: false,

   setAlertFailed: (alertFailed) => set({ alertFailed }),
   setAlertText: (alertText) => set({ alertText }),
   setAlertActive: (alertActive) => set({ alertActive }),
   setProgressOpen: (progressOpen) => set({ progressOpen }),
   setContacts: (contacts) => set({ contacts }),
   setSelectedContacts: (contacts) => set({ selectedContacts: contacts }),
   setTemplates: (templates) => set({ templates }),
   setSelectedTemplate: (template) => set({ selectedTemplate: template }),

   reset: () =>
      set({
         selectedContacts: [],
         selectedTemplate: null,
         alertActive: false,
         alertFailed: false,
         alertText: "",
         message: "",
         progressOpen: false,
      }),
}));
