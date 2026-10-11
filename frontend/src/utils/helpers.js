export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export const getStatusColor = (status) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-700',
    paid: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    available: 'bg-green-100 text-green-700',
    occupied: 'bg-orange-100 text-orange-700',
    to_cook: 'bg-yellow-100 text-yellow-700',
    preparing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const sortTablesFloorAndRowWise = (tablesList) => {
  if (!tablesList) return [];

  const getFloorOrder = (floorName) => {
    const name = (floorName || '').toLowerCase();
    if (name.includes('ground')) return 0;
    if (name.includes('first') || name.includes('1st')) return 1;
    if (name.includes('second') || name.includes('2nd')) return 2;
    if (name.includes('third') || name.includes('3rd')) return 3;
    const match = name.match(/\d+/);
    if (match) return parseInt(match[0]) + 1;
    return 999;
  };

  return [...tablesList].sort((a, b) => {
    const aFloorName = a.floor?.name || '';
    const bFloorName = b.floor?.name || '';

    if (aFloorName !== bFloorName) {
      const aOrder = getFloorOrder(aFloorName);
      const bOrder = getFloorOrder(bFloorName);
      if (aOrder !== bOrder) return aOrder - bOrder;
      return aFloorName.localeCompare(bFloorName);
    }

    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });
};

export const getSeatDots = (count) => {
  if (count === 1) {
    return [{ className: 'top-0 left-1/2 -translate-x-1/2' }];
  }
  if (count === 2) {
    return [
      { className: 'top-1/2 -translate-y-1/2 -left-1.5' },
      { className: 'top-1/2 -translate-y-1/2 -right-1.5' }
    ];
  }
  if (count === 3) {
    return [
      { className: 'top-0 left-1/2 -translate-x-1/2' },
      { className: 'bottom-0.5 left-2' },
      { className: 'bottom-0.5 right-2' }
    ];
  }
  if (count === 4) {
    return [
      { className: 'top-0 left-1/2 -translate-x-1/2' },
      { className: 'bottom-0 left-1/2 -translate-x-1/2' },
      { className: 'left-0 top-1/2 -translate-y-1/2' },
      { className: 'right-0 top-1/2 -translate-y-1/2' }
    ];
  }
  if (count === 6) {
    return [
      { className: 'top-0 left-5' },
      { className: 'top-0 right-5' },
      { className: 'bottom-0 left-5' },
      { className: 'bottom-0 right-5' },
      { className: 'left-0 top-1/2 -translate-y-1/2' },
      { className: 'right-0 top-1/2 -translate-y-1/2' }
    ];
  }
  const dots = [];
  for (let i = 0; i < count; i++) {
    if (i === 0) dots.push({ className: 'top-0 left-1/2 -translate-x-1/2' });
    else if (i === 1) dots.push({ className: 'bottom-0 left-1/2 -translate-x-1/2' });
    else if (i === 2) dots.push({ className: 'left-0 top-1/2 -translate-y-1/2' });
    else if (i === 3) dots.push({ className: 'right-0 top-1/2 -translate-y-1/2' });
    else if (i === 4) dots.push({ className: 'top-1 left-2.5' });
    else if (i === 5) dots.push({ className: 'top-1 right-2.5' });
    else if (i === 6) dots.push({ className: 'bottom-1 left-2.5' });
    else if (i === 7) dots.push({ className: 'bottom-1 right-2.5' });
  }
  return dots;
};

export const getTableShapeClass = (seats) => {
  if (seats <= 2) {
    return 'w-14 h-14 rounded-full';
  } else if (seats <= 4) {
    return 'w-14 h-14 rounded-2xl';
  } else {
    return 'w-18 h-12 rounded-xl';
  }
};
