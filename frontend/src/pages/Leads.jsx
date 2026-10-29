
import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Users,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import api from "../api/client";

const stages = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

const emptyForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service_interest: "",
  source: "",
  budget: "",
  stage: "New",
};

function getErrorMessage(error) {
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

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (stageFilter) params.stage = stageFilter;

      const response = await api.get("/leads/", { params });
      setLeads(Array.isArray(response.data) ? response.data : response.data.results || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, stageFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchLeads]);

  function openCreateModal() {
    setEditingLead(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function openEditModal(lead) {
    setEditingLead(lead);
    setForm({
      name: lead.name || "",
      company: lead.company || "",
      email: lead.email || "",
      phone: lead.phone || "",
      service_interest: lead.service_interest || "",
      source: lead.source || "",
      budget: lead.budget ?? "",
      stage: lead.stage || "New",
    });
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.email.trim() && !form.phone.trim()) {
      setError("Please provide an email address or phone number.");
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      service_interest: form.service_interest.trim(),
      source: form.source.trim(),
      budget: form.budget === "" ? null : form.budget,
    };

    setSaving(true);

    try {
      if (editingLead) {
        await api.patch(`/leads/${editingLead.id}`, payload);
        setNotice("Lead updated successfully.");
      } else {
        await api.post("/leads/", payload);
        setNotice("Lead created successfully.");
      }

      setModalOpen(false);
      setEditingLead(null);
      setForm(emptyForm);
      await fetchLeads();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function deleteLead(lead) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${lead.name}"? Its follow-up activities will also be deleted.`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await api.delete(`/leads/${lead.id}`);
      setNotice("Lead deleted successfully.");
      await fetchLeads();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function changeStage(lead, stage) {
    setError("");
    setNotice("");

    try {
      await api.patch(`/leads/${lead.id}`, { stage });
      setNotice(`${lead.name}'s stage updated.`);
      await fetchLeads();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="leads-page">
      <header className="leads-header">
        <div>
          <p className="eyebrow">SALES WORKSPACE</p>
          <h1>Leads</h1>
          <p className="subtitle">
            Manage prospects, track progress, and keep your pipeline moving.
          </p>
        </div>

        <button className="primary-button" onClick={openCreateModal}>
          <Plus size={18} />
          Add Lead
        </button>
      </header>

      {notice && (
        <div className="success-message">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="leads-error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError("")} aria-label="Dismiss error">
            <X size={16} />
          </button>
        </div>
      )}

      <section className="leads-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by lead name or company..."
            aria-label="Search leads"
          />
        </div>

        <select
          value={stageFilter}
          onChange={(event) => setStageFilter(event.target.value)}
          aria-label="Filter by stage"
        >
          <option value="">All stages</option>
          {stages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>

        <button
          className="icon-button"
          onClick={fetchLeads}
          disabled={loading}
          aria-label="Refresh leads"
          title="Refresh leads"
        >
          <RefreshCw size={18} />
        </button>
      </section>

      <section className="leads-table-card">
        <div className="table-heading">
          <div>
            <h2>All Leads</h2>
            <p>{loading ? "Loading leads..." : `${leads.length} leads found`}</p>
          </div>
        </div>

        <div className="table-scroll">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Contact</th>
                <th>Service</th>
                <th>Budget</th>
                <th>Stage</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="table-empty">
                    Loading your leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty">
                    <Users size={30} />
                    <strong>No leads found</strong>
                    <span>Try changing your filters or add a new lead.</span>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="lead-identity">
                        <div className="lead-avatar">
                          {(lead.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{lead.name}</strong>
                          <span>{lead.company || "Individual"}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="contact-cell">
                        <span>{lead.email || "No email"}</span>
                        <span>{lead.phone || "No phone"}</span>
                      </div>
                    </td>

                    <td>{lead.service_interest || "—"}</td>

                    <td>
                      {lead.budget != null && lead.budget !== ""
                        ? `₹${Number(lead.budget).toLocaleString("en-IN")}`
                        : "—"}
                    </td>

                    <td>
                      <select
                        className={`stage-select stage-${lead.stage.toLowerCase().replaceAll(" ", "-")}`}
                        value={lead.stage}
                        onChange={(event) => changeStage(lead, event.target.value)}
                        aria-label={`Change stage for ${lead.name}`}
                      >
                        {stages.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <div className="lead-actions">
                        <button
                          className="action-button edit"
                          onClick={() => openEditModal(lead)}
                          title="Edit lead"
                          aria-label={`Edit ${lead.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="action-button delete"
                          onClick={() => deleteLead(lead)}
                          title="Delete lead"
                          aria-label={`Delete ${lead.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <section
            className="lead-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="modal-header">
              <div>
                <h2 id="lead-modal-title">
                  {editingLead ? "Edit Lead" : "Add New Lead"}
                </h2>
                <p>Enter the prospect's details below.</p>
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
              <div className="lead-form-grid">
                <label>
                  Lead Name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    maxLength={150}
                    required
                    placeholder="e.g. Rahul Sharma"
                  />
                </label>

                <label>
                  Company
                  <input
                    name="company"
                    value={form.company}
                    onChange={updateField}
                    maxLength={200}
                    placeholder="e.g. Acme Technologies"
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="rahul@example.com"
                  />
                </label>

                <label>
                  Phone
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={updateField}
                    maxLength={20}
                    placeholder="+91 9876543210"
                  />
                </label>

                <label>
                  Service Interest
                  <input
                    name="service_interest"
                    value={form.service_interest}
                    onChange={updateField}
                    maxLength={150}
                    placeholder="e.g. Website Development"
                  />
                </label>

                <label>
                  Lead Source
                  <input
                    name="source"
                    value={form.source}
                    onChange={updateField}
                    maxLength={100}
                    placeholder="e.g. LinkedIn, Referral"
                  />
                </label>

                <label>
                  Budget (₹)
                  <input
                    type="number"
                    name="budget"
                    value={form.budget}
                    onChange={updateField}
                    min="0"
                    step="0.01"
                    placeholder="e.g. 25000"
                  />
                </label>

                <label>
                  Sales Stage
                  <select
                    name="stage"
                    value={form.stage}
                    onChange={updateField}
                  >
                    {stages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <p className="form-hint">
                Provide at least one contact method: email or phone.
              </p>

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
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingLead
                      ? "Save Changes"
                      : "Create Lead"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
