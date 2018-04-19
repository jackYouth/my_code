export const dyChange = (dyVal) => {
  return {
    type: 'DY_CHANGE',
    dyVal
  }
}

export const floorChange = (floor) => {
  return {
    type: 'FLOOR_CHANGE',
    floor
  }
}

export const sumFloorChange = (val) => {
  return {
    type: 'SUMFLOOR_CHANGE',
    sumFloor: val
  }
}

export const areaChange = (val) => {
  return {
    type: 'AREA_CHANGE',
    area: val
  }
}

export const ndChange = (val) => {
  return {
    type: 'ND_CHANGE',
    year: val
  }
}

export const chooseCx = (i,index) => {
  return {
    type: 'CHOOSE_CX',
    currIndex: index,
    cx: i
  }
}

export const clickEvaluation = (houseInfor) => {
  return {
    type: 'CLICK_EVALUATION',
    houseInfor
  }
}

export const buildingChange = (val) => {
  return {
    type: 'BUILDING_CHANGE',
    building: val
  }
}
