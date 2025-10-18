import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gmgaczgxhhlybxjagnvu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtZ2Fjemd4aGhseWJ4amFnbnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MDc2NTcsImV4cCI6MjA3NjI4MzY1N30.zm-4j-iI93nw4d7kjAiqwWdo-1n1hoGT3PI1zyolw5g";

export const supabase = createClient(supabaseUrl, supabaseKey);
