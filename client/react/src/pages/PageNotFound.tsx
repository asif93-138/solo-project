import { Link } from "react-router";


const PageNotFound = () => {
    return (
        <div className="mt-10 text-center">
            <h2 className="text-5xl">404</h2>
            <h4 className="text-2xl my-4">Page not found!</h4>
            <Link to="/"><button className="btn p-3 min-h-0 h-auto">Return Home</button></Link>
        </div>
    );
};

export default PageNotFound;