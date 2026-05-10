import { NavLink, Route, Routes } from 'react-router-dom';
import About from './pages/About';
import ARExperience from './pages/ARExperience';
import Home from './pages/Home';
import ObjectPage from './pages/ObjectPage';
import Projection from './pages/Projection';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/ar/sample-mug', label: 'AR' },
  { to: '/object/sample-mug', label: 'Object' },
  { to: '/projection', label: 'Projection' },
  { to: '/about', label: 'About' },
] satisfies Array<{ to: string; label: string; end?: boolean }>;

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <div className="site-title">
          <span className="eyebrow">WebAR museum prototype</span>
          <strong>The Glitching Archive</strong>
        </div>
        <nav className="site-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main id="main-content" className="page-frame">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ar/:id" element={<ARExperience />} />
          <Route path="/object/:id" element={<ObjectPage />} />
          <Route path="/projection" element={<Projection />} />
          <Route path="/about" element={<About />} />
          <Route
            path="*"
            element={
              <section className="page-section">
                <p className="eyebrow">Route not found</p>
                <h1>This archive path is not available.</h1>
                <p>
                  Return to the home route or use one of the primary navigation links to
                  continue the prototype walkthrough.
                </p>
              </section>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
