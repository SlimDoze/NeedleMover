const dotenv = require('dotenv');
dotenv.config();

export default {
  expo: {
    // Your other Expo configuration...
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
};