import React from "react";
import { FaCheckCircle, FaClipboardCheck, FaShieldAlt } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";

const CHECK_TYPES = [
  { value: "listing_review", label: "Listing and seller review" },
  { value: "physical_check", label: "Physical device check" },
  { value: "availability_check", label: "Availability check" },
  { value: "price_update", label: "Price update" },
  { value: "seller_follow_up", label: "Seller follow-up" },
];

const LEVELS = [
  { value: "store_reviewed", label: "Store reviewed" },
  { value: "innovatech_checked", label: "Physically checked" },
  { value: "innovatech_stock", label: "Innovatech stock" },
];

const EMPTY_FORM = {
  productId: "",
  checkType: "listing_review",
  level: "store_reviewed",
  result: "passed",
  checkedBy: "",
  scope: "Seller connection, Listing details",
  summary: "",
};

function makeReference() {
  return `INN-CHK-${Date.now().toString(36).slice(-8).toUpperCase()}`;
}

function formatDate(value) {
  if (!value) return "Not checked yet";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default class AdminTraceability extends React.Component {
  state = {
    products: [],
    checks: [],
    form: { ...EMPTY_FORM },
    loading: true,
    saving: false,
    error: "",
    notice: "",
  };

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    this.setState({ loading: true, error: "" });
    const [{ data: products, error: productsError }, { data: checks, error: checksError }] = await Promise.all([
      supabase.from("products").select("id, name_en, name_fr, active, listing_status, verification_level, verification_reference, verified_by, last_checked_at, verification_scope").order("name_en"),
      supabase.from("product_verification_checks").select("*").order("checked_at", { ascending: false }).limit(30),
    ]);
    if (productsError || checksError) {
      this.setState({ loading: false, error: productsError?.message || checksError?.message || "Could not load traceability data." });
      return;
    }
    this.setState((current) => ({
      products: products || [],
      checks: checks || [],
      loading: false,
      form: { ...current.form, productId: current.form.productId || products?.[0]?.id || "" },
    }));
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((current) => ({ form: { ...current.form, [name]: value }, error: "", notice: "" }));
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { form } = this.state;
    if (!form.productId || !form.checkedBy.trim() || !form.summary.trim()) {
      this.setState({ error: "Select a product, add the team member and write a short result." });
      return;
    }
    this.setState({ saving: true, error: "", notice: "" });
    const reference = makeReference();
    const scope = form.scope.split(",").map((item) => item.trim()).filter(Boolean);
    const checkedAt = new Date().toISOString();
    const { error: insertError } = await supabase.from("product_verification_checks").insert({
      product_id: form.productId,
      check_type: form.checkType,
      result: form.result,
      summary: form.summary.trim(),
      scope,
      checked_by: form.checkedBy.trim(),
      reference_code: reference,
      checked_at: checkedAt,
    });
    if (insertError) {
      this.setState({ saving: false, error: insertError.message });
      return;
    }

    const { error: productError } = await supabase.from("products").update({
      verification_level: form.level,
      verification_scope: scope,
      verified_by: form.checkedBy.trim(),
      verification_reference: reference,
      last_checked_at: checkedAt,
      verification_status: form.result === "passed" ? "verified" : "pending",
    }).eq("id", form.productId);
    if (productError) {
      this.setState({ saving: false, error: `The check was saved, but the product summary could not update: ${productError.message}` });
      this.loadData();
      return;
    }

    this.setState({ saving: false, notice: `Traceability record ${reference} saved.`, form: { ...EMPTY_FORM, productId: form.productId, checkedBy: form.checkedBy } });
    this.loadData();
  };

  render() {
    const { products, checks, form, loading, saving, error, notice } = this.state;
    const checkedCount = products.filter((product) => product.last_checked_at).length;
    const pendingCount = products.filter((product) => !product.last_checked_at || product.verification_level === "seller_listed").length;

    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <span className="eyebrow">Trust records</span>
            <h1>Traceability</h1>
          </div>
          <FaClipboardCheck className="admin-page-header-icon" aria-hidden="true" />
        </div>
        <p className="admin-page-hint">Record what was checked, by whom and when. The public sees the reference and scope, never private device identifiers.</p>

        <div className="traceability-stats">
          <div><strong>{checkedCount}</strong><span>Products with a latest check</span></div>
          <div><strong>{pendingCount}</strong><span>Need a review or fresh check</span></div>
          <div><strong>{checks.length}</strong><span>Recent traceability records</span></div>
        </div>

        {error && <p className="form-error">{error}</p>}
        {notice && <p className="seller-message seller-message--success"><FaCheckCircle /> {notice}</p>}

        <div className="traceability-grid">
          <form className="admin-form admin-trace-form" onSubmit={this.handleSubmit}>
            <h2>Record a check</h2>
            <p className="admin-page-hint">Use a short, honest summary. Physical testing should only be selected after the device was actually inspected.</p>
            <div className="form-row">
              <label>Product</label>
              <select name="productId" value={form.productId} onChange={this.handleChange} required>
                <option value="">Select a product</option>
                {products.map((product) => <option key={product.id} value={product.id}>{product.name_en}</option>)}
              </select>
            </div>
            <div className="admin-form-grid">
              <div className="form-row"><label>Check type</label><select name="checkType" value={form.checkType} onChange={this.handleChange}>{CHECK_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></div>
              <div className="form-row"><label>Public level</label><select name="level" value={form.level} onChange={this.handleChange}>{LEVELS.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}</select></div>
            </div>
            <div className="admin-form-grid">
              <div className="form-row"><label>Result</label><select name="result" value={form.result} onChange={this.handleChange}><option value="passed">Passed</option><option value="needs_attention">Needs attention</option></select></div>
              <div className="form-row"><label>Checked by</label><input name="checkedBy" value={form.checkedBy} onChange={this.handleChange} placeholder="e.g. Serge, Innovatech" required /></div>
            </div>
            <div className="form-row"><label>Scope <small>(separate items with commas)</small></label><input name="scope" value={form.scope} onChange={this.handleChange} placeholder="Battery, screen, charging" /></div>
            <div className="form-row"><label>Summary</label><textarea name="summary" value={form.summary} onChange={this.handleChange} rows="4" placeholder="What did you observe? What should the buyer know?" required /></div>
            <button className="btn btn--primary" type="submit" disabled={saving || !products.length}><FaShieldAlt /> {saving ? "Saving record..." : "Save traceability record"}</button>
          </form>

          <section className="admin-trace-list">
            <div className="admin-section-heading"><div><span className="eyebrow">Audit trail</span><h2>Recent checks</h2></div></div>
            {loading ? <p>Loading...</p> : checks.length ? checks.map((check) => {
              const product = products.find((item) => item.id === check.product_id);
              return <article className="traceability-record" key={check.id}><div className="traceability-record-icon"><FaClipboardCheck /></div><div><strong>{product?.name_en || "Product"}</strong><span>{check.reference_code} · {formatDate(check.checked_at)}</span><p>{check.summary}</p><small>{check.checked_by} · {check.scope.join(" · ")}</small></div></article>;
            }) : <div className="empty-state"><FaClipboardCheck /><h3>No checks recorded yet</h3><p>Record the first honest review to start the product history.</p></div>}
          </section>
        </div>
      </div>
    );
  }
}
