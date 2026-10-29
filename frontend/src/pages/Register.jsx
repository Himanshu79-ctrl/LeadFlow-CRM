
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.confirmPassword
      );
      navigate("/login", {
        state: { message: "Account created. Please sign in." },
      });
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.message ||
        data?.email?.[0] ||
        data?.confirm_password?.[0] ||
        data?.password?.[0] ||
        "Registration failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <p>Start managing your leads with LeadFlow.</p>

        {error && <div className="error-message">{error}</div>}

        <label htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={updateField}
          placeholder="Your name"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          placeholder="you@example.com"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          minLength={8}
          required
        />

        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={updateField}
          minLength={8}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="auth-footer">
          Already registered? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </main>
  );
}
