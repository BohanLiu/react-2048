class CellData {
  constructor(id, value) {
    this.id = id;
    this.value = value || 0;
    this.isNewlySpawned = true;
  }

  setValue(value) {
    this.value = value;
    this.hasValueChanged = true;
  }

  setIsNewlySpawned() {
    this.isNewlySpawned = true;
  }
  
  cleanStatusData() {
    this.hasValueChanged = false;
    this.isNewlySpawned = false;
  }

  clone() {
    let clonedCell = new CellData(this.id, this.value);
    clonedCell.hasValueChanged = this.hasValueChanged;
    clonedCell.isNewlySpawned = this.isNewlySpawned;
    return clonedCell;
  }

  cloneDataOnly() {
    let clonedCell = new CellData(this.id, this.value);
    clonedCell.cleanStatusData();
    return clonedCell;
  }
}

export default CellData;