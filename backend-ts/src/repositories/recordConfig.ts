// FIELDS FILTER
export const activeRowCriteria = {
  deleted: null,
  deletedBy: null,
}

export const deletedRowCriteria = {
  deleted: { not: null },
  deletedBy: { not: null },
}

// FIELDS SELECTION

export const metaFields = {
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
}
