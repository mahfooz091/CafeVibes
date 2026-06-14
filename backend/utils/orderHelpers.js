export const calculateOrderTotals = (items, discount = 0, discountType = 'fixed') => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = items.reduce(
    (sum, item) => sum + (item.price * item.quantity * (item.tax || 0)) / 100,
    0
  );

  let discountAmount = discount;
  if (discountType === 'percentage') {
    discountAmount = (subtotal * discount) / 100;
  }

  const total = Math.max(0, subtotal + taxAmount - discountAmount);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    discount: Math.round(discountAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

export const getActivePromotions = async (Promotion, orderItems, subtotal) => {
  const now = new Date();
  const promotions = await Promotion.find({
    isActive: true,
    autoApply: true,
    validFrom: { $lte: now },
    $or: [{ validUntil: null }, { validUntil: { $gte: now } }],
  });

  let bestDiscount = 0;
  let bestPromotion = null;

  for (const promo of promotions) {
    let applies = false;

    if (promo.products && promo.products.length > 0) {
      // Applied to specific products: fires when any target product reaches minQuantity
      const matchingItem = orderItems.find(
        (item) =>
          promo.products.some((pId) => pId.toString() === item.product?.toString()) &&
          item.quantity >= (promo.minQuantity || 0)
      );
      if (matchingItem) applies = true;
    } else {
      // Applied to the order: fires when the cart subtotal reaches minOrderAmount
      if (subtotal >= (promo.minOrderAmount || 0)) {
        applies = true;
      }
    }

    if (!applies) continue;

    let discount =
      promo.type === 'percentage'
        ? (subtotal * promo.value) / 100
        : promo.value;

    if (promo.maxDiscount) discount = Math.min(discount, promo.maxDiscount);

    if (discount > bestDiscount) {
      bestDiscount = discount;
      bestPromotion = promo;
    }
  }

  return { discount: bestDiscount, promotion: bestPromotion };
};
