import CellData from './CellData';

describe("CellData tests:", () => {

  it('should create a new CellData with given arguments', () => {
    let cell = new CellData(1, 2);
    expect(cell).not.toBeNull();
    expect(cell.id).toBe(1);
    expect(cell.value).toBe(2);
    expect(cell.isNewlySpawned).toBe(true);
  });

  it('should clone a same CellData', () => {
    let cell = new CellData(1, 2);
    let clonedCell = cell.clone();
    expect(clonedCell.id).toEqual(cell.id);
    expect(clonedCell.value).toEqual(cell.value);
    expect(clonedCell.isNewlySpawned).toEqual(cell.isNewlySpawned);
    expect(clonedCell.hasValueChanged).toEqual(cell.hasValueChanged);
  });

  it('should clone a CellData with same id and value but no status', () => {
    let cell = new CellData(1, 2);
    let clonedCell = cell.cloneDataOnly();
    expect(clonedCell.id).toEqual(cell.id);
    expect(clonedCell.value).toEqual(cell.value);
    expect(clonedCell.isNewlySpawned).toEqual(false);
    expect(clonedCell.hasValueChanged).toEqual(false);
  });

  it('should set correct value and status', () => {
    let cell = new CellData(1, 2);
    cell.setValue(4);
    expect(cell.id).toBe(1);
    expect(cell.value).toEqual(4);
    expect(cell.hasValueChanged).toEqual(true);
    expect(cell.isNewlySpawned).toEqual(true);
  });

  it('should clean status', () => {
    let cell = new CellData(1, 2);
    cell.setValue(4);
    expect(cell.id).toBe(1);
    expect(cell.value).toEqual(4);
    expect(cell.hasValueChanged).toEqual(true);
    expect(cell.isNewlySpawned).toEqual(true);

    cell.cleanStatusData();
    expect(cell.id).toBe(1);
    expect(cell.value).toEqual(4);
    expect(cell.hasValueChanged).toEqual(false);
    expect(cell.isNewlySpawned).toEqual(false);
  });

})