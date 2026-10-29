
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  Trophy,
  CalendarClock,
  ClockAlert,
  RefreshCw,
  LogOut,
  LayoutDashboard,
  BriefcaseBusiness,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const metricCards = [
  {
    key: "total_leads",
    label: "Total Leads",
    icon: Users,
    color: "blue",
  },
  {
    key: "active_leads",
    label: "Active Leads",
    icon: UserCheck,
    color: "purple",
  },
  {
    key: "won_leads",
    label: "Won Leads",
    icon: Trophy,
    color: "green",
  },
  {
    key: "pending_followups",
    label: "Pending Follow-ups",
    icon: CalendarClock,
    color: "orange",
  },
  {
    key: "overdue_followups",
    label: "Overdue Follow-ups",
    icon: ClockAlert,
    color: "red",
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchSummary() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/dashboard/summary/");
      setSummary(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="crm-layout">
      <aside className="crm-sidebar">
        <div className="brand">
          <div className="brand-icon">
            <BriefcaseBusiness size={23} />
          </div>
          <span>LeadFlow</span>
        </div>

        <p className="sidebar-label">WORKSPACE</p>

        <Link to="/dashboard" className="sidebar-link active">
          <LayoutDashboard size={19} />
          Dashboard
        </Link>

        <Link to="/leads" className="sidebar-link">
          <Users size={19} />
          Leads
        </Link>

        <Link to="/follow-ups" className="sidebar-link">
          <CalendarClock size={19} />
          Follow-ups
        </Link>

        <div className="sidebar-bottom">
          <div className="user-info">
            <div className="user-avatar">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <strong>{user?.name || "User"}</strong>
              <span>{user?.email || ""}</span>
            </div>
          </div>

          <button className="logout-button" onClick={logout}>
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      <main className="crm-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Dashboard</h1>
            <p className="subtitle">
              Track your leads and stay on top of follow-ups.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={fetchSummary}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        <section className="welcome-banner">
          <div>
            <p>YOUR WORKSPACE</p>
            <h2>
              Welcome back, {user?.name || "there"}!
            </h2>
            <span>Here is your business activity at a glance.</span>
          </div>
          <div className="welcome-icon">
            <BriefcaseBusiness size={38} />
          </div>
        </section>

        <div className="section-heading">
          <div>
            <h2>Performance Overview</h2>
            <p>Your latest CRM statistics</p>
          </div>
        </div>

        {error && (
          <div className="dashboard-error">
            <span>{error}</span>
            <button onClick={fetchSummary}>Retry</button>
          </div>
        )}

        <section className="metrics-grid">
          {metricCards.map((card) => {
            const Icon = card.icon;

            return (
              <article className="metric-card" key={card.key}>
                <div className="metric-top">
                  <span>{card.label}</span>
                  <div className={`metric-icon ${card.color}`}>
                    <Icon size={21} />
                  </div>
                </div>

                <div className="metric-value">
                  {loading ? "—" : summary?.[card.key] ?? 0}
                </div>

                <p className="metric-caption">
                  {loading ? "Loading statistics..." : "Updated from your CRM"}
                </p>
              </article>
            );
          })}
        </section>

        <section className="dashboard-bottom">
          <div>
            <div className="bottom-icon">
              <Users size={22} />
            </div>
            <h3>Manage your leads</h3>
            <p>
              Keep track of prospects, update sales stages, and organize
              your customer pipeline.
            </p>
          </div>

          <div>
            <div className="bottom-icon orange">
              <CalendarClock size={22} />
            </div>
            <h3>Stay on schedule</h3>
            <p>
              Create follow-up reminders and mark completed activities
              to keep your workflow organized.
            </p>
          </div>
        </section>

        <footer className="dashboard-footer">
          LeadFlow CRM · Manage relationships. Close deals.
        </footer>
      </main>
    </div>
  );
}
