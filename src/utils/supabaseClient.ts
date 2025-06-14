
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zughhzyowlmdsyhvvnop.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Z2hoenlvd2xtZHN5aHZ2bm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzgyODcsImV4cCI6MjA2NTM1NDI4N30.EHZLXN73tresM5bCbDXzgMpipDJGtxqXgaAazXRqHOo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
