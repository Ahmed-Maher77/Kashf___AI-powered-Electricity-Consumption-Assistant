import { RouterProvider } from "react-router-dom";
import AppSplash from "./components/AppSplash/AppSplash";
import { router } from "./routes/router";

const App = () => {
    return (
        <AppSplash>
            <RouterProvider router={router} />
        </AppSplash>
    );
};

export default App;
