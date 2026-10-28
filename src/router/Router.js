import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/**
 * A tiny History-API router (no external dependency).
 *   <Router>            provides the current location + navigate()
 *   <Routes><Route/>    renders the first Route whose path matches
 *   <Link to="/x">      client-side navigation that still renders a real <a href>
 */

const RouterContext = createContext(null);

/**
 * Base path the app is served from. It is empty locally and "/little_lemon" on
 * GitHub Pages (taken from PUBLIC_URL at build time). Routes are written without
 * it ("/booking"); it is stripped when reading the URL and added when writing it.
 */
export const getBasename = () => (process.env.PUBLIC_URL || '').replace(/\/$/, '');

/** Prefixes an app path ("/booking") with the base path. */
export const withBasename = (to) => `${getBasename()}${to}`;

const readLocation = () => {
  const base = getBasename();
  let pathname = window.location.pathname;
  if (base && pathname.startsWith(base)) pathname = pathname.slice(base.length);
  return { pathname: pathname || '/', hash: window.location.hash };
};

export function Router({ children }) {
  const [location, setLocation] = useState(readLocation);

  // Keep state in sync with the browser's back/forward buttons.
  useEffect(() => {
    const onPopState = () => setLocation(readLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // After every navigation: jump to the #anchor if there is one, else scroll to top.
  useEffect(() => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target && target.scrollIntoView) {
      target.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const navigate = useCallback((to) => {
    window.history.pushState({}, '', withBasename(to));
    setLocation(readLocation());
  }, []);

  const value = useMemo(() => ({ location, navigate }), [location, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

/** Access the current location and the navigate() function. */
export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside a <Router>.');
  return ctx;
}

/** Declares a route. Rendered by <Routes>; `path="*"` is the fallback. */
export function Route() {
  return null;
}

export function Routes({ children }) {
  const { location } = useRouter();
  const routes = React.Children.toArray(children);
  const match =
    routes.find((r) => r.props.path === location.pathname) ||
    routes.find((r) => r.props.path === '*');
  return match ? match.props.element : null;
}

export function Link({ to, onClick, children, ...rest }) {
  const { navigate } = useRouter();

  const handleClick = (event) => {
    if (onClick) onClick(event);
    // Let the browser handle modified clicks (new tab, etc.).
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={withBasename(to)} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
