import app from "./app.js";
import config from "./app/config/index.js";
import MongoDB from "./app/utils/mongodb.util.js";


async function startServer() {
    try {
        await MongoDB.connect(config.db.uri);
        console.log("Connected to MongoDB");

        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.log("Can't connect to MongoDB", err);
        process.exit();
    }
}

startServer();