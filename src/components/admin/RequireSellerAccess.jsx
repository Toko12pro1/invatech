import React from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default class RequireSellerAccess extends React.Component {
  state = { checked: false, session: null, allowed: false };

  async componentDidMount() {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
      this.setState({ checked: true, session: null });
      return;
    }

    const { data: refreshed } = await supabase.auth.refreshSession();
    const activeSession = refreshed.session || session;
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (isAdmin === true) {
      this.setState({ checked: true, session: activeSession, allowed: true });
      return;
    }

    const { data: application } = await supabase
      .from("store_owner_applications")
      .select("status")
      .eq("user_id", activeSession.user.id)
      .maybeSingle();
    this.setState({ checked: true, session: activeSession, allowed: application?.status === "approved" });
  }

  render() {
    const { checked, session, allowed } = this.state;
    if (!checked) return null;
    if (!session) return <Navigate to="/admin/login" replace />;
    if (!allowed) return <Navigate to="/account" replace />;
    return this.props.children;
  }
}
