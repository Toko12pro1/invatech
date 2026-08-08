import React from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import WifiPackage from "../../models/WifiPackage";

const DATA_UNITS = ["MB", "GB"];

const EMPTY_FORM = {
  id: null,
  data_amount: "",
  data_unit: "GB",
  duration_days: "",
  price: "",
  old_price: "",
  is_popular: false,
  sort_order: 0,
  active: true,
};

export default class AdminWifiPackages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      loading: true,
      formVisible: false,
      form: { ...EMPTY_FORM },
      saving: false,
      error: "",
    };
    this.openCreateForm = this.openCreateForm.bind(this);
    this.openEditForm = this.openEditForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.loadPackages();
  }

  async loadPackages() {
    this.setState({ loading: true });
    const { data, error } = await supabase.from("wifi_packages").select("*").order("sort_order");
    if (error) {
      this.setState({ loading: false, error: error.message });
      return;
    }
    this.setState({ packages: data.map((row) => new WifiPackage(row)), loading: false });
  }

  openCreateForm() {
    this.setState({ formVisible: true, form: { ...EMPTY_FORM }, error: "" });
  }

  openEditForm(pkg) {
    this.setState({
      formVisible: true,
      error: "",
      form: {
        id: pkg.id,
        data_amount: pkg.dataAmount,
        data_unit: pkg.dataUnit,
        duration_days: pkg.durationDays,
        price: pkg.price,
        old_price: pkg.oldPrice || "",
        is_popular: Boolean(pkg.isPopular),
        sort_order: pkg.sortOrder || 0,
        active: pkg.active !== false,
      },
    });
  }

  closeForm() {
    this.setState({ formVisible: false });
  }

  handleChange(event) {
    const { name, value, type, checked } = event.target;
    this.setState((prev) => ({
      form: { ...prev.form, [name]: type === "checkbox" ? checked : value },
    }));
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ saving: true, error: "" });
    const { form } = this.state;

    const payload = {
      data_amount: Number(form.data_amount),
      data_unit: form.data_unit,
      duration_days: Number(form.duration_days),
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      is_popular: form.is_popular,
      sort_order: Number(form.sort_order) || 0,
      active: form.active,
    };

    const query = form.id
      ? supabase.from("wifi_packages").update(payload).eq("id", form.id)
      : supabase.from("wifi_packages").insert(payload);

    const { error } = await query;
    if (error) {
      this.setState({ saving: false, error: error.message });
      return;
    }

    this.setState({ saving: false, formVisible: false });
    this.loadPackages();
  }

  async handleDelete(pkg) {
    if (!window.confirm(`Delete the ${pkg.dataAmount}${pkg.dataUnit} plan? This cannot be undone.`)) return;
    const { error } = await supabase.from("wifi_packages").delete().eq("id", pkg.id);
    if (error) {
      this.setState({ error: error.message });
      return;
    }
    this.loadPackages();
  }

  render() {
    const { packages, loading, formVisible, form, saving, error } = this.state;

    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>WiFi Packages</h1>
          <button className="btn btn--primary" onClick={this.openCreateForm}>
            <FaPlus /> Add Package
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Popular</th>
                  <th>Active</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td>{pkg.dataAmount} {pkg.dataUnit}</td>
                    <td>{pkg.durationDays} day{pkg.durationDays > 1 ? "s" : ""}</td>
                    <td>
                      {pkg.formatPrice()}
                      {pkg.isOnSale && <span className="admin-table-old"> {pkg.formatPrice(pkg.oldPrice)}</span>}
                    </td>
                    <td>{pkg.isPopular ? "Yes" : "—"}</td>
                    <td>{pkg.active !== false ? "Yes" : "No"}</td>
                    <td className="admin-table-actions">
                      <button onClick={() => this.openEditForm(pkg)} aria-label="Edit"><FaEdit /></button>
                      <button onClick={() => this.handleDelete(pkg)} aria-label="Delete"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {formVisible && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal">
              <div className="admin-modal-header">
                <h2>{form.id ? "Edit Package" : "Add Package"}</h2>
                <button onClick={this.closeForm} aria-label="Close"><FaTimes /></button>
              </div>

              <form onSubmit={this.handleSubmit} className="admin-form">
                <div className="admin-form-grid">
                  <div className="form-row">
                    <label>Data Amount</label>
                    <input name="data_amount" type="number" min="0" step="any" value={form.data_amount} onChange={this.handleChange} required />
                  </div>
                  <div className="form-row">
                    <label>Unit</label>
                    <select name="data_unit" value={form.data_unit} onChange={this.handleChange}>
                      {DATA_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <label>Duration (days)</label>
                  <input name="duration_days" type="number" min="1" value={form.duration_days} onChange={this.handleChange} required />
                </div>

                <div className="admin-form-grid">
                  <div className="form-row">
                    <label>Price (FCFA)</label>
                    <input name="price" type="number" min="0" value={form.price} onChange={this.handleChange} required />
                  </div>
                  <div className="form-row">
                    <label>Old Price (optional — shows a sale badge)</label>
                    <input name="old_price" type="number" min="0" value={form.old_price} onChange={this.handleChange} />
                  </div>
                </div>

                <div className="form-row form-row--checkbox">
                  <label>
                    <input type="checkbox" name="is_popular" checked={form.is_popular} onChange={this.handleChange} /> Mark as "Most Popular"
                  </label>
                </div>
                <div className="form-row form-row--checkbox">
                  <label>
                    <input type="checkbox" name="active" checked={form.active} onChange={this.handleChange} /> Visible on WiFi Zone page
                  </label>
                </div>

                {error && <p className="form-error">{error}</p>}

                <div className="form-actions">
                  <button type="submit" className="btn btn--primary" disabled={saving}>
                    {saving ? "Saving…" : "Save Package"}
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={this.closeForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}
