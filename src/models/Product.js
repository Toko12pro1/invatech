export default class Product {
  constructor({ id, name, category, price, oldPrice, image, condition = "New", badge = "" }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.oldPrice = oldPrice;
    this.image = image;
    this.condition = condition;
    this.badge = badge;
  }

  get isOnSale() {
    return Boolean(this.oldPrice && this.oldPrice > this.price);
  }

  get discountPercent() {
    if (!this.isOnSale) return 0;
    return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
  }

  formatPrice(amount = this.price) {
    return new Intl.NumberFormat("en-US").format(amount) + " FCFA";
  }
}
