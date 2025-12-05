import Hero from "../components/Hero";
import Card from "react-bootstrap/Card";
function Dashboard() {
  return (
    <>
      <div className="main-content">
        <Hero />
      </div>
      <div className="container-left">
        <Card>
          <h2>Clean energy</h2>
          <br />
          <Card.Text>
            Clean energy is not new; the use of renewable energy, such as solar,
            wind, and hydropower, has been around for a long time, but it hasn't
            changed much for many years. However, climate change has accelerated
            the need to adopt cleaner, renewable energy to reduce dependence on
            fossil fuels. Although many countries have invested in renewable
            energy, the high cost of research and development to build the
            technology and infrastructure has been a barrier. Therefore, the
            innovation in cleaner energy hasn't grown as rapidly as expected.
            Yet many companies have adopted a cleaner, more efficient way of
            operating. For example, Blue World Technologies has been developing
            methanol fuel cells to power heavy-duty vehicles.
            <span>
              <a
                href="https://nucor.com/madeforgood/electra-case-study"
                target="blanc">
                {" "}
                Nucor{" "}
              </a>{" "}
              is another company that has been changing the way it produces
              steel by using electric arc furnace (EAF) technology, creating a
              zero-carbon, low-emission process. These are just a few companies
              that have innovated in renewable energy by adopting new
              manufacturing processes.
              <span>
                <a href="https://www.breakthroughenergy.org/" target="blanc">
                  {" "}
                  Read more...
                </a>
              </span>
            </span>
          </Card.Text>
          <Card.Link href=""></Card.Link>
        </Card>
        <br />
        <Card>
          <h2>Tech Stack</h2>
          <br />
          <Card.Text>
            This project showcases a full-stack web application designed for
            secure access to content, including clean energy data articles and
            visualizations. The application uses a MySQL database as its
            persistent store for all article content. The backend is built on
            Node.js with Express, using the mysql2 library with a Connection
            Pool for efficient, secure, and asynchronous querying of the article
            database. Security is enforced via JSON Web Tokens (JWT), managed by
            the express-jwt middleware, which protects sensitive endpoints such
            as /api/dashboard, /api/reports, /api/summary, and /api/articles.
            The frontend is a React application that manages the authentication
            flow using react-router-dom for secure routing via a ProtectedRoute
            wrapper. All API calls for protected data are handled by a custom
            Axios Interceptor (apiClient) that automatically attaches the JWT
            token, while a response interceptor handles session expiration by
            redirecting users upon receiving a 401 Unauthorized status code.
            Data visualization relies on Chart.js, and the user interface uses
            React Bootstrap for styling.
          </Card.Text>
          <Card.Link href=""></Card.Link>
        </Card>
        <div className="spacer-bottom"></div>
      </div>
    </>
  );
}

export default Dashboard;
