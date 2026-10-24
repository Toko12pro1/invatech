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
    this.listingStatus = row.listing_status || "approved";
    this.storeId = row.store_id || null;
    this.storeName = row.store_name || "Innovatech Verified Hub";
    this.storeWhatsapp = row.store_whatsapp || row.whatsapp || null;
    this.storeLocation = row.store_location || "Yaoundé, Cameroon";
    this.verificationStatus = row.verification_status || "verified";
    this.verificationLevel = row.verification_level || (this.verificationStatus === "verified" ? "store_reviewed" : "seller_listed");
    this.verificationScope = Array.isArray(row.verification_scope) ? row.verification_scope : [];
    this.verifiedBy = row.verified_by || null;
    this.verificationReference = row.verification_reference || null;
    this.lastCheckedAt = row.last_checked_at || row.verified_at || null;
    this.negotiable = Boolean(row.negotiable);
    this.verificationNote = row.verification_note || null;
    this.fastDeal = Boolean(row.fast_deal);
    this.fastDealNote = row.fast_deal_note || "Seller needs a quick sale";
    this.fastDealExpiresAt = row.fast_deal_expires_at || null;
    this.fastDealExpiredAt = row.fast_deal_expired_at || null;
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

  get fastDealExpired() {
    if (this.fastDealExpiredAt) return true;
    return Boolean(this.fastDeal && this.fastDealExpiresAt && new Date(this.fastDealExpiresAt).getTime() <= Date.now());
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
      store_whatsapp: this.storeWhatsapp,
      verification_status: this.verificationStatus,
      verification_level: this.verificationLevel,
      verification_scope: this.verificationScope,
      verified_by: this.verifiedBy,
      verification_reference: this.verificationReference,
      last_checked_at: this.lastCheckedAt,
      negotiable: this.negotiable,
      verification_note: this.verificationNote,
      fast_deal: this.fastDeal,
      fast_deal_note: this.fastDealNote,
      fast_deal_expires_at: this.fastDealExpiresAt,
      fast_deal_expired_at: this.fastDealExpiredAt,
      sort_order: this.sortOrder || 0,
      active: this.active !== false,
      listing_status: this.listingStatus,
    };
  }
}
