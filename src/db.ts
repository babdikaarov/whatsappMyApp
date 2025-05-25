// db.ts
import { createClient } from "@supabase/supabase-js";
import type { Contact } from "./types";

const supabaseUrl = "https://gcpvunixqxkfsgqwoinu.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
console.log(supabaseKey);
const supabase = createClient(supabaseUrl, supabaseKey);

type QueryFilter = {
   column: string;
   operator: "eq" | "gt" | "lt" | "gte" | "lte" | "like" | "ilike" | "is" | "in" | "neq";
   value: any;
};

type Range = {
   from: number;
   to: number;
};

function applyFilters(query: any, filters?: QueryFilter[]) {
   if (!filters) return query;
   filters.forEach(({ column, operator, value }) => {
      if (operator === "in" && Array.isArray(value)) {
         query = query.in(column, value);
      } else {
         query = query[operator](column, value);
      }
   });
   return query;
}

function applyRange(query: any, range?: Range) {
   if (range) {
      return query.range(range.from, range.to);
   }
   return query;
}

type WithOptionalId = { id?: number };

function createTableApi<T extends WithOptionalId>(tableName: string) {
   return {
      get: async (filters?: QueryFilter[], range?: Range): Promise<T[]> => {
         let query = supabase.from<T>(tableName).select("*");
         query = applyFilters(query, filters);
         query = applyRange(query, range);

         const { data, error } = await query;
         if (error) throw error;
         return data || [];
      },

      getById: async (id: string): Promise<T | null> => {
         const { data, error } = await supabase.from<T>(tableName).select("*").eq("id", id).single();
         if (error) throw error;
         return data;
      },

      insert: async (obj: Omit<T, "id">): Promise<T> => {
         const { data, error } = await supabase.from<T>(tableName).insert([obj]).select();
         if (error) throw error;
         return data![0];
      },

      update: async (obj: T): Promise<T> => {
         if (!obj.id) throw new Error("Missing id for update");
         const { id, ...rest } = obj;
         const { data, error } = await supabase.from<T>(tableName).update(rest).eq("id", id).select();
         if (error) throw error;
         return data![0];
      },

      delete: async (id: string): Promise<void> => {
         const { error } = await supabase.from(tableName).delete().eq("id", id);
         if (error) throw error;
      },
   };
}

export const db = {
   contacts: createTableApi<Contact>("contacts"),
   templates: createTableApi<{ id?: number; title: string; content: string }>("templates"),
};
