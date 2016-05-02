class Model {
  constructor(name) {
    this.id = this.constructor._nextId();
    this.name = name || `${this.constructor.name} ${this.id}`;
  }

  static get count() {
    return !this._count ? 0 : this._count;
  }

  static _nextId() {
    this._count = this.count + 1;
    return this._count;
  }
}

export { Model };
export default Model;
