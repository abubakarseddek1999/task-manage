import { Outlet } from "react-router-dom";
import { Navbar } from "../component/share/Navbar";

const Main = () => {


    return (

        <div className="bg-gray-50">
            <Navbar/>
            <Outlet />
        </div>
    );
};

export default Main;