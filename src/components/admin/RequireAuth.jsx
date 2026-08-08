import React from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default class RequireAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checked: false, session: null };
    this.subscription = null;
  }

  componentDidMount() {
    supabase.auth.getSession().then(({ data }) => {
      this.setState({ checked: true, session: data.session });
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      this.setState({ checked: true, session });
    });
    this.subscription = data.subscription;
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  render() {
    const { checked, session } = this.state;
    if (!checked) return null;
    if (!session) return <Navigate to="/admin/login" replace />;
    return this.props.children;
  }
}
