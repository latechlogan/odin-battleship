class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
  }

  hit() {
    this.hits++;
  }

  sunk() {
    return this.hits >= this.length;
  }
}

module.exports = Ship;
