// src/components/admin/dashboard/CardAdmin.jsx

export default function CardAdmin({ title, value, change, positive, children }) {
  return (
    <div className="card-admin">
      <p className="card-title">{title}</p>
      <p className="card-value">{value}</p>

      {change && (
        <p className={positive ? "card-positive" : "card-negative"}>
          {change}
        </p>
      )}

      <div className="h-16">{children}</div>
    </div>
  );
}
