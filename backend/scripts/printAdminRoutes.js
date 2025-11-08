const express = require('express');
const adminRoutes = require('../routes/adminRoutes');

const app = express();
app.use('/api/admin', adminRoutes);

const routes = [];
app._router.stack.forEach(m => {
  if (m.route) {
    routes.push(m.route);
  } else if (m.name === 'router' && m.handle && m.handle.stack) {
    m.handle.stack.forEach(r => {
      if (r.route) routes.push(r.route);
    });
  }
});

console.log('Registered routes under /api/admin:');
routes.forEach(r => {
  const methods = Object.keys(r.methods).join(',').toUpperCase();
  console.log(methods, r.path);
});
