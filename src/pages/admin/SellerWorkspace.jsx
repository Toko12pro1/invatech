import React from "react";
import { Link } from "react-router-dom";
import {
  FaCamera,
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaSave,
  FaShareAlt,
  FaShieldAlt,
  FaStore,
  FaTools,
  FaWhatsapp,
} from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import {
  getDemoProducts,
  PARTNER_STORES,
  toMarketplaceProduct,
  whatsappLink,
} from "../../data/marketplace";
import { PRODUCT_CATEGORIES } from "../../data/catalog";
import { buildProductShareLink, getStoredReferralCode } from "../../utils/referrals";
import { validateImageFile } from "../../utils/fileValidation";

const CATEGORIES = PRODUCT_CATEGORIES;
const CONDITIONS = ["New", "Fairly Used"];
const SELLER_DRAFT_KEY = "innovatech-seller-drafts";

const EMPTY_FORM = {
  id: null,
  name_en: "",
  name_fr: "",
  category: CATEGORIES[0],
  price: "",
  old_price: "",
  condition: CONDITIONS[0],
  image_url: "",
  store_id: "",
  negotiable: true,
  fast_deal: false,
  fast_deal_note: "",
  fast_deal_expires_at: "",
  listing_status: "pending",
};

function productToRow(product) {
  return { id: product.id, ...product.toRow() };
}

