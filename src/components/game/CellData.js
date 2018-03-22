class CellData {
  constructor(id, value) {
    this.id = id;
    this.value = value || 0;
  }

  setValue(value) {
    this.value = value;
  }
}

export default CellData;