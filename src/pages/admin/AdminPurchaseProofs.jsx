import React from "react";
import { FaCheckCircle, FaExternalLinkAlt, FaMobileAlt, FaReceipt } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";

function formatDate(value) {
  return value ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Unknown date";
}

export default class AdminPurchaseProofs extends React.Component {
  state = { proofs: [], requests: {}, loading: true, savingId: "", error: "", notice: "" };

  componentDidMount() {
    this.loadProofs();
  }

  async loadProofs() {
    this.setState({ loading: true, error: "" });
    const { data: proofs, error } = await supabase.from("purchase_proofs").select("*").order("created_at", { ascending: false }).limit(100);
    if (error) {
      this.setState({ loading: false, error: error.message });
      return;
    }

    const requestIds = [...new Set((proofs || []).map((proof) => proof.consultation_request_id).filter(Boolean))];
    const { data: requests, error: requestError } = requestIds.length
      ? await supabase.from("consultation_requests").select("id, customer_name, phone, product_name, seller_name, city, tracking_reference, referral_code").in("id", requestIds)
      : { data: [], error: null };
    if (requestError) {
      this.setState({ loading: false, error: requestError.message });
      return;
    }

    const signedProofs = await Promise.all((proofs || []).map(async (proof) => {
      const { data } = await supabase.storage.from("purchase-proofs").createSignedUrl(proof.storage_path, 600);
      return { ...proof, signedUrl: data?.signedUrl || "" };
    }));
    this.setState({
      proofs: signedProofs,
      requests: Object.fromEntries((requests || []).map((request) => [request.id, request])),
      loading: false,
    });
  }

  updateLocal = (id, field, value) => {
    this.setState((current) => ({
      proofs: current.proofs.map((proof) => (proof.id === id ? { ...proof, [field]: value } : proof)),
      notice: "",
      error: "",
    }));
  };

  saveProof = async (proof) => {
    this.setState({ savingId: proof.id, error: "", notice: "" });
    const { error } = await supabase.from("purchase_proofs").update({
      status: proof.status,
      reward_status: proof.reward_status,
      reward_amount: proof.reward_amount ? Number(proof.reward_amount) : null,
      reviewer_note: proof.reviewer_note || null,
    }).eq("id", proof.id);
    this.setState(error
      ? { savingId: "", error: error.message }
      : { savingId: "", notice: `Proof ${proof.id.slice(0, 8)} updated.` });
  };

  render() {
    const { proofs, requests, loading, savingId, error, notice } = this.state;
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div><span className="eyebrow">Private evidence</span><h1>Purchase proofs</h1></div>
          <FaReceipt className="admin-page-header-icon" aria-hidden="true" />
        </div>
        <p className="admin-page-hint">Review receipts and Mobile Money screenshots privately. Confirm the store sale before marking a customer reward eligible or paid.</p>
        {error && <p className="form-error">{error}</p>}
        {notice && <p className="seller-message seller-message--success"><FaCheckCircle /> {notice}</p>}
        {loading ? <p>Loading purchase proofs...</p> : proofs.length ? (
          <div className="purchase-proof-grid">
            {proofs.map((proof) => {
              const request = requests[proof.consultation_request_id];
              return (
                <article className="purchase-proof-card" key={proof.id}>
                  <div className="purchase-proof-card-head">
                    <span className="purchase-proof-type">{proof.proof_type === "mobile_money" ? <FaMobileAlt /> : <FaReceipt />} {proof.proof_type === "mobile_money" ? "Mobile Money" : "Store receipt"}</span>
                    <small>{formatDate(proof.created_at)}</small>
                  </div>
                  <h2>{request?.product_name || "Unspecified product"}</h2>
                  <p><strong>Customer:</strong> {request?.customer_name || "Unknown"} · {request?.phone || "No phone"}</p>
                  <p><strong>Store:</strong> {request?.seller_name || "Not specified"} · <strong>Reference:</strong> {request?.tracking_reference || "No reference"}</p>
                  {proof.signedUrl ? <a className="purchase-proof-preview" href={proof.signedUrl} target="_blank" rel="noreferrer"><FaExternalLinkAlt /> Open private proof</a> : <p className="form-error">Private file link unavailable.</p>}
                  <div className="admin-form-grid">
                    <div className="form-row"><label>Status</label><select value={proof.status} onChange={(event) => this.updateLocal(proof.id, "status", event.target.value)}><option value="pending">Pending review</option><option value="confirmed">Sale confirmed</option><option value="rejected">Rejected</option><option value="disputed">Disputed</option></select></div>
                    <div className="form-row"><label>Reward status</label><select value={proof.reward_status} onChange={(event) => this.updateLocal(proof.id, "reward_status", event.target.value)}><option value="pending">Pending</option><option value="eligible">Eligible</option><option value="paid">Paid</option><option value="withheld">Withheld</option></select></div>
                  </div>
                  <div className="form-row"><label>Reward amount (FCFA, 1,000 or more where eligible)</label><input type="number" min="0" step="100" value={proof.reward_amount ?? ""} onChange={(event) => this.updateLocal(proof.id, "reward_amount", event.target.value)} placeholder="e.g. 1000" /></div>
                  <div className="form-row"><label>Reviewer note</label><textarea rows="2" value={proof.reviewer_note || ""} onChange={(event) => this.updateLocal(proof.id, "reviewer_note", event.target.value)} placeholder="Store confirmed by..." /></div>
                  <button className="btn btn--primary" type="button" disabled={savingId === proof.id} onClick={() => this.saveProof(proof)}>{savingId === proof.id ? "Saving..." : "Save review"}</button>
                </article>
              );
            })}
          </div>
        ) : <div className="empty-state"><FaReceipt /><h3>No purchase proofs yet</h3><p>Receipt and Mobile Money uploads will appear here after customers submit them.</p></div>}
      </div>
    );
  }
}
