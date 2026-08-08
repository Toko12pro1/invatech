export default class WifiPackage {
  constructor(row) {
    this.id = row.id;
    this.dataAmount = row.data_amount;
    this.dataUnit = row.data_unit;
    this.durationDays = row.duration_days;
    this.price = row.price;
    this.oldPrice = row.old_price;
    this.isPopular = row.is_popular;
    this.sortOrder = row.sort_order;
    this.active = row.active;
  }

  get isOnSale() {
    return Boolean(this.oldPrice && this.oldPrice > this.price);
  }

  formatPrice(amount = this.price) {
    return new Intl.NumberFormat("en-US").format(amount) + " FCFA";
  }

  toRow() {
    return {
      data_amount: this.dataAmount,
      data_unit: this.dataUnit,
      duration_days: this.durationDays,
      price: this.price,
      old_price: this.oldPrice || null,
      is_popular: Boolean(this.isPopular),
      sort_order: this.sortOrder || 0,
      active: this.active !== false,
    };
  }
}
