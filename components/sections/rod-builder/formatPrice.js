// $119 or $124.99
export const formatPrice = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`
