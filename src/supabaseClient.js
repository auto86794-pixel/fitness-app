import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gcgjciuyjjopxmtspwvg.supabase.co";
const supabaseAnonKey = "sb_publishable_Dl3Z0oeJri7m0sZe862D0w_f4KYEjeX";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;