export default class SellerWorkspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      stores: PARTNER_STORES,
      loading: true,
      usingDemo: false,
      isAdmin: false,
      ownerMode: false,
      ownerApplication: null,
      selectedIds: [],
      draftPrices: {},
      bulkMode: "percent-down",
      bulkValue: "",
      formVisible: false,
      form: { ...EMPTY_FORM },
      uploading: false,
      saving: false,
      error: "",
      notice: "",
    };
    this.loadData = this.loadData.bind(this);
    this.openCreate = this.openCreate.bind(this);
    this.openEdit = this.openEdit.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleImageFile = this.handleImageFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
    this.handleDraftPriceChange = this.handleDraftPriceChange.bind(this);
    this.applyBulkChange = this.applyBulkChange.bind(this);
    this.savePriceChanges = this.savePriceChanges.bind(this);
    this.copyProductLink = this.copyProductLink.bind(this);
    this.handleModalKeyDown = this.handleModalKeyDown.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  getLocalRows() {
    try {
      const saved = window.localStorage.getItem(SELLER_DRAFT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveLocalProducts(products) {
    window.localStorage.setItem(SELLER_DRAFT_KEY, JSON.stringify(products.map(productToRow)));
  }

  async loadData() {
    this.setState({ loading: true, error: "" });
    await supabase.rpc("deactivate_expired_fast_deals");
    const { data: userResult } = await supabase.auth.getUser();
    const user = userResult?.user;
    const { data: adminResult } = user
      ? await supabase.rpc("is_admin")
      : { data: false };
    const isAdmin = adminResult === true;
    const { data: ownerApplication } = user
      ? await supabase.from("store_owner_applications").select("*").eq("user_id", user.id).maybeSingle()
      : { data: null };
    const ownerMode = !isAdmin && ownerApplication?.status === "approved";

    if (!isAdmin && ownerApplication && !ownerMode) {
      this.setState({
        products: [],
        stores: [],
        loading: false,
        usingDemo: false,
        isAdmin,
        ownerMode: true,
        ownerApplication,
        selectedIds: [],
        draftPrices: {},
      });
      return;
    }

    const storesQuery = ownerMode
      ? supabase.from("stores").select("*").eq("owner_id", user.id).order("name")
      : supabase.from("stores").select("*").eq("active", true).order("name");
    const { data: storesData, error: storesError } = await storesQuery;
    const ownerStoreIds = (storesData || []).map((store) => store.id);
    let productsQuery = supabase.from("products").select("*, stores(name, location)").order("sort_order");
    if (ownerMode) productsQuery = productsQuery.in("store_id", ownerStoreIds.length ? ownerStoreIds : ["00000000-0000-0000-0000-000000000000"]);
    const { data, error } = await productsQuery;

    const liveStores = !storesError && storesData?.length
      ? storesData.map((store) => ({
          ...store,
          image: store.image_url,
          responseTime: store.response_time,
        }))
      : !ownerMode && error ? PARTNER_STORES : [];

    if (error || storesError) {
      if (ownerMode) {
        this.setState({ products: [], stores: liveStores, loading: false, usingDemo: false, isAdmin, ownerMode: true, ownerApplication, selectedIds: [], draftPrices: {}, error: error?.message || storesError?.message || "We could not load your store workspace." });
        return;
      }
      const localProducts = this.getLocalRows();
      const products = localProducts.length
        ? localProducts.map(toMarketplaceProduct)
        : getDemoProducts();
      this.setState({
        products,
        stores: liveStores,
        loading: false,
        usingDemo: true,
        isAdmin,
        ownerMode: false,
        ownerApplication: null,
        selectedIds: [],
        draftPrices: Object.fromEntries(products.map((product) => [product.id, product.price])),
      });
      return;
    }

    const products = (data || []).map(toMarketplaceProduct);
    this.setState({
      products,
      stores: liveStores,
      loading: false,
      usingDemo: false,
      isAdmin,
      ownerMode,
      ownerApplication,
      selectedIds: [],
      draftPrices: Object.fromEntries(products.map((product) => [product.id, product.price])),
    });
  }

  openCreate() {
    this.setState((prev) => ({
      formVisible: true,
      form: { ...EMPTY_FORM, store_id: prev.stores[0]?.id || "" },
      error: "",
      notice: "",
    }));
  }

  openEdit(product) {
    this.setState({
      formVisible: true,
      error: "",
      notice: "",
      form: {
        id: product.id,
        name_en: product.nameEn,
        name_fr: product.nameFr,
        category: product.category,
        price: product.price,
        old_price: product.oldPrice || "",
        condition: product.condition,
        image_url: product.image,
        store_id: product.storeId || "",
        negotiable: product.negotiable,
        fast_deal: product.fastDeal,
        fast_deal_note: product.fastDealNote || "",
        fast_deal_expires_at: product.fastDealExpiresAt ? product.fastDealExpiresAt.slice(0, 10) : "",
        listing_status: product.verificationStatus === "verified" ? "approved" : "pending",
      },
    });
  }

  closeForm() {
    this.setState({ formVisible: false, error: "" });
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
    const file = event.target.files?.[0];
    if (!file) return;
    const fileError = validateImageFile(file);
    if (fileError) {
      this.setState({ error: fileError });
      event.target.value = "";
      return;
    }

    this.setState({ uploading: true, error: "" });
    if (this.state.usingDemo) {
      this.setState((prev) => ({
        uploading: false,
        form: { ...prev.form, image_url: URL.createObjectURL(file) },
      }));
      return;
    }

    const { data: userResult } = await supabase.auth.getUser();
    if (!userResult?.user) {
      this.setState({ uploading: false, error: "Please sign in again before uploading a product photo." });
      return;
    }
    const path = `seller-products/${userResult.user.id}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      this.setState({ uploading: false, error: error.message });
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
    const { form, usingDemo, products, isAdmin } = this.state;
    if (!form.image_url) {
      this.setState({ error: "Add one clear product photo first." });
      return;
    }

    this.setState({ saving: true, error: "", notice: "" });
    const canPublishImmediately = usingDemo || isAdmin;
    const payload = {
      name_en: form.name_en,
      name_fr: form.name_fr || form.name_en,
      category: form.category,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      condition: form.condition,
      image_url: form.image_url,
      store_id: form.store_id || null,
      negotiable: form.negotiable,
      fast_deal: form.fast_deal,
      fast_deal_note: form.fast_deal_note || null,
      fast_deal_expires_at: form.fast_deal && form.fast_deal_expires_at ? `${form.fast_deal_expires_at}T23:59:59Z` : null,
      fast_deal_expired_at: form.fast_deal ? null : undefined,
      verification_status: canPublishImmediately ? "verified" : "pending",
      listing_status: canPublishImmediately ? "approved" : "pending",
      active: canPublishImmediately,
      sort_order: products.length + 1,
    };

    if (usingDemo) {
      const product = toMarketplaceProduct({ ...payload, id: form.id || `seller-${Date.now()}` }, products.length);
      const nextProducts = form.id
        ? products.map((item) => (item.id === form.id ? product : item))
        : [...products, product];
      this.saveLocalProducts(nextProducts);
      this.setState({ products: nextProducts, saving: false, formVisible: false, notice: "Saved in this seller workspace preview." });
      return;
    }

    const query = form.id
      ? supabase.from("products").update(payload).eq("id", form.id)
      : supabase.from("products").insert(payload);
    const { error } = await query;
    if (error) {
      this.setState({ saving: false, error: error.message });
      return;
    }
    this.setState({
      saving: false,
      formVisible: false,
      notice: form.id
        ? (isAdmin ? "Product published." : "Product updated.")
        : (isAdmin ? "Product published and visible in the shop." : "Product sent for Innovatech review."),
    });
    this.loadData();
  }

  toggleSelect(id) {
    this.setState((prev) => ({
      selectedIds: prev.selectedIds.includes(id)
        ? prev.selectedIds.filter((item) => item !== id)
        : [...prev.selectedIds, id],
    }));
  }

  toggleAll() {
    this.setState((prev) => ({
      selectedIds: prev.selectedIds.length === prev.products.length ? [] : prev.products.map((product) => product.id),
    }));
  }

  handleDraftPriceChange(id, value) {
    this.setState((prev) => ({ draftPrices: { ...prev.draftPrices, [id]: value } }));
  }

  applyBulkChange() {
    const { selectedIds, products, bulkMode, bulkValue } = this.state;
    const value = Number(bulkValue);
    if (!selectedIds.length || !Number.isFinite(value)) return;

    const updates = { ...this.state.draftPrices };
    selectedIds.forEach((id) => {
      const product = products.find((item) => item.id === id);
      if (!product) return;
      let nextPrice = product.price;
      if (bulkMode === "percent-down") nextPrice = product.price * (1 - value / 100);
      if (bulkMode === "percent-up") nextPrice = product.price * (1 + value / 100);
      if (bulkMode === "amount-down") nextPrice = product.price - value;
      if (bulkMode === "amount-up") nextPrice = product.price + value;
      updates[id] = Math.max(0, Math.round(nextPrice));
    });
    this.setState({ draftPrices: updates, bulkValue: "", notice: "Preview updated. Save when the prices look right." });
  }

  async savePriceChanges() {
    const { products, draftPrices, usingDemo } = this.state;
    const changes = products.filter((product) => Number(draftPrices[product.id]) !== Number(product.price));
    if (!changes.length) {
      this.setState({ notice: "No price changes to save." });
      return;
    }

    this.setState({ saving: true, error: "", notice: "" });
    if (usingDemo) {
      const nextProducts = products.map((product) => (
        changes.some((change) => change.id === product.id)
          ? toMarketplaceProduct({ ...productToRow(product), price: Number(draftPrices[product.id]) })
          : product
      ));
      this.saveLocalProducts(nextProducts);
      this.setState({ products: nextProducts, saving: false, notice: `${changes.length} price${changes.length > 1 ? "s" : ""} updated in this preview.` });
      return;
    }

    const results = await Promise.all(changes.map((product) => (
      supabase.from("products").update({ price: Number(draftPrices[product.id]) }).eq("id", product.id)
    )));
    const failed = results.find((result) => result.error);
    if (failed) {
      this.setState({ saving: false, error: failed.error.message });
      return;
    }
    this.setState({ saving: false, notice: `${changes.length} price${changes.length > 1 ? "s" : ""} updated.` });
    this.loadData();
  }

  async copyProductLink(product) {
    const link = buildProductShareLink(product.id, getStoredReferralCode());
    try {
      await navigator.clipboard.writeText(link);
      this.setState({ notice: "Product link copied. Share it on WhatsApp." });
    } catch {
      this.setState({ error: link, notice: "Copy this product link and share it on WhatsApp." });
    }
  }

  renderProduct(product) {
    const { selectedIds, draftPrices } = this.state;
    const isSelected = selectedIds.includes(product.id);
    const status = product.verificationStatus === "verified" ? "Published" : "Needs review";
    return (
      <div className={`seller-product-row ${isSelected ? "seller-product-row--selected" : ""}`} key={product.id}>
        <label className="seller-check">
          <input type="checkbox" checked={isSelected} onChange={() => this.toggleSelect(product.id)} aria-label={`Select ${product.nameEn}`} />
        </label>
        <img className="seller-product-thumb" src={product.image} alt="" />
        <div className="seller-product-name">
          <strong>{product.nameEn}</strong>
          <span>{product.storeName} · {product.category}</span>
          {product.negotiable && <em>Negotiable</em>}
          {product.isFastDealActive && <em className="seller-fast-deal-tag">Fast Deal</em>}
          {product.fastDealExpired && <em className="seller-fast-deal-tag seller-fast-deal-tag--ended">Fast Deal ended</em>}
          <button type="button" className="seller-share-btn" onClick={() => this.copyProductLink(product)}><FaShareAlt /> Share link</button>
        </div>
        <label className="seller-price-input">
          <span>Price (FCFA)</span>
          <input type="number" min="0" value={draftPrices[product.id] ?? product.price} onChange={(event) => this.handleDraftPriceChange(product.id, event.target.value)} />
        </label>
        <span className={`seller-status seller-status--${product.verificationStatus === "verified" ? "published" : "pending"}`}>
          {product.verificationStatus === "verified" ? <FaCheckCircle /> : <FaShieldAlt />} {status}
        </span>
        <button className="seller-edit-btn" onClick={() => this.openEdit(product)} aria-label={`Edit ${product.nameEn}`}><FaEdit /></button>
      </div>
    );
  }

  render() {
    const { products, stores, loading, isAdmin, ownerMode, ownerApplication, selectedIds, bulkMode, bulkValue, formVisible, form, uploading, saving, error, notice } = this.state;
    if (!loading && ownerMode && ownerApplication?.status !== "approved") {
      return (
        <div className="seller-workspace">
          <div className="seller-page-header"><div><span className="eyebrow">Store-owner workspace</span><h1>Your application is {ownerApplication?.status || "pending"}.</h1><p>Innovatech must review your store details before you can post products.</p></div><Link to="/account" className="btn btn--ghost"><FaStore /> View account</Link></div>
          <div className="owner-application-card"><FaShieldAlt aria-hidden="true" /><div><h2>{ownerApplication?.business_name}</h2><p>{ownerApplication?.category} · {ownerApplication?.location}</p><small>{ownerApplication?.review_note || "We will contact you after review."}</small></div></div>
        </div>
      );
    }
    const publishedCount = products.filter((product) => product.verificationStatus === "verified").length;
    const negotiableCount = products.filter((product) => product.negotiable).length;
    const fastDealCount = products.filter((product) => product.isFastDealActive).length;

    return (
      <div className="seller-workspace">
        <div className="seller-page-header">
          <div>
            <span className="eyebrow">Seller workspace</span>
            <h1>{ownerMode ? "Manage your store products simply." : "Manage your products simply."}</h1>
            <p>{ownerMode ? "Your listings are linked to your approved store and remain hidden until Innovatech reviews them." : isAdmin ? "Publish trusted listings directly and keep the marketplace current." : "Take a photo, add a clear price and let Innovatech help verify, negotiate and present it properly."}</p>
          </div>
          <button className="btn btn--primary" onClick={this.openCreate}><FaPlus /> Post a product</button>
        </div>

        <div className="seller-trust-strip">
          <div><FaCamera /><span><strong>Photo first</strong>Use your phone camera to add a product in seconds.</span></div>
          <div><FaTools /><span><strong>Consult us</strong>We can analyse a product or repair before the customer pays.</span></div>
          <div><FaShieldAlt /><span><strong>{isAdmin ? "Publish with control" : "Review before publish"}</strong>{isAdmin ? "Your admin listings go live immediately and remain editable." : "Innovatech checks the listing and supports the conversation."}</span></div>
        </div>

        <div className="seller-stats">
          <div><span>Published listings</span><strong>{publishedCount}</strong><small>Visible to customers</small></div>
          <div><span>Negotiable prices</span><strong>{negotiableCount}</strong><small>We can discuss on your behalf</small></div>
          <div><span>Fast Deals</span><strong>{fastDealCount}</strong><small>Below-market quick sales</small></div>
          <div><span>Selected now</span><strong>{selectedIds.length}</strong><small>Ready for bulk update</small></div>
        </div>

        {error && <p className="form-error seller-message">{error}</p>}
        {notice && <p className="seller-message seller-message--success"><FaCheckCircle /> {notice}</p>}

        <div className="seller-toolbar">
          <div>
            <h2>Your listings</h2>
            <p>Update one price directly, or select several and change them together.</p>
          </div>
          <Link to="/stores" className="btn btn--ghost"><FaStore /> View customer stores</Link>
        </div>

        <div className="seller-bulk-bar">
          <label className="seller-select-all"><input type="checkbox" checked={Boolean(products.length && selectedIds.length === products.length)} onChange={this.toggleAll} /> Select all</label>
          <span>{selectedIds.length ? `${selectedIds.length} selected` : "Select products to update together"}</span>
          <select value={bulkMode} onChange={(event) => this.setState({ bulkMode: event.target.value })}>
            <option value="percent-down">Reduce by %</option>
            <option value="percent-up">Increase by %</option>
            <option value="amount-down">Reduce by FCFA</option>
            <option value="amount-up">Increase by FCFA</option>
          </select>
          <input type="number" min="0" value={bulkValue} onChange={(event) => this.setState({ bulkValue: event.target.value })} placeholder="Value" />
          <button className="btn btn--ghost" disabled={!selectedIds.length || !bulkValue} onClick={this.applyBulkChange}>Preview change</button>
          <button className="btn btn--primary" disabled={saving} onClick={this.savePriceChanges}><FaSave /> Save prices</button>
        </div>

        {loading ? <p>Loading listings...</p> : (
          <div className="seller-product-list">
            <div className="seller-list-head"><span>Product</span><span>Price</span><span>Status</span><span></span></div>
            {products.map((product) => this.renderProduct(product))}
            {!products.length && <div className="seller-empty"><FaStore /><h3>No listings yet</h3><p>Post your first product with one clear phone photo.</p><button className="btn btn--primary" onClick={this.openCreate}><FaPlus /> Post a product</button></div>}
          </div>
        )}

        <div className="seller-consultant-card">
          <div><span className="eyebrow">Innovatech consultant support</span><h2>Need us to negotiate or assess a repair?</h2><p>Send a product or repair photo to our team. We will analyse it, ask the right questions and tell the customer what is realistic before any promise is made.</p></div>
          <a href={whatsappLink("Hi Innovatech, I need a consultant to analyse a product or repair and help with the price.")} target="_blank" rel="noreferrer" className="btn btn--dark"><FaWhatsapp /> Ask a consultant</a>
        </div>

        {formVisible && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal seller-modal" role="dialog" aria-modal="true" aria-labelledby="seller-product-dialog-title" tabIndex="-1" onKeyDown={this.handleModalKeyDown}>
              <div className="admin-modal-header"><div><span className="eyebrow">{form.id ? "Update listing" : "New listing"}</span><h2 id="seller-product-dialog-title">{form.id ? "Edit your product" : "Post a product"}</h2></div><button type="button" onClick={this.closeForm} aria-label="Close">×</button></div>
              <p className="seller-modal-intro">Keep it clear: one good photo, one honest condition and the price you really want.</p>
              <form onSubmit={this.handleSubmit} className="seller-form">
                <label className="seller-photo-upload">
                  {form.image_url ? <img src={form.image_url} alt="Product preview" /> : <><FaCamera /><strong>Take or choose a product photo</strong><span>On a phone, this opens the camera.</span></>}
                  <input type="file" accept="image/*" capture="environment" onChange={this.handleImageFile} />
                </label>
                <div className="form-row"><label htmlFor="seller-name-en">Product name</label><input id="seller-name-en" name="name_en" value={form.name_en} onChange={this.handleChange} placeholder="e.g. iPhone 13 128GB" required /></div>
                <div className="seller-form-grid">
                  <div className="form-row"><label>Category</label><select name="category" value={form.category} onChange={this.handleChange}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></div>
                  <div className="form-row"><label>Condition</label><select name="condition" value={form.condition} onChange={this.handleChange}>{CONDITIONS.map((condition) => <option key={condition}>{condition}</option>)}</select></div>
                </div>
                <div className="seller-form-grid">
                  <div className="form-row"><label>Price (FCFA)</label><input name="price" type="number" min="0" value={form.price} onChange={this.handleChange} placeholder="250000" required /></div>
                  <div className="form-row"><label>Old price (optional)</label><input name="old_price" type="number" min="0" value={form.old_price} onChange={this.handleChange} placeholder="Shows a discount" /></div>
                </div>
                <div className="form-row"><label>Store</label><select name="store_id" value={form.store_id} onChange={this.handleChange}><option value="">Innovatech will connect this listing during review</option>{stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}</select></div>
                <label className="seller-negotiable-toggle"><input type="checkbox" name="negotiable" checked={form.negotiable} onChange={this.handleChange} /><span><strong>Price is negotiable</strong><small>Innovatech can help discuss a fair price with the customer.</small></span></label>
                <label className="seller-fast-deal-toggle"><input type="checkbox" name="fast_deal" checked={form.fast_deal} onChange={this.handleChange} /><span><strong>Mark as Fast Deal</strong><small>Use this when the seller needs a quick sale or the price is below the usual market price.</small></span></label>
                {form.fast_deal && <div className="seller-form-grid seller-fast-deal-fields"><div className="form-row"><label>Deal ends</label><input name="fast_deal_expires_at" type="date" value={form.fast_deal_expires_at} onChange={this.handleChange} required /></div></div>}
                {!this.state.usingDemo && !isAdmin && <p className="seller-review-note"><FaShieldAlt /> New listings stay hidden until Innovatech reviews them.</p>}
                {error && <p className="form-error">{error}</p>}
                <div className="form-actions"><button type="submit" className="btn btn--primary" disabled={saving || uploading}><FaSave /> {uploading ? "Uploading photo..." : saving ? "Saving..." : form.id ? "Save changes" : isAdmin ? "Publish product" : "Send for review"}</button><button type="button" className="btn btn--ghost" onClick={this.closeForm}>Cancel</button></div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}
