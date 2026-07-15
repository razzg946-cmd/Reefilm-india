const pg = require("pg");
require("dotenv").config();

let connStr = process.env.SUPABASE_PG_CONN_STRING || "";
console.log("Original connection string present:", !!connStr);

async function test() {
  if (connStr) {
    try {
      const urlPattern = /^(postgres(?:ql)?:\/\/)([^:]+):(.*)@([^/]+)\/(.+)$/;
      const match = connStr.match(urlPattern);
      
      if (match) {
        const protocol = match[1];
        const user = match[2];
        const rawPassword = match[3];
        const hostPort = match[4];
        const dbname = match[5];
        
        console.log("Parsed User:", user);
        console.log("Parsed Host:", hostPort);
        console.log("Parsed DB:", dbname);
        console.log("Password contains special characters:", /[^a-zA-Z0-9]/.test(rawPassword));
        
        console.log("Connecting with original connection string...");
        const client = new pg.Client({
          connectionString: connStr,
          ssl: { rejectUnauthorized: false }
        });
        await client.connect();
        console.log("Connected successfully with original!");
        await client.end();
      } else {
        console.log("Connection string did not match standard postgres pattern.");
      }
    } catch (err) {
      console.error("Failed with original connection string:", err.message);
      
      // Try the encoded password connection string
      try {
        const match = connStr.match(/^(postgres(?:ql)?:\/\/)([^:]+):(.*)@([^/]+)\/(.+)$/);
        if (match) {
          const protocol = match[1];
          const user = match[2];
          const rawPassword = match[3];
          const hostPort = match[4];
          const dbname = match[5];
          const encodedPassword = encodeURIComponent(rawPassword);
          const newConnStr = `${protocol}${user}:${encodedPassword}@${hostPort}/${dbname}`;
          
          console.log("Connecting with encoded password connection string...");
          const client = new pg.Client({
            connectionString: newConnStr,
            ssl: { rejectUnauthorized: false }
          });
          await client.connect();
          console.log("Connected successfully with encoded password!");
          await client.end();
        }
      } catch (err2) {
        console.error("Failed with encoded password connection string too:", err2.message);
      }
    }
  }
}

test();
