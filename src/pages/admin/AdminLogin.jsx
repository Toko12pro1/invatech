import React from "react";
import { supabase } from "../../lib/supabaseClient";
import withNavigate from "../../utils/withNavigate";

class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", error: "", loading: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      await supabase.auth.refreshSession();
      const { data: isAdmin } = await supabase.rpc("is_admin");
      this.props.navigate(isAdmin === true ? "/admin" : "/account", { replace: true });
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true, error: "" });
    const { email, password } = this.state;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      this.setState({ loading: false, error: "Incorrect email or password." });
      return;
    }
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (isAdmin !== true) {
      await supabase.auth.signOut();
      this.setState({ loading: false, error: "This account does not have Innovatech admin access." });
      return;
    }
    this.props.navigate("/admin", { replace: true });
  }

  render() {
    const { email, password, error, loading } = this.state;

    return (
      <div className="admin-login">
        <form className="admin-login-card" onSubmit={this.handleSubmit}>
          <img src="/images/logo-icon.svg" alt="" width={48} height={48} />
          <h1>Innovatech Admin</h1>
          <p>Sign in to post products, update prices and manage the Innovatech marketplace.</p>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required value={email} onChange={this.handleChange} />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required value={password} onChange={this.handleChange} />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn--primary admin-login-submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    );
  }
}

export default withNavigate(AdminLogin);
