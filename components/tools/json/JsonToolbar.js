// A row of controls. Pass buttons/selects as children; they wrap on small screens.
export default function JsonToolbar({ label, children }) {
  return (
    <div className="json-toolbar" role="toolbar" aria-label={label}>
      {children}
    </div>
  );
}
