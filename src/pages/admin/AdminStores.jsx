import React from "react";
import { FaEdit, FaPlus, FaStore, FaTimes, FaTrash } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";

const EMPTY_FORM = {
  id: null,
  name: "",
  category: "Electronics",
  location: "",
  whatsapp: "",
  description: "",
  image_url: "",
  response_time: "Usually replies in 30 min",
  verified: false,
  active: false,
};

export default class AdminStores extends React.Component {
  state = { stores: [], loading: true, formVisible: false, form: { ...EMPTY_FORM }, saving: false, error: "", notice: "" };

  componentDidMount() {
    this.loadStores();
  }

  async loadStores() {
    this.setState({ loading: true, error: "" });
    const { data, error } = await supabase.from("stores").select("*").order("name");
    if (error) {
      this.setState({ loading: false, error: error.message });
      return;
    }
    this.setState({ loading: false, stores: data || [] });
  }

  openCreate = () => this.setState({ formVisible: true, form: { ...EMPTY_FORM }, error: "", notice: "" });

  openEdit = (store) => this.setState({ formVisible: true, form: { ...store }, error: "", notice: "" });

  closeForm = () => this.setState({ formVisible: false, error: "" });

  handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    this.setState((current) => ({ form: { ...current.form, [name]: type === "checkbox" ? checked : value } }));
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { form } = this.state;
    if (!form.name.trim() || !form.location.trim() || !form.whatsapp.trim()) {
      this.setState({ error: "Store name, location and WhatsApp are required." });
      return;
    }
    this.setState({ saving: true, error: "", notice: "" });
    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || "Electronics",
      location: form.location.trim(),
      whatsapp: form.whatsapp.trim(),
      description: form.description.trim(),
      image_url: String(form.image_url || "").trim() || null,
      response_time: form.response_time.trim() || null,
      verified: Boolean(form.verified),
      active: Boolean(form.active),
    };
    const query = form.id
      ? supabase.from("stores").update(payload).eq("id", form.id)
      : supabase.from("stores").insert(payload);
    const { error } = await query;
    if (error) {
      this.setState({ saving: false, error: error.message });
      return;
    }
    this.setState({ saving: false, formVisible: false, notice: form.id ? "Store updated." : "Store added." });
    this.loadStores();
  };

  handleDelete = async (store) => {
    if (!window.confirm(`Remove ${store.name} from the partner directory?`)) return;
    const { error } = await supabase.from("stores").delete().eq("id", store.id);
    if (error) {
      this.setState({ error: error.message });
      return;
    }
    this.setState({ notice: "Store removed." });
    this.loadStores();
  };

  render() {
    const { stores, loading, formVisible, form, saving, error, notice } = this.state;
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div><span className="eyebrow">Partner network</span><h1>Stores</h1><p className="admin-page-hint">Approve the stores customers can see, keep contact details current and connect seller listings to the right partner.</p></div>
          <button className="btn btn--primary" type="button" onClick={this.openCreate}><FaPlus /> Add store</button>
        </div>
        {error && <p className="form-error">{error}</p>}
        {notice && <p className="seller-message seller-message--success">{notice}</p>}
        {loading ? <p>Loading stores...</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Store</th><th>Category</th><th>Location</th><th>WhatsApp</th><th>Trust</th><th>Visible</th><th></th></tr></thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td><div className="admin-store-cell">{store.image_url ? <img src={store.image_url} alt="" className="admin-table-thumb" /> : <span className="admin-store-placeholder"><FaStore /></span>}<strong>{store.name}</strong></div></td>
                    <td>{store.category}</td><td>{store.location}</td><td>{store.whatsapp}</td>
                    <td><span className={`admin-status ${store.verified ? "admin-status--used" : "admin-status--pending"}`}>{store.verified ? "Verified" : "Review"}</span></td>
                    <td>{store.active ? "Yes" : "No"}</td>
                    <td className="admin-table-actions"><button type="button" onClick={() => this.openEdit(store)} aria-label={`Edit ${store.name}`}><FaEdit /></button><button type="button" onClick={() => this.handleDelete(store)} aria-label={`Delete ${store.name}`}><FaTrash /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!stores.length && <div className="empty-state"><FaStore /><h3>No partner stores yet</h3><p>Add a store before approving seller listings.</p></div>}
          </div>
        )}

        {formVisible && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal">
              <div className="admin-modal-header"><h2>{form.id ? "Edit store" : "Add store"}</h2><button type="button" onClick={this.closeForm} aria-label="Close"><FaTimes /></button></div>
              <form className="admin-form" onSubmit={this.handleSubmit}>
                <div className="form-row"><label>Store name</label><input name="name" value={form.name} onChange={this.handleChange} required /></div>
                <div className="admin-form-grid"><div className="form-row"><label>Category focus</label><input name="category" value={form.category} onChange={this.handleChange} placeholder="Phones, laptops & accessories" /></div><div className="form-row"><label>Location</label><input name="location" value={form.location} onChange={this.handleChange} placeholder="Biyem-Assi, Yaounde" required /></div></div>
                <div className="admin-form-grid"><div className="form-row"><label>WhatsApp</label><input name="whatsapp" value={form.whatsapp} onChange={this.handleChange} placeholder="2376..." required /></div><div className="form-row"><label>Response time</label><input name="response_time" value={form.response_time || ""} onChange={this.handleChange} placeholder="Usually replies in 30 min" /></div></div>
                <div className="form-row"><label>Description</label><textarea name="description" value={form.description} onChange={this.handleChange} rows="3" /></div>
                <div className="form-row"><label>Logo or store photo URL</label><input name="image_url" value={form.image_url || ""} onChange={this.handleChange} placeholder="/images/store.jpg or https://..." /></div>
                <div className="admin-form-grid"><label className="form-row form-row--checkbox"><span><input type="checkbox" name="verified" checked={Boolean(form.verified)} onChange={this.handleChange} /> Verified partner</span></label><label className="form-row form-row--checkbox"><span><input type="checkbox" name="active" checked={Boolean(form.active)} onChange={this.handleChange} /> Visible on the site</span></label></div>
                <div className="form-actions"><button className="btn btn--primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save store"}</button><button className="btn btn--ghost" type="button" onClick={this.closeForm}>Cancel</button></div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}
