const PageShell = ({ title, subtitle, children, footer }) => (
  <div className="page-shell">
    <header>
      <h1>{title}</h1>
      {subtitle ? <p className="subtitle">{subtitle}</p> : null}
    </header>
    <section className="card">{children}</section>
    {footer ? <footer>{footer}</footer> : null}
  </div>
);

export default PageShell;

