import React from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default class RequireAdmin extends React.Component {
  state = { checked: false, session: null, isAdmin: false };

  async componentDidMount() {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
      this.setState({ checked: true, session: null });
      return;
    }

    const { data: refreshed } = await supabase.auth.refreshSession();
    const activeSession = refreshed.session || session;
    const { data: isAdmin, error } = await supabase.rpc("is_admin");
    this.setState({ checked: true, session: activeSession, isAdmin: !error && isAdmin === true });
  }

  render() {
    const { checked, session, isAdmin } = this.state;
    if (!checked) return null;
    if (!session) return <Navigate to="/admin/login" replace />;
    if (!isAdmin) return <Navigate to="/account" replace />;
    return this.props.children;
  }
}
