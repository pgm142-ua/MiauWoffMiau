const reports = new Map();

function json(res, status, payload) {
  res.setHeader?.('Content-Type', 'application/json; charset=utf-8');
  res.setHeader?.('Cache-Control', 'no-store');
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(status).json(payload);
  }
  res.statusCode = status;
  res.end(JSON.stringify(payload));
}

function cleanText(value, max = 2400) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export default function handler(req, res) {
  const method = String(req?.method || 'GET').toUpperCase();

  if (method === 'POST') {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const id = cleanText(body.id, 20);
    if (!/^SAFE-\d{3,6}$/i.test(id)) {
      return json(res, 400, { error: 'INVALID_REPORT_CODE' });
    }
    reports.set(id, {
      id,
      status: body.status === 'resuelto' || body.status === 'seguimiento' ? body.status : 'pendiente',
      priority: body.priority === 'critica' ? 'critica' : 'normal',
      place: cleanText(body.place, 30),
      recipient: cleanText(body.recipient, 30),
      date: cleanText(body.date, 40),
      text: cleanText(body.text),
      context: cleanText(body.context, 300),
      statusHistory: Array.isArray(body.statusHistory) ? body.statusHistory.slice(-20) : [],
    });
    return json(res, 201, { ok: true, id });
  }

  if (method === 'PATCH') {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const id = cleanText(body.id, 20);
    const report = reports.get(id);
    if (!report) return json(res, 404, { error: 'REPORT_NOT_FOUND' });
    if (['pendiente', 'seguimiento', 'resuelto'].includes(body.status)) {
      report.status = body.status;
      report.statusHistory.push({
        status: body.status,
        date: new Date().toISOString(),
        note: cleanText(body.note, 300),
      });
      report.statusHistory = report.statusHistory.slice(-20);
    }
    return json(res, 200, { ok: true, report });
  }

  if (method === 'GET') {
    const query = req.query && typeof req.query === 'object' ? req.query : {};
    const id = cleanText(query.id, 20).toUpperCase();
    if (id) {
      const report = reports.get(id);
      if (!report) return json(res, 404, { error: 'REPORT_NOT_FOUND' });
      return json(res, 200, {
        id: report.id,
        status: report.status,
        priority: report.priority,
        date: report.date,
      });
    }
    return json(res, 200, { ok: true, reports: Array.from(reports.values()) });
  }

  return json(res, 405, { error: 'METHOD_NOT_ALLOWED' });
}
