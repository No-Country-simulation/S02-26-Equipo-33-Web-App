// Export all routers for use in app.ts
import authRoutes from "./auth";
import horseRoutes from "./horses";
import adminRoutes from "./admin";
import chatRoutes from "./chat";
import databaseRoutes from "./dbhealth";

export {
    authRoutes,
    horseRoutes,
    adminRoutes,
    chatRoutes,
    databaseRoutes
}