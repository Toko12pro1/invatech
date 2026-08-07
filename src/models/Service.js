export default class Service {
  constructor({ id, title, summary, description, image, icon, features = [] }) {
    this.id = id;
    this.title = title;
    this.summary = summary;
    this.description = description;
    this.image = image;
    this.icon = icon;
    this.features = features;
  }

  get featureCount() {
    return this.features.length;
  }
}
