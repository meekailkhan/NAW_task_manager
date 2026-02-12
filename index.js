import app from './src/app.js'
import { connectDB } from './src/confing/db.js';
import env from "./src/confing/env.js"


const start = async()=>{
    await connectDB()

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
}

start()