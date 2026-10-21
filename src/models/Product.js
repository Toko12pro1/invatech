export default class Product {
  constructor(row) {
    this.id = row.id;
    this.nameEn = row.name_en;
    this.nameFr = row.name_fr;
    this.category = row.category;
    this.price = row.price;
    this.oldPrice = row.old_price;
    this.condition = row.condition;
    this.badge = row.badge;
    this.image = row.image_url;
    this.sortOrder = row.sort_order;
    this.active = row.active;
    this.storeId = row.store_id || null;
    this.storeName = row.store_name || "Innovatech Verified Hub";
    this.storeLocation = row.store_location || "Yaoundé, Cameroon";
    this.verificationStatus = row.verification_status || "verified";
    this.negotiable = Boolean(row.negotiable);
    this.verificationNote = row.verification_note || "Checked by Innovatech";
    this.fastDeal = Boolean(row.fast_deal);
    this.fastDealNote = row.fast_deal_note || "Seller needs a quick sale";
    this.fastDealExpiresAt = row.fast_deal_expires_at || null;
  }

  getName(lang) {
    return lang === "fr" ? this.nameFr : this.nameEn;
  }

  get isOnSale() {
    return Boolean(this.oldPrice && this.oldPrice > this.price);
  }

  get isFastDealActive() {
    if (!this.fastDeal) return false;
    if (!this.fastDealExpiresAt) return true;
    return new Date(this.fastDealExpiresAt).getTime() > Date.now();
  }

  get discountPercent() {
    if (!this.isOnSale) return 0;
    return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
  }

  formatPrice(amount = this.price) {
    return new Intl.NumberFormat("en-US").format(amount) + " FCFA";
  }

  toRow() {
    return {
      name_en: this.nameEn,
      name_fr: this.nameFr,
      category: this.category,
      price: this.price,
      old_price: this.oldPrice || null,
      condition: this.condition,
      badge: this.badge || null,
      image_url: this.image,
      store_id: this.storeId,
      store_name: this.storeName,
      store_location: this.storeLocation,
      verification_status: this.verificationStatus,
      negotiable: this.negotiable,
      verification_note: this.verificationNote,
      fast_deal: this.fastDeal,
      fast_deal_note: this.fastDealNote,
      fast_deal_expires_at: this.fastDealExpiresAt,
      sort_order: this.sortOrder || 0,
      active: this.active !== false,
    };
  }
}
