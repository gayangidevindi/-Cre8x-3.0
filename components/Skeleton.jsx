export default function Skeleton({ lines = 3 }) {
  return <div className="skeleton-stack" aria-label="Loading route details" role="status">
    <span className="skeleton-bar skeleton-status" />
    {Array.from({ length: lines }).map((_, index) => <span key={index} className="skeleton-bar" />)}
    <span className="skeleton-bar skeleton-short" />
  </div>;
}
