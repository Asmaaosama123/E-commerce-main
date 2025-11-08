(async () => {
  const base = 'http://localhost:5000';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmI4OGQ3OTNkZjNiMzkzZjQxMDA1ZSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc2MTMxNTEwNSwiZXhwIjoxNzYzOTA3MTA1fQ.oOHHLBvyZ2_QT9VoEKhrdTVF7pE6ePcBK6eyJsFKU4M';

  try {
    console.log('1) GET /api/cart');
    let res = await fetch(base + '/api/cart', { headers: { Authorization: `Bearer ${token}` } });
    console.log('Status', res.status);
    console.log(await res.text());

    console.log('\n2) POST /api/cart');
    const addBody = { productId: '68ed67894eca5eb1b345b686', qty: 2 };
    res = await fetch(base + '/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(addBody) });
    console.log('Status', res.status);
    console.log(await res.text());

    console.log('\n3) GET /api/cart (after add)');
    res = await fetch(base + '/api/cart', { headers: { Authorization: `Bearer ${token}` } });
    console.log('Status', res.status);
    console.log(await res.text());

    console.log('\n4) POST /api/orders (checkout)');
    const orderBody = {
      orderItems: [{ product: '68ed67894eca5eb1b345b686', qty: 2, name: 'منتج اختبار نهائي', price: 1200, image: 'test_image.jpg' }],
      shippingAddress: { address: '123 Test St', city: 'TestCity' },
      paymentMethod: 'cod',
      totalPrice: 2400,
    };
    res = await fetch(base + '/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(orderBody) });
    console.log('Status', res.status);
    console.log(await res.text());
  } catch (err) {
    console.error('Error', err);
  }
})();
