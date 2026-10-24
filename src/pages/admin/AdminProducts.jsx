import React from "react";
import { FaPlus, FaEdit, FaShareAlt, FaTrash, FaTimes } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import Product from "../../models/Product";
import { PRODUCT_CATEGORIES } from "../../data/catalog";
import { buildProductShareLink, getStoredReferralCode } from "../../utils/referrals";
import { validateImageFile } from "../../utils/fileValidation";

const CATEGORIES = PRODUCT_CATEGORIES;
const CONDITIONS = ["New", "Fairly Used"];
const BADGES = ["", "Best Seller", "On Sale", "Popular"];

const EMPTY_FORM = {
  id: null,
  name_en: "",
  name_fr: "",
  category: CATEGORIES[0],
  price: "",
  old_price: "",
  condition: CONDITIONS[0],
  badge: "",
  image_url: "",
  store_id: "",
  negotiable: false,
  fast_deal: false,
  fast_deal_note: "",
  fast_deal_expires_at: "",
  listing_status: "approved",
  sort_order: 0,
  active: true,
};

export default class AdminProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      stores: [],
      loading: true,
      formVisible: false,
      form: { ...EMPTY_FORM },
      uploading: false,
      saving: false,
      error: "",
      notice: "",
    };
    this.openCreateForm = this.openCreateForm.bind(this);
    this.openEditForm = this.openEditForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleImageFile = this.handleImageFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.copyProductLink = this.copyProductLink.bind(this);
    this.handleModalKeyDown = this.handleModalKeyDown.bind(this);
  }

  componentDidMount() {
    this.loadProducts();
    this.loadStores();
  }

  async loadProducts() {
    this.setState({ loading: true });
    const { data, error } = await supabase.from("products").select("*").order("sort_order");
    if (error) {
      this.setState({ loading: false, error: error.message });
      return;
    }
    this.setState({ products: data.map((row) => new Product(row)), loading: false });
  }

  async loadStores() {
    const { data } = await supabase.from("stores").select("id, name, active").order("name");
    this.setState({ stores: data || [] });
  }

  openCreateForm() {
    this.setState({ formVisible: true, form: { ...EMPTY_FORM }, error: "" });
  }

  openEditForm(product) {
    this.setState({
      formVisible: true,
      error: "",
      form: {
        id: product.id,
        name_en: product.nameEn,
        name_fr: product.nameFr,
        category: product.category,
        price: product.price,
        old_price: product.oldPrice || "",
        condition: product.condition,
        badge: product.badge || "",
        image_url: product.image,
        store_id: product.storeId || "",
        negotiable: product.negotiable,
        fast_deal: product.fastDeal,
        fast_deal_note: product.fastDealNote || "",
        fast_deal_expires_at: product.fastDealExpiresAt ? product.fastDealExpiresAt.slice(0, 10) : "",
        listing_status: product.listingStatus || "approved",
        sort_order: product.sortOrder || 0,
        active: product.active !== false,
      },
    });
  }

  closeForm() {
    this.setState({ formVisible: false });
  }

  handleModalKeyDown(event) {
    if (event.key === "Escape") this.closeForm();
  }

  handleChange(event) {
    const { name, value, type, checked } = event.target;
    this.setState((prev) => ({
      form: { ...prev.form, [name]: type === "checkbox" ? checked : value },
    }));
  }

  async handleImageFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const fileError = validateImageFile(file);
    if (fileError) {
      this.setState({ error: fileError });
      event.target.value = "";
      return;
    }
    this.setState({ uploading: true, error: "" });
    const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file);
    if (uploadError) {
      this.setState({ uploading: false, error: uploadError.message });
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    this.setState((prev) => ({
      uploading: false,
      form: { ...prev.form, image_url: data.publicUrl },
    }));
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ saving: true, error: "" });
    const { form } = this.state;

    if (!form.image_url) {
      this.setState({ saving: false, error: "Please upload an image." });
      return;
    }

    const payload = {
      name_en: form.name_en,
      name_fr: form.name_fr,
      category: form.category,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      condition: form.condition,
      badge: form.badge || null,
      image_url: form.image_url,
      store_id: form.store_id || null,
      negotiable: Boolean(form.negotiable),
      fast_deal: Boolean(form.fast_deal),
      fast_deal_note: form.fast_deal_note || null,
      fast_deal_expires_at: form.fast_deal && form.fast_deal_expires_at ? `${form.fast_deal_expires_at}T23:59:59Z` : null,
      fast_deal_expired_at: form.fast_deal ? null : undefined,
      listing_status: form.listing_status || "approved",
      sort_order: Number(form.sort_order) || 0,
      active: form.active,
    };

    const query = form.id
      ? supabase.from("products").update(payload).eq("id", form.id)
      : supabase.from("products").insert(payload);

    const { error } = await query;
    if (error) {
      this.setState({ saving: false, error: error.message });
      return;
    }

    this.setState({ saving: false, formVisible: false });
    this.loadProducts();
  }

  async handleDelete(product) {
    if (!window.confirm(`Delete "${product.nameEn}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) {
      this.setState({ error: error.message });
      return;
    }
    this.loadProducts();
  }

  async copyProductLink(product) {
    const link = buildProductShareLink(product.id, getStoredReferralCode());
    try {
      await navigator.clipboard.writeText(link);
      this.setState({ notice: "Product link copied. Share it on WhatsApp." });
    } catch {
      this.setState({ notice: `Product link: ${link}` });
    }
  }

  render() {
    const { products, stores, loading, formVisible, form, uploading, saving, error, notice } = this.state;

    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Products</h1>
          <button className="btn btn--primary" onClick={this.openCreateForm}>
            <FaPlus /> Add Product
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}
        {notice && <p className="seller-message seller-message--success">{notice}</p>}

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Condition</th>
                  <th>Badge</th>
                  <th>Fast Deal</th>
                  <th>Active</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td><img src={product.image} alt="" className="admin-table-thumb" /></td>
                    <td>{product.nameEn}</td>
                    <td>{product.category}</td>
                    <td>
                      {product.formatPrice()}
                      {product.isOnSale && <span className="admin-table-old"> {product.formatPrice(product.oldPrice)}</span>}
                    </td>
                    <td>{product.condition}</td>
                    <td>{product.badge || "—"}</td>
                    <td>{product.isFastDealActive ? "Live" : product.fastDealExpired ? "Ended" : "No"}</td>
                    <td>{product.active !== false ? "Yes" : "No"}</td>
                    <td className="admin-table-actions">
                      <button onClick={() => this.copyProductLink(product)} aria-label="Copy share link"><FaShareAlt /></button>
                      <button onClick={() => this.openEditForm(product)} aria-label="Edit"><FaEdit /></button>
                      <button onClick={() => this.handleDelete(product)} aria-label="Delete"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {formVisible && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-product-dialog-title" tabIndex="-1" onKeyDown={this.handleModalKeyDown}>
              <div className="admin-modal-header">
                <h2 id="admin-product-dialog-title">{form.id ? "Edit Product" : "Add Product"}</h2>
                <button onClick={this.closeForm} aria-label="Close"><FaTimes /></button>
              </div>

              <form onSubmit={this.handleSubmit} className="admin-form">
                <div className="form-row">
                  <label>Name (English)</label>
                  <input name="name_en" value={form.name_en} onChange={this.handleChange} required />
                </div>
                <div className="form-row">
                  <label>Name (French)</label>
                  <input name="name_fr" value={form.name_fr} onChange={this.handleChange} required />
                </div>

                <div className="admin-form-grid">
                  <div className="form-row">
                    <label>Category</label>
                    <select name="category" value={form.category} onChange={this.handleChange}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <label>Condition</label>
                    <select name="condition" value={form.condition} onChange={this.handleChange}>
                      {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
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

                <div className="admin-form-grid">
                  <div className="form-row">
                    <label>Partner store</label>
                    <select name="store_id" value={form.store_id} onChange={this.handleChange}>
                      <option value="">Innovatech verified listing</option>
                      {stores.map((store) => <option key={store.id} value={store.id}>{store.name}{store.active ? "" : " (hidden)"}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <label>Listing status</label>
                    <select name="listing_status" value={form.listing_status} onChange={this.handleChange}>
                      <option value="draft">Draft</option>
                      <option value="pending">Pending review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <label className="form-row form-row--checkbox"><span><input type="checkbox" name="negotiable" checked={Boolean(form.negotiable)} onChange={this.handleChange} /> Price is negotiable</span></label>
                <label className="form-row form-row--checkbox"><span><input type="checkbox" name="fast_deal" checked={Boolean(form.fast_deal)} onChange={this.handleChange} /> Mark as Fast Deal</span></label>
                {form.fast_deal && <div className="admin-form-grid"><div className="form-row"><label>Deal ends</label><input name="fast_deal_expires_at" type="date" value={form.fast_deal_expires_at} onChange={this.handleChange} required /></div></div>}

                <div className="admin-form-grid">
                  <div className="form-row">
                    <label>Badge</label>
                    <select name="badge" value={form.badge} onChange={this.handleChange}>
                      {BADGES.map((b) => <option key={b || "none"} value={b}>{b || "None"}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <label>Sort Order</label>
                    <input name="sort_order" type="number" value={form.sort_order} onChange={this.handleChange} />
                  </div>
                </div>

                <div className="form-row">
                  <label>Image</label>
                  <input type="file" accept="image/*" onChange={this.handleImageFile} />
                  {uploading && <span className="voucher-hint">Uploading…</span>}
                  {form.image_url && <img src={form.image_url} alt="" className="admin-form-preview" />}
                </div>

                <div className="form-row form-row--checkbox">
                  <label>
                    <input type="checkbox" name="active" checked={form.active} onChange={this.handleChange} /> Visible on the shop
                  </label>
                </div>

                {error && <p className="form-error">{error}</p>}

                <div className="form-actions">
                  <button type="submit" className="btn btn--primary" disabled={saving || uploading}>
                    {saving ? "Saving…" : "Save Product"}
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
