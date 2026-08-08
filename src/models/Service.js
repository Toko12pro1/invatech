export default class Service {
  constructor({ id, image, icon }) {
    this.id = id;
    this.image = image;
    this.icon = icon;
  }

  translationKey(field) {
    return `servicesData.${this.id}.${field}`;
  }
}
