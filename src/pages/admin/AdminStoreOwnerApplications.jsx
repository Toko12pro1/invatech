import React from "react";
import { FaCheck, FaStore, FaTimes } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";

export default class AdminStoreOwnerApplications extends React.Component {
  state = {
    applications: [],
    loading: true,
    savingId: "",
    error: "",
    notice: "",
  };

  componentDidMount() {
    this.loadApplications();
  }

  async loadApplications() {
    this.setState({ loading: true, error: "" });
    const { data, error } = await supabase
      .from("store_owner_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      this.setState({ loading: false, error: error.message });
      return;
    }
    this.setState({ loading: false, applications: data || [] });
  }

  async approve(application) {
    this.setState({ savingId: application.id, error: "", notice: "" });
    const { data: existingStore, error: existingError } = await supabase
      .from("stores")
      .select("id")
      .eq("owner_id", application.user_id)
      .maybeSingle();
    if (existingError) {
      this.setState({ savingId: "", error: existingError.message });
      return;
    }

    const storePayload = {
      name: application.business_name,
      category: application.category,
      location: application.location,
      whatsapp: application.whatsapp,
      description: application.description || "",
      owner_id: application.user_id,
      verified: false,
      active: false,
    };
    const storeQuery = existingStore
      ? supabase.from("stores").update(storePayload).eq("id", existingStore.id)
      : supabase.from("stores").insert(storePayload);
    const { error: storeError } = await storeQuery;
    if (storeError) {
      this.setState({ savingId: "", error: storeError.message });
      return;
    }

    const { error: applicationError } = await supabase
      .from("store_owner_applications")
      .update({ status: "approved", reviewed_at: new Date().toISOString(), review_note: null })
      .eq("id", application.id);
    if (applicationError) {
      this.setState({ savingId: "", error: applicationError.message });
      return;
    }
    this.setState({ savingId: "", notice: `${application.business_name} is approved. Review the store and activate it when ready.` });
    this.loadApplications();
  }

  async reject(application) {
    this.setState({ savingId: application.id, error: "", notice: "" });
    const { error } = await supabase
      .from("store_owner_applications")
      .update({ status: "rejected", reviewed_at: new Date().toISOString(), review_note: "Please contact Innovatech to update this application." })
      .eq("id", application.id);
    if (error) {
      this.setState({ savingId: "", error: error.message });
      return;
    }
    this.setState({ savingId: "", notice: `${application.business_name} was marked for follow-up.` });
    this.loadApplications();
  }

  render() {
    const { applications, loading, savingId, error, notice } = this.state;
    return (
      <div>
        <div className="admin-page-header">
          <div><span className="eyebrow">Marketplace onboarding</span><h1>Store-owner applications</h1><p className="admin-page-hint">Review the business details before linking a store owner to a private seller workspace.</p></div>
          <FaStore className="admin-page-header-icon" aria-hidden="true" />
        </div>
        {error && <p className="form-error">{error}</p>}
        {notice && <p className="seller-message seller-message--success">{notice}</p>}
        {loading ? <p>Loading applications...</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Business</th><th>Category</th><th>Contact</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td><strong>{application.business_name}</strong><br /><small>{application.location}</small><br /><small>{application.description}</small></td>
                    <td>{application.category}</td>
                    <td>{application.whatsapp}<br /><small>{application.user_id}</small></td>
                    <td><span className={`admin-status admin-status--${application.status}`}>{application.status}</span></td>
                    <td className="admin-table-actions">
                      {application.status === "pending" && <><button type="button" onClick={() => this.approve(application)} disabled={savingId === application.id} aria-label={`Approve ${application.business_name}`}><FaCheck /></button><button type="button" onClick={() => this.reject(application)} disabled={savingId === application.id} aria-label={`Reject ${application.business_name}`}><FaTimes /></button></>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!applications.length && <div className="empty-state"><FaStore /><h3>No store-owner applications</h3><p>New applications will appear here after a store owner creates an account.</p></div>}
          </div>
        )}
      </div>
    );
  }
}
