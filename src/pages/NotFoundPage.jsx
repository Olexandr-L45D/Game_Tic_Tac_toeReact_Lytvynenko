
import { Link } from "react-router-dom";

export default function NotFoundPage() {

    return (<div>

        <h2> 404 - Not Found Page</h2>
        <p> Plese use this link to go Home <Link to="/">back to home</Link></p>
    </div>
    );
}
