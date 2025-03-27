import { Link } from "react-router";

function MyApp() {
  return (
    <div>
      <p>
        <Link to="/book">Books</Link>
      </p>
      <p>
        <Link to="/magazine">Magazine</Link>
      </p>
      <p>
        <Link to="/discMag">DiscMag</Link>
      </p>
      <p>
        <Link to="/ticket">Ticket</Link>
      </p>
    </div>
  );
}

export default MyApp;
