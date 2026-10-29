
import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  CalendarClock,
  CheckCircle2,
  Clock,
  RefreshCw,
  X,
} from "lucide-react";
import api from "../api/client";

const emptyForm = {
  lead: "",
  title: "",
  activity_type: "Task",
  due_at: "",
};

const activityTypes = ["Call", "Email", "Meeting", "Task"];

function errorMessage(error) {
  const data = error.response?.data;
  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  if (data && typeof data === "object") {
    for (const value of Object.values(data)) {
      if (Array.isArray(value) && value.length) return String(value[0]);
      if (typeof value === "string") return value;
    }
  }

  return "Something went wrong. Please try again.";
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function FollowUps() {
  const [activities, setActivities] = useState([]);
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;

      const [activityResponse, leadResponse] = await Promise.all([
        api.get("/activities/", { params }),
        api.get("/leads/"),
      ]);

      const activityData = activityResponse.data;
      const leadData = leadResponse.data;

      setActivities(
        Array.isArray(activityData)
          ? activityData
          : activityData.results || []
      );

      setLeads(
        Array.isArray(leadData) ? leadData : leadData.results || []
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function updateField(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  function openModal() {
    setForm(emptyForm);
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.lead) {
      setError("Please select a lead.");
      return;
    }

    if (!form.due_at || new Date(form.due_at) <= new Date()) {
      setError("Please choose a future date and time.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/activities/", {
        lead: Number(form.lead),
        title: form.title.trim(),
        activity_type: form.activity_type,
        due_at: new Date(form.due_at).toISOString(),
      });

      setModalOpen(false);
      setForm(emptyForm);
      setNotice("Follow-up created successfully.");
      await fetchData();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function completeActivity(activity) {
    setError("");
    setNotice("");

    try {
      await api.patch(`/activities/${activity.id}/complete`, {});
      setNotice("Follow-up marked as completed.");
      await fetchData();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  const overdueCount = activities.filter(
    (activity) =>
      activity.status === "Pending" &&
      new Date(activity.due_at) < new Date()
  ).length;

  return (
    <div className="followups-page">
      <header className="followups-header">
        <div>
          <p className="eyebrow">ACTIVITY CENTER</p>
          <h1>Follow-ups</h1>
          <p className="subtitle">
            Plan your next move and never miss a client follow-up.
          </p>
        </div>

        <button className="primary-button" onClick={openModal}>
          <Plus size={18} />
          Schedule Follow-up
        </button>
      </header>

      {notice && (
        <div className="success-message">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="leads-error">
          <span>{error}</span>
          <button onClick={() => setError("")} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}

      <section className="followup-summary">
        <div className="followup-summary-icon">
          <CalendarClock size={23} />
        </div>
        <div>
          <span>
            {statusFilter === "Completed"
              ? "Completed activities"
              : statusFilter === "Pending"
                ? "Pending activities"
                : "All activities"}
          </span>
          <strong>{loading ? "—" : activities.length}</strong>
        </div>
        <div className="followup-overdue">
          <Clock size={19} />
          <span>
            {statusFilter === "Pending" && !loading
              ? `${overdueCount} overdue`
              : "Stay on track"}
          </span>
        </div>
      </section>

      <section className="followups-list-card">
        <div className="followups-toolbar">
          <div>
            <h2>Your activities</h2>
            <p>Follow-up tasks linked to your leads</p>
          </div>

          <div className="followups-toolbar-actions">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter follow-ups"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="">All activities</option>
            </select>

            <button
              className="icon-button"
              onClick={fetchData}
              disabled={loading}
              aria-label="Refresh activities"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="followups-empty">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="followups-empty">
            <CalendarClock size={35} />
            <strong>No follow-ups found</strong>
            <span>Schedule a follow-up to keep track of your next action.</span>
          </div>
        ) : (
          <div className="activity-list">
            {activities.map((activity) => {
              const isOverdue =
                activity.status === "Pending" &&
                new Date(activity.due_at) < new Date();

              return (
                <article className="activity-item" key={activity.id}>
                  <div
                    className={`activity-type-icon ${activity.activity_type.toLowerCase()}`}
                  >
                    {activity.status === "Completed" ? (
                      <CheckCircle2 size={21} />
                    ) : (
                      <CalendarClock size={21} />
                    )}
                  </div>

                  <div className="activity-info">
                    <strong>{activity.title}</strong>
                    <span>
                      Lead:{" "}
                      {leads.find((lead) => lead.id === activity.lead)?.name ||
                        `Lead #${activity.lead}`}
                    </span>
                    <span className="activity-date">
                      Due: {formatDate(activity.due_at)}
                    </span>
                  </div>

                  <div className="activity-right">
                    <span
                      className={`activity-badge ${
                        activity.status === "Completed"
                          ? "completed"
                          : isOverdue
                            ? "overdue"
                            : "pending"
                      }`}
                    >
                      {activity.status === "Completed"
                        ? "Completed"
                        : isOverdue
                          ? "Overdue"
                          : "Pending"}
                    </span>

                    <span className="activity-kind">
                      {activity.activity_type}
                    </span>

                    {activity.status === "Pending" && (
                      <button
                        className="complete-button"
                        onClick={() => completeActivity(activity)}
                      >
                        <CheckCircle2 size={15} />
                        Complete
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setModalOpen(false)}
        >
          <section
            className="lead-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="followup-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="modal-header">
              <div>
                <h2 id="followup-modal-title">Schedule Follow-up</h2>
                <p>Create a task for one of your leads.</p>
              </div>
              <button
                className="icon-button"
                onClick={() => setModalOpen(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              <div className="followup-form">
                <label>
                  Select Lead *
                  <select
                    name="lead"
                    value={form.lead}
                    onChange={updateField}
                    required
                  >
                    <option value="">Choose a lead</option>
                    {leads.map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {lead.name}
                        {lead.company ? ` — ${lead.company}` : ""}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Activity Title *
                  <input
                    name="title"
                    value={form.title}
                    onChange={updateField}
                    maxLength={200}
                    required
                    placeholder="e.g. Discuss project requirements"
                  />
                </label>

                <label>
                  Activity Type *
                  <select
                    name="activity_type"
                    value={form.activity_type}
                    onChange={updateField}
                  >
                    {activityTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Due Date & Time *
                  <input
                    type="datetime-local"
                    name="due_at"
                    value={form.due_at}
                    onChange={updateField}
                    min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                      .toISOString()
                      .slice(0, 16)}
                    required
                  />
                </label>
              </div>

              {leads.length === 0 && (
                <p className="form-hint">
                  Create a lead first before scheduling a follow-up.
                </p>
              )}

              <footer className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving || leads.length === 0}
                >
                  {saving ? "Scheduling..." : "Schedule Follow-up"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
