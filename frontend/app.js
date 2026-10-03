/* Bookwise 2.0 — lightweight frontend for the existing Booking System API. */
(function () {
  'use strict';

  var APP_VERSION = '2.0.0';
  var API_BASE = window.BOOKING_API_URL || '/api';
  document.title = 'Bookwise ' + APP_VERSION + ' — Appointment workspace';
  var app = document.getElementById('app');
  var toastRegion = document.getElementById('toast-region');
  var token = localStorage.getItem('booking_token');
  var storedUser = localStorage.getItem('booking_user');
  var state = {
    user: storedUser ? safeJson(storedUser) : null,
    appointments: [],
    appointmentsLoaded: false,
    appointmentsLoading: false,
    appointmentsError: '',
    detail: null,
    detailLoading: false,
    detailError: '',
    filters: { search: '', status: 'all', date: '' },
    month: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    authError: '',
    authSuccess: '',
    formError: '',
    settingsMessage: '',
    settingsError: ''
  };

  function safeJson(value) { try { return JSON.parse(value); } catch (error) { return null; } }

  function icon(name, size) {
    var paths = {
      sparkles: '<path d="m12 3-1.2 4.1L7 8.3l3.8 1.2L12 14l1.2-4.5L17 8.3l-3.8-1.2L12 3Z"/><path d="m19 14-.7 2.3L16 17l2.3.7L19 20l.7-2.3L22 17l-2.3-.7L19 14ZM5 3l-.5 1.5L3 5l1.5.5L5 7l.5-1.5L7 5l-1.5-.5L5 3Z"/>',
      grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
      clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M8 9h8M8 13h8M8 17h5"/>',
      calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7 3v4M17 3v4M3.5 10h17M7.5 14h.01M11.5 14h.01M15.5 14h.01M7.5 18h.01M11.5 18h.01"/>',
      clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
      settings: '<path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18"/><circle cx="12" cy="12" r="4"/>',
      user: '<circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c.7-3.1 3.2-5 7.5-5s6.8 1.9 7.5 5"/>',
      logout: '<path d="M14 8V5.5A2.5 2.5 0 0 0 11.5 3h-5A2.5 2.5 0 0 0 4 5.5v13A2.5 2.5 0 0 0 6.5 21h5a2.5 2.5 0 0 0 2.5-2.5V16"/><path d="M10 12h10M17 8l4 4-4 4"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      close: '<path d="m6 6 12 12M18 6 6 18"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
      chevronLeft: '<path d="m15 18-6-6 6-6"/>',
      chevronRight: '<path d="m9 18 6-6-6-6"/>',
      search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
      eye: '<path d="M2.5 12s3.4-5 9.5-5 9.5 5 9.5 5-3.4 5-9.5 5-9.5-5-9.5-5Z"/><circle cx="12" cy="12" r="2.2"/>',
      eyeOff: '<path d="m3 3 18 18M10.6 6.2A10.7 10.7 0 0 1 12 6c6.1 0 9.5 6 9.5 6a17.7 17.7 0 0 1-3 3.5M6.5 6.7C4 8.2 2.5 12 2.5 12s3.4 6 9.5 6c1 0 1.9-.2 2.7-.5"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
      more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
      edit: '<path d="m4 16.5-.8 4.3 4.3-.8L19 8.5a2.8 2.8 0 0 0-4-4L4 16.5Z"/><path d="m13.5 6.5 4 4"/>',
      trash: '<path d="M4 7h16M10 11v6M14 11v6M6.5 7l1 13h9l1-13M9 7V4h6v3"/>',
      check: '<path d="m5 12 4.5 4.5L19 7"/>',
      alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5M12 16h.01"/>',
      checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.7 2.7L16.5 9"/>',
      creditCard: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/>',
      message: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z"/>',
      shield: '<path d="M12 3 19 6v5c0 4.5-2.5 7.3-7 10-4.5-2.7-7-5.5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/>',
      loader: '<path d="M12 3a9 9 0 1 1-6.4 2.6"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
      external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>'
    };
    return '<svg width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || paths.info) + '</svg>';
  }

  function escapeHtml(value) {
    return String(value === undefined || value === null ? '' : value).replace(/[&<>'"]/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character];
    });
  }

  function initials(name) {
    return String(name || 'User').split(' ').filter(Boolean).map(function (part) { return part.charAt(0); }).slice(0, 2).join('').toUpperCase();
  }

  function cleanUser(user) {
    if (!user) return null;
    var copy = Object.assign({}, user);
    delete copy.password;
    return copy;
  }

  function saveSession(nextToken, user) {
    token = nextToken;
    state.user = cleanUser(user);
    localStorage.setItem('booking_token', token);
    localStorage.setItem('booking_user', JSON.stringify(state.user));
  }

  function clearSession() {
    token = null;
    state.user = null;
    localStorage.removeItem('booking_token');
    localStorage.removeItem('booking_user');
    state.appointments = [];
    state.appointmentsLoaded = false;
    state.detail = null;
  }

  function apiErrorMessage(status, payload) {
    if (payload && typeof payload === 'object') {
      if (Array.isArray(payload.errors) && payload.errors.length) return payload.errors.map(function (item) { return item.msg; }).filter(Boolean).join('. ');
      if (payload.message) return payload.message;
      if (payload.msg) return payload.msg;
    }
    if (status === 0) return 'Unable to reach the server. Check your connection and try again.';
    if (status === 401) return 'Your session has expired. Please sign in again.';
    if (status === 403) return 'You do not have permission to perform this action.';
    if (status === 404) return 'The requested record could not be found.';
    if (status === 409) return 'This change conflicts with existing data.';
    return 'Something went wrong. Please try again.';
  }

  function ApiError(message, status, payload) { this.name = 'ApiError'; this.message = message; this.status = status; this.payload = payload; }
  ApiError.prototype = Object.create(Error.prototype);

  async function request(path, options) {
    options = options || {};
    var headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (token) headers['Auth-Booking'] = token;
    var response;
    try { response = await fetch(API_BASE + path, Object.assign({}, options, { headers: headers })); }
    catch (error) { throw new ApiError(apiErrorMessage(0), 0); }
    var text = await response.text();
    var payload = text ? safeJson(text) : null;
    if (payload === null && text) payload = text;
    if (!response.ok) {
      var error = new ApiError(apiErrorMessage(response.status, payload), response.status, payload);
      if (response.status === 401 && payload && payload.msg === 'No Token') { clearSession(); location.hash = '#login'; }
      throw error;
    }
    return payload;
  }

  var api = {
    login: function (body) { return request('/user/login', { method: 'POST', body: JSON.stringify(body) }); },
    register: function (body) { return request('/user/register', { method: 'POST', body: JSON.stringify(body) }); },
    getUser: function (id) { return request('/user/get-user/' + encodeURIComponent(id)); },
    updateUser: function (id, body) { return request('/user/update-user/' + encodeURIComponent(id), { method: 'PUT', body: JSON.stringify(body) }); },
    listAppointments: function () { return request('/appointment/user-appointment'); },
    getAppointment: function (id) { return request('/appointment/get-appointment/' + encodeURIComponent(id)); },
    createAppointment: function (body) { return request('/appointment/post-appointment', { method: 'POST', body: JSON.stringify(body) }); },
    updateAppointment: function (id, body) { return request('/appointment/update/' + encodeURIComponent(id), { method: 'PUT', body: JSON.stringify(body) }); },
    deleteAppointment: function (id) { return request('/appointment/delete/' + encodeURIComponent(id), { method: 'DELETE' }); },
    getPayment: function (id) { return request('/appointments/' + encodeURIComponent(id) + '/payment'); },
    createPayment: function (id, body) { return request('/appointments/' + encodeURIComponent(id) + '/payment', { method: 'POST', body: JSON.stringify(body) }); },
    getFeedback: function (id) { return request('/appointments/' + encodeURIComponent(id) + '/feedback'); },
    createFeedback: function (id, body) { return request('/appointments/' + encodeURIComponent(id) + '/feedback', { method: 'POST', body: JSON.stringify(body) }); }
  };

  function route() {
    var value = (location.hash || '').replace(/^#/, '') || (token ? 'dashboard' : 'login');
    var parts = value.split('/');
    return { value: value, page: parts[0], id: parts[1] || '', action: parts[2] || '' };
  }

  function formatDate(value, options) {
    if (!value) return '—';
    var date = new Date(value);
    return new Intl.DateTimeFormat('en-US', options || { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  }

  function formatTime(value) {
    if (!value) return '—';
    var bits = String(value).split(':');
    var date = new Date();
    date.setHours(Number(bits[0] || 0), Number(bits[1] || 0), 0, 0);
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date);
  }

  function dateInputValue(value) {
    if (!value) return '';
    var date = new Date(value);
    var local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function sameDay(first, second) {
    var a = new Date(first); var b = new Date(second);
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function statusTone(status) {
    if (status === 'Completed') return 'neutral';
    if (status === 'Canceled') return 'danger';
    return 'success';
  }

  function badge(status) { return '<span class="badge badge-' + statusTone(status) + '">' + escapeHtml(status || 'Scheduled') + '</span>'; }

  function avatar(user, large) {
    var content = user && user.Image ? '<img src="' + escapeHtml(user.Image) + '" alt="">' : escapeHtml(initials(user && user.fullName));
    return '<span class="avatar' + (large ? ' large-avatar' : '') + '">' + content + '</span>';
  }

  function button(text, type, action, extra) {
    return '<button type="' + (type || 'button') + '" class="button button-' + (extra && extra.variant || 'primary') + (extra && extra.loading ? ' loading' : '') + '" data-action="' + (action || '') + '"' + (extra && extra.disabled ? ' disabled' : '') + '>' + (extra && extra.loading ? icon('loader', 15) : (extra && extra.icon ? icon(extra.icon, 15) : '') ) + escapeHtml(text) + '</button>';
  }

  function loadingBlock() { return '<div class="card-content"><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-large"></div><div class="skeleton skeleton-large short"></div></div>'; }

  function field(label, name, type, value, placeholder, required, extra) {
    extra = extra || {};
    return '<label class="form-group' + (extra.full ? ' full' : '') + '"><span class="form-label">' + escapeHtml(label) + '</span><input class="field" name="' + escapeHtml(name) + '" type="' + (type || 'text') + '" value="' + escapeHtml(value || '') + '" placeholder="' + escapeHtml(placeholder || '') + '"' + (required ? ' required' : '') + (extra.min !== undefined ? ' min="' + extra.min + '"' : '') + (extra.step ? ' step="' + extra.step + '"' : '') + (extra.accept ? ' accept="' + extra.accept + '"' : '') + '></label>';
  }

  function selectField(label, name, value, options) {
    return '<label class="form-group"><span class="form-label">' + escapeHtml(label) + '</span><select class="select" name="' + escapeHtml(name) + '">' + options.map(function (option) { return '<option value="' + escapeHtml(option) + '"' + (option === value ? ' selected' : '') + '>' + escapeHtml(option) + '</option>'; }).join('') + '</select></label>';
  }

  function pageHeader(eyebrow, title, description, action) { return '<div class="page-header"><div><p class="eyebrow">' + escapeHtml(eyebrow || 'Workspace') + '</p><h2 class="page-title">' + escapeHtml(title) + '</h2>' + (description ? '<p class="page-description">' + escapeHtml(description) + '</p>' : '') + '</div>' + (action ? '<div>' + action + '</div>' : '') + '</div>'; }

  function emptyState(iconName, title, description, action) { return '<div class="empty-state"><span class="empty-icon">' + icon(iconName, 20) + '</span><h3>' + escapeHtml(title) + '</h3><p>' + escapeHtml(description) + '</p>' + (action ? action : '') + '</div>'; }
  function errorState(message) { return '<div class="error-state"><span class="error-icon">' + icon('alert', 20) + '</span><h3>Something went wrong</h3><p>' + escapeHtml(message) + '</p>' + button('Try again', 'button', 'retry') + '</div>'; }

  function sidebar(active) {
    var items = [
      ['dashboard', 'Overview', 'grid'],
      ['appointments', 'Appointments', 'clipboard'],
      ['calendar', 'Calendar', 'calendar'],
      ['settings', 'Account settings', 'settings']
    ];
    return '<aside class="sidebar" id="sidebar"><div class="brand"><span class="brand-mark">' + icon('sparkles', 17) + '</span><span>Bookwise</span><button class="icon-button sidebar-close" data-action="close-menu" aria-label="Close navigation">' + icon('close', 17) + '</button></div><div class="nav-wrap"><p class="nav-label">Workspace</p><nav>' + items.map(function (item) { return '<a class="nav-link' + (active === item[0] ? ' active' : '') + '" href="#' + item[0] + '" data-route="' + item[0] + '">' + icon(item[2], 17) + '<span>' + item[1] + '</span></a>'; }).join('') + '</nav></div><div class="sidebar-profile"><div class="profile-chip">' + avatar(state.user) + '<div class="profile-meta"><p class="profile-name">' + escapeHtml(state.user && state.user.fullName || 'Your account') + '</p><p class="profile-email">' + escapeHtml(state.user && state.user.email || '') + '</p></div><button class="icon-button" data-action="logout" aria-label="Log out">' + icon('logout', 15) + '</button></div></div></aside>';
  }

  function appShell(active, content) {
    var title = active === 'appointments' ? 'Appointments' : active === 'calendar' ? 'Calendar' : active === 'settings' ? 'Account settings' : 'Overview';
    return '<div class="app-shell"><div class="sidebar-overlay" data-action="close-menu"></div>' + sidebar(active) + '<div class="main-wrap"><header class="topbar"><div class="topbar-left"><button class="icon-button menu-toggle" data-action="open-menu" aria-label="Open navigation">' + icon('menu', 19) + '</button><div><p class="topbar-kicker">Workspace</p><h1 class="topbar-title">' + title + '</h1></div></div><div class="topbar-right"><div class="topbar-user"><strong>' + escapeHtml(state.user && state.user.fullName || '') + '</strong><span>Personal workspace</span></div>' + avatar(state.user) + '</div></header><main class="page">' + content + '</main></div></div>';
  }

  async function ensureAppointments() {
    if (state.appointmentsLoaded || state.appointmentsLoading) return;
    state.appointmentsLoading = true;
    try {
      var list = await api.listAppointments();
      state.appointments = Array.isArray(list) ? list : [];
      state.appointmentsLoaded = true;
      state.appointmentsError = '';
    } catch (error) {
      var apiMsg = error && error.message || '';
      if (apiMsg.toLowerCase().indexOf('does not have appointments') !== -1) {
        state.appointments = [];
        state.appointmentsLoaded = true;
        state.appointmentsError = '';
      } else {
        state.appointmentsError = apiMsg || 'Could not load appointments.';
      }
    } finally {
      state.appointmentsLoading = false;
      renderApp();
    }
  }

  async function ensureDetail(id) {
    if (state.detail && state.detail.id === id && !state.detailLoading) return;
    state.detailLoading = true;
    state.detailError = '';
    try {
      var appointment = state.appointments.find(function (item) { return item._id === id; });
      if (!appointment) appointment = await api.getAppointment(id);
      var results = await Promise.allSettled([api.getPayment(id), api.getFeedback(id)]);
      state.detail = { id: id, appointment: appointment, payment: results[0].status === 'fulfilled' ? results[0].value : null, feedback: results[1].status === 'fulfilled' ? results[1].value : null };
    } catch (error) { state.detailError = error.message || 'Could not load this appointment.'; }
    finally { state.detailLoading = false; renderApp(); }
  }

  function dashboardPage() {
    var appointments = state.appointments.slice();
    var today = new Date();
    var todayAppointments = appointments.filter(function (item) { return sameDay(item.date, today); }).sort(function (a, b) { return String(a.time).localeCompare(String(b.time)); });
    var upcoming = appointments.filter(function (item) { return item.status !== 'Canceled' && new Date(String(item.date).slice(0, 10) + 'T' + item.time) >= today; }).sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); }).slice(0, 5);
    var completed = appointments.filter(function (item) { return item.status === 'Completed'; }).length;
    var scheduled = appointments.filter(function (item) { return item.status === 'Scheduled'; }).length;
    var firstName = state.user && state.user.fullName ? state.user.fullName.split(' ')[0] : 'there';
    var greeting = today.getHours() < 12 ? 'morning' : today.getHours() < 18 ? 'afternoon' : 'evening';
    var stats = [['All appointments', appointments.length, 'clipboard', 'ink'], ['Today', todayAppointments.length, 'calendar', 'mint'], ['Upcoming', scheduled, 'clock', 'blue'], ['Completed', completed, 'checkCircle', 'gray']];
    var statsHtml = stats.map(function (item) { return '<div class="card stat-card"><div class="stat-top"><span class="stat-icon ' + item[3] + '">' + icon(item[2], 18) + '</span><span class="stat-spark">' + icon('sparkles', 14) + '</span></div><p class="stat-value">' + item[1] + '</p><p class="stat-label">' + item[0] + '</p></div>'; }).join('');
    var todayHtml = todayAppointments.length ? '<div class="divide">' + todayAppointments.map(function (item) { return '<div class="schedule-row"><strong class="schedule-time">' + formatTime(item.time) + '</strong><span class="schedule-line"></span><div class="schedule-main"><strong>' + escapeHtml(item.Trajtimi) + '</strong><span>' + icon('clock', 12) + escapeHtml(item.status === 'Canceled' ? 'Canceled appointment' : 'Scheduled appointment') + '</span></div><a class="arrow" href="#appointments/' + encodeURIComponent(item._id) + '">' + icon('arrow', 15) + '</a></div>'; }).join('') + '</div>' : emptyState('calendar', 'No appointments today', 'Your day is clear. Create an appointment when you’re ready.', '<a href="#appointments/new">' + button('Create appointment', 'button', '', { icon: 'plus', variant: 'secondary' }) + '</a>');
    var upcomingHtml = upcoming.length ? '<div class="divide">' + upcoming.map(function (item) { var date = new Date(item.date); return '<a class="upcoming-row" href="#appointments/' + encodeURIComponent(item._id) + '"><span class="date-tile"><span>' + new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date) + '</span><span>' + date.getDate() + '</span></span><span class="upcoming-main"><strong>' + escapeHtml(item.Trajtimi) + '</strong><span>' + formatDate(item.date, { weekday: 'short' }) + ' · ' + formatTime(item.time) + '</span></span><span class="arrow">' + icon('arrow', 15) + '</span></a>'; }).join('') + '</div>' : emptyState('calendar', 'Nothing upcoming', 'Your upcoming appointments will appear here.', '');
    var recent = appointments.slice().sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); }).slice(0, 5);
    return '<div>' + '<div class="page-header"><div><p class="eyebrow">' + formatDate(today, { weekday: 'long', month: 'long', day: 'numeric' }) + '</p><h2 class="page-title">Good ' + greeting + ', ' + escapeHtml(firstName) + '.</h2><p class="page-description">Here’s the shape of your day at a glance.</p></div>' + button('New appointment', 'button', 'route-new', { icon: 'plus' }) + '</div>' + '<div class="stats-grid">' + statsHtml + '</div><div class="two-col"><section class="card"><div class="card-header"><div><h3 class="card-title">Today’s schedule</h3><p class="card-subtitle">' + (todayAppointments.length ? todayAppointments.length + ' appointment' + (todayAppointments.length === 1 ? '' : 's') + ' on the calendar' : 'Your day is open') + '</p></div><a class="section-link" href="#calendar">Open calendar ' + icon('arrow', 13) + '</a></div>' + todayHtml + '</section><section class="card"><div class="card-header"><div><h3 class="card-title">Upcoming</h3><p class="card-subtitle">Your next appointments</p></div><a class="section-link" href="#appointments">View all ' + icon('arrow', 13) + '</a></div>' + upcomingHtml + '</section></div><section class="card table-card"><div class="card-header"><div><h3 class="card-title">Recent appointments</h3><p class="card-subtitle">A quick view of your booking history</p></div><a class="section-link" href="#appointments">Manage appointments ' + icon('arrow', 13) + '</a></div>' + (recent.length ? appointmentTable(recent) : emptyState('clipboard', 'No appointments yet', 'Create your first appointment to get started.', '<a href="#appointments/new">' + button('New appointment', 'button', '', { icon: 'plus' }) + '</a>')) + '</section></div>';
  }

  function appointmentTable(appointments) {
    return '<div class="table-head"><span>Appointment</span><span>Date</span><span>Time</span><span>Status</span><span></span></div><div class="divide">' + appointments.map(function (item) { return '<div class="table-row"><div class="table-cell-main"><strong>' + escapeHtml(item.Trajtimi) + '</strong><span>' + formatDate(item.date) + ' · ' + formatTime(item.time) + '</span></div><div class="table-cell">' + formatDate(item.date) + '</div><div class="table-cell">' + formatTime(item.time) + '</div><div class="table-cell">' + badge(item.status) + '</div><a class="icon-button" href="#appointments/' + encodeURIComponent(item._id) + '" aria-label="Open appointment">' + icon('more', 17) + '</a></div>'; }).join('') + '</div><div class="table-footer">Showing ' + appointments.length + ' appointment' + (appointments.length === 1 ? '' : 's') + '</div>';
  }

  function appointmentsPage() {
    var filters = state.filters;
    var list = state.appointments.filter(function (item) { return (!filters.search || String(item.Trajtimi || '').toLowerCase().indexOf(filters.search.toLowerCase()) !== -1) && (filters.status === 'all' || item.status === filters.status) && (!filters.date || String(item.date).slice(0, 10) === filters.date); });
    var options = ['all', 'Scheduled', 'Completed', 'Canceled'];
    var table = list.length ? appointmentTable(list) : emptyState(filters.search || filters.status !== 'all' || filters.date ? 'search' : 'clipboard', filters.search || filters.status !== 'all' || filters.date ? 'No matching appointments' : 'No appointments yet', filters.search || filters.status !== 'all' || filters.date ? 'Try adjusting your filters.' : 'Create your first appointment to get started.', filters.search || filters.status !== 'all' || filters.date ? button('Clear filters', 'button', 'reset-filters', { variant: 'secondary' }) : '<a href="#appointments/new">' + button('New appointment', 'button', '', { icon: 'plus' }) + '</a>');
    return '<div>' + pageHeader('Workspace', 'Appointments', 'Manage and track every upcoming and past appointment.', button('New appointment', 'button', 'route-new', { icon: 'plus' })) + '<div class="card filters"><div class="search-wrap">' + icon('search', 15) + '<input id="search-filter" class="field" placeholder="Search by treatment..." value="' + escapeHtml(filters.search) + '"></div><select id="status-filter" class="select" aria-label="Filter by status">' + options.map(function (option) { return '<option value="' + option + '"' + (filters.status === option ? ' selected' : '') + '>' + (option === 'all' ? 'All statuses' : option) + '</option>'; }).join('') + '</select><input id="date-filter" class="date-input" type="date" aria-label="Filter by date" value="' + escapeHtml(filters.date) + '">' + button('Reset', 'button', 'reset-filters', { icon: 'close', variant: 'ghost' }) + '</div><section class="card table-card">' + table + '</section></div>';
  }

  function appointmentForm(id, editing) {
    var item = editing ? (state.detail && state.detail.appointment) || state.appointments.find(function (appointment) { return appointment._id === id; }) : null;
    if (editing && !item) return '<section class="card">' + errorState('This appointment could not be found.') + '</section>';
    var values = item || { Trajtimi: '', date: '', time: '', status: 'Scheduled' };
    return '<div class="form-page"><a class="back-link" href="#appointments">' + icon('arrowLeft', 15) + ' Back to appointments</a><div class="page-header"><div><p class="eyebrow">' + (editing ? 'Update appointment' : 'New appointment') + '</p><h2 class="page-title">' + (editing ? 'Keep the details current.' : 'Create an appointment.') + '</h2><p class="page-description">The appointment will be saved directly to your Booking System account.</p></div></div><div class="form-layout"><section class="card form-card"><form id="appointment-form" data-id="' + escapeHtml(id || '') + '" data-editing="' + (editing ? 'true' : 'false') + '"><div class="form-heading"><span class="form-heading-icon">' + icon('clipboard', 18) + '</span><div><h3>Appointment details</h3><p>Only fields supported by the existing API are shown.</p></div></div><div class="form-grid">' + field('Treatment or service', 'Trajtimi', 'text', values.Trajtimi, 'e.g. Consultation', true, { full: true }) + field('Date', 'date', 'date', dateInputValue(values.date), '', true) + field('Time', 'time', 'time', values.time, '', true) + selectField('Status', 'status', values.status || 'Scheduled', ['Scheduled', 'Completed', 'Canceled']) + '</div>' + (state.formError ? '<p class="error-message" style="margin-top:18px">' + icon('alert', 14) + escapeHtml(state.formError) + '</p>' : '') + '<div class="form-actions"><a class="button button-secondary" href="#appointments">Cancel</a><button class="button button-primary" type="submit">' + (editing ? 'Save changes' : 'Create appointment') + '</button></div></form></section><section class="card preview-card"><div class="preview-top"><span class="badge badge-success" style="float:right">' + escapeHtml(values.status || 'Scheduled') + '</span><p class="preview-label">Preview</p><h3>' + escapeHtml(values.Trajtimi || 'Your appointment') + '</h3></div><div class="preview-bottom"><div class="preview-item"><span class="preview-item-icon">' + icon('calendar', 15) + '</span><div><small>Date</small><strong>' + (values.date ? formatDate(values.date, { dateStyle: 'medium' }) : 'Not selected') + '</strong></div></div><div class="preview-item"><span class="preview-item-icon">' + icon('clock', 15) + '</span><div><small>Time</small><strong>' + (values.time ? formatTime(values.time) : 'Not selected') + '</strong></div></div><div class="info-note">' + icon('info', 14) + '<span>Time availability is managed by your existing Booking System API.</span></div></div></section></div></div>';
  }

  function detailPage(id) {
    if (state.detailLoading || !state.detail || state.detail.id !== id) return '<a class="back-link" href="#appointments">' + icon('arrowLeft', 15) + ' Back to appointments</a><div class="card">' + (state.detailError ? errorState(state.detailError) : loadingBlock()) + '</div>';
    var detail = state.detail; var item = detail.appointment;
    return '<div><a class="back-link" href="#appointments">' + icon('arrowLeft', 15) + ' Back to appointments</a><div class="detail-top"><div><p class="eyebrow">Appointment details</p><h2 class="page-title">' + escapeHtml(item.Trajtimi) + '</h2><p class="page-description">Created ' + (item.createdAt ? formatDate(item.createdAt) : 'recently') + ' · ID ' + escapeHtml(String(item._id).slice(-8)) + '</p></div><div class="detail-actions"><a class="button button-secondary" href="#appointments/' + encodeURIComponent(id) + '/edit">' + icon('edit', 15) + ' Edit</a>' + button('Delete', 'button', 'delete-appointment', { icon: 'trash', variant: 'danger' }) + '</div></div>' + (state.formError ? '<p class="error-message" style="margin-bottom:18px">' + icon('alert', 14) + escapeHtml(state.formError) + '</p>' : '') + '<div class="detail-grid"><div class="detail-stack"><section class="card"><div class="detail-meta"><div class="detail-meta-item"><span class="detail-icon">' + icon('calendar', 15) + '</span><div><small>Date</small><strong>' + formatDate(item.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + '</strong></div></div><div class="detail-meta-item"><span class="detail-icon">' + icon('clock', 15) + '</span><div><small>Time</small><strong>' + formatTime(item.time) + '</strong></div></div><div class="detail-meta-item"><span class="detail-icon">' + icon('checkCircle', 15) + '</span><div><small>Status</small><strong>' + badge(item.status) + '</strong></div></div></div></section><section class="card"><div class="card-header"><div><h3 class="card-title">Update status</h3><p class="card-subtitle">Keep the appointment lifecycle accurate.</p></div></div><div class="status-actions">' + ['Scheduled', 'Completed', 'Canceled'].map(function (status) { return '<button class="button ' + (item.status === status ? 'button-primary' : 'button-secondary') + '" data-action="status-update" data-status="' + status + '">' + status + '</button>'; }).join('') + '</div></section>' + paymentCard(detail) + feedbackCard(detail) + '</div><aside class="detail-stack"><section class="card detail-side-card"><div class="detail-side-top"><p class="preview-label">Appointment overview</p><h3>You’re all set.</h3><p>This record is synced with your existing Booking System account.</p></div><div class="detail-side-content"><div class="detail-line">' + icon('calendar', 15) + '<div><small>When</small><strong>' + formatDate(item.date) + ' at ' + formatTime(item.time) + '</strong></div></div><div class="detail-line">' + icon('user', 15) + '<div><small>Customer</small><strong>Your account</strong></div></div><div class="detail-line">' + icon('clock', 15) + '<div><small>Appointment ID</small><strong>' + escapeHtml(item._id) + '</strong></div></div></div></section><div class="soft-callout"><h3>Need a change?</h3><p>Edit the date or time and the updated details will be sent to the backend immediately.</p><a href="#appointments/' + encodeURIComponent(id) + '/edit">Reschedule appointment ' + icon('edit', 13) + '</a></div></aside></div></div>';
  }

  function paymentCard(detail) {
    if (detail.payment) return '<section class="card"><div class="card-header"><div><h3 class="card-title">Payment</h3><p class="card-subtitle">Payment data from the payment API.</p></div><span class="stat-icon blue">' + icon('creditCard', 17) + '</span></div><div class="payment-row"><div><small class="card-subtitle">Recorded amount</small><p class="payment-amount">' + Number(detail.payment.amount || 0).toLocaleString(undefined, { style: 'currency', currency: 'USD' }) + '</p></div><span class="payment-status">' + escapeHtml(detail.payment.status) + '</span></div></section>';
    return '<section class="card"><div class="card-header"><div><h3 class="card-title">Payment</h3><p class="card-subtitle">Record payment data through the existing API.</p></div><span class="stat-icon blue">' + icon('creditCard', 17) + '</span></div><form id="payment-form" class="compact-form"><label class="form-group"><span class="form-label">Amount</span><input class="field" name="amount" type="number" min="0" step="0.01" placeholder="0.00" required></label>' + selectField('Status', 'paymentStatus', 'Completed', ['Completed', 'Pending']) + '<button class="button button-primary" type="submit">Record</button></form></section>';
  }

  function feedbackCard(detail) {
    if (detail.feedback) return '<section class="card"><div class="card-header"><div><h3 class="card-title">Feedback</h3><p class="card-subtitle">Saved feedback for this appointment.</p></div><span class="stat-icon mint">' + icon('message', 17) + '</span></div><div class="feedback-view"><div class="stars">' + '★'.repeat(Number(detail.feedback.rating || 0)) + '<span>' + detail.feedback.rating + '/5</span></div><p>' + escapeHtml(detail.feedback.comment) + '</p></div></section>';
    return '<section class="card"><div class="card-header"><div><h3 class="card-title">Feedback</h3><p class="card-subtitle">Capture a note about this appointment.</p></div><span class="stat-icon mint">' + icon('message', 17) + '</span></div><form id="feedback-form" class="card-content"><div class="form-grid"><label class="form-group"><span class="form-label">Rating</span><select class="select" name="rating"><option value="5">5 — Excellent</option><option value="4">4 — Good</option><option value="3">3 — Okay</option><option value="2">2 — Poor</option><option value="1">1 — Bad</option></select></label><label class="form-group"><span class="form-label">Comment</span><textarea class="field" name="comment" rows="3" placeholder="Share a short note..." required></textarea></label></div><button class="button button-primary" style="margin-top:17px" type="submit">Save feedback</button></form></section>';
  }

  function calendarPage() {
    var month = state.month; var appointments = state.appointments;
    var start = new Date(month.getFullYear(), month.getMonth(), 1); var end = new Date(month.getFullYear(), month.getMonth() + 1, 0); var offset = (start.getDay() + 6) % 7; var count = Math.ceil((offset + end.getDate()) / 7) * 7;
    var days = Array.from({ length: count }, function (_, index) { return new Date(month.getFullYear(), month.getMonth(), index - offset + 1); });
    var monthAppointments = appointments.filter(function (item) { var date = new Date(item.date); return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth(); });
    var today = appointments.filter(function (item) { return sameDay(item.date, new Date()); }).sort(function (a, b) { return String(a.time).localeCompare(String(b.time)); });
    var calendarCells = days.map(function (day) { var list = appointments.filter(function (item) { return sameDay(item.date, day); }).sort(function (a, b) { return String(a.time).localeCompare(String(b.time)); }); var inMonth = day.getMonth() === month.getMonth(); var isToday = sameDay(day, new Date()); return '<div class="calendar-day' + (!inMonth ? ' muted' : '') + (isToday ? ' today' : '') + '"><span class="day-number">' + day.getDate() + '</span>' + list.slice(0, 3).map(function (item) { return '<a class="event-pill" href="#appointments/' + encodeURIComponent(item._id) + '">' + formatTime(item.time) + ' · ' + escapeHtml(item.Trajtimi) + '</a>'; }).join('') + (list.length > 3 ? '<p class="more-events">+' + (list.length - 3) + ' more</p>' : '') + '</div>'; }).join('');
    var todayHtml = today.length ? '<div class="divide">' + today.map(function (item) { return '<a class="today-row" href="#appointments/' + encodeURIComponent(item._id) + '"><div class="today-row-top"><strong>' + formatTime(item.time) + '</strong>' + badge(item.status) + '</div><p>' + escapeHtml(item.Trajtimi) + '</p></a>'; }).join('') + '</div>' : emptyState('clock', 'Nothing scheduled today', 'Your day is open.', '');
    return '<div><div class="page-header"><div><p class="eyebrow">Your schedule</p><h2 class="page-title">Calendar</h2><p class="page-description">A clear view of the appointments already in your account.</p></div>' + button('New appointment', 'button', 'route-new', { icon: 'plus' }) + '</div><div class="calendar-layout"><section class="card calendar-card"><div class="calendar-toolbar"><div><h3>' + new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(month) + '</h3><p>' + monthAppointments.length + ' appointment' + (monthAppointments.length === 1 ? '' : 's') + ' this month</p></div><div class="calendar-controls"><button class="icon-button" data-action="previous-month" aria-label="Previous month">' + icon('chevronLeft', 17) + '</button><button class="icon-button" data-action="next-month" aria-label="Next month">' + icon('chevronRight', 17) + '</button></div></div><div class="calendar-scroll"><div class="weekday-row">' + ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(function (day) { return '<span>' + day + '</span>'; }).join('') + '</div><div class="calendar-grid">' + calendarCells + '</div></div></section><section class="card today-card"><div class="card-header"><div><h3 class="card-title">Today</h3><p class="card-subtitle">' + formatDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric' }) + '</p></div></div>' + todayHtml + '</section></div></div>';
  }

  function settingsPage() {
    var user = state.user || {}; var message = state.settingsMessage; var error = state.settingsError;
    return '<div class="settings-page">' + pageHeader('Personal workspace', 'Account settings', 'Keep your profile details current across your Booking System account.') + '<div class="settings-layout"><section class="card profile-card">' + avatar(user, true) + '<div><h3>Profile</h3><p>Your identity and contact details.</p></div><p class="profile-card-note">Only fields supported by the existing user endpoint are shown here.</p></section><div class="settings-stack"><section class="card form-card"><div class="form-heading"><span class="form-heading-icon">' + icon('user', 18) + '</span><div><h3>Profile details</h3><p>These details are connected to your user record.</p></div></div><form id="settings-form"><div class="form-grid">' + field('Full name', 'fullName', 'text', user.fullName, '', true, { full: true }) + field('Email address', 'email', 'email', user.email, '', true) + field('Age', 'age', 'number', user.age, '', true, { min: 0 }) + field('Location', 'location', 'text', user.location, 'City or region', false, { full: true }) + field('Avatar URL', 'Image', 'url', user.Image, 'https://...', false, { full: true }) + '<p class="form-hint" style="grid-column:1/-1;margin-top:-10px">Optional. The backend stores this as the user image field.</p></div>' + (message ? '<p class="success-message" style="margin-top:18px">' + icon('check', 14) + escapeHtml(message) + '</p>' : '') + (error ? '<p class="error-message" style="margin-top:18px">' + icon('alert', 14) + escapeHtml(error) + '</p>' : '') + '<div class="form-actions"><button class="button button-primary" type="submit">' + icon('check', 15) + ' Save changes</button></div></form></section><section class="card security-note"><span class="security-note-icon">' + icon('shield', 17) + '</span><div><h3>Security note</h3><p>Password changes and notifications are not exposed by the current backend, so they are intentionally not presented as editable settings.</p></div></section></div></div></div>';
  }

  function loadingPage(active) { return appShell(active, '<div class="page-header"><div><p class="eyebrow">Workspace</p><h2 class="page-title">Loading your workspace</h2></div></div><section class="card">' + loadingBlock() + '</section>'); }

  function renderProtected(r) {
    if (!state.appointmentsLoaded && !state.appointmentsError) { app.innerHTML = loadingPage(r.page === 'settings' ? 'settings' : r.page); ensureAppointments(); return; }
    var content = '';
    if (r.page === 'appointments' && r.id === 'new' && !r.action) content = appointmentForm('', false);
    else if (r.page === 'appointments' && r.id && r.action === 'edit') {
      if (!state.detail || state.detail.id !== r.id) { app.innerHTML = loadingPage('appointments'); ensureDetail(r.id); return; }
      content = appointmentForm(r.id, true);
    } else if (r.page === 'appointments' && r.id) { content = detailPage(r.id); if (!state.detail || state.detail.id !== r.id) ensureDetail(r.id); }
    else if (r.page === 'calendar') content = calendarPage();
    else if (r.page === 'settings') content = settingsPage();
    else if (r.page === 'appointments') content = state.appointmentsError ? errorState(state.appointmentsError) : appointmentsPage();
    else content = state.appointmentsError ? errorState(state.appointmentsError) : dashboardPage();
    app.innerHTML = appShell(r.page === 'settings' ? 'settings' : r.page === 'calendar' ? 'calendar' : r.page === 'appointments' ? 'appointments' : 'dashboard', content);
  }

  function authBrand() { return '<div class="mobile-brand"><span class="brand-mark">' + icon('sparkles', 17) + '</span><span>Bookwise</span></div>'; }
  function authVisual() { return '<section class="auth-visual"><div class="auth-brand"><span class="brand-mark">' + icon('sparkles', 17) + '</span><span>Bookwise</span></div><div class="auth-copy"><p class="eyebrow">Your time, well managed</p><h1>Make every appointment feel effortless.</h1><p>A calm, focused workspace for keeping your schedule, appointments, and client moments in sync.</p><div class="auth-metrics"><div class="auth-metric"><strong>01</strong><span>One clear view</span></div><div class="auth-metric"><strong>24/7</strong><span>Always in reach</span></div><div class="auth-metric"><strong>Less</strong><span>Admin overhead</span></div></div></div><p class="auth-footer">A focused scheduling space for modern teams.</p></section>'; }

  function renderLogin() {
    app.innerHTML = '<div class="auth-shell">' + authVisual() + '<section class="auth-form-side"><div class="auth-form">' + authBrand() + '<span class="auth-form-icon">' + icon('shield', 20) + '</span><h2>Welcome back</h2><p class="auth-form-intro">Sign in to pick up where you left off.</p><form id="login-form" class="auth-form-fields"><label class="form-group"><span class="form-label">Email address</span><input class="field" name="email" type="email" autocomplete="email" placeholder="you@company.com" required></label><label class="form-group"><span class="form-label">Password</span><div class="password-wrap"><input class="field" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required><button type="button" class="password-toggle" data-action="toggle-password" aria-label="Show password">' + icon('eye', 15) + '</button></div></label>' + (state.authError ? '<p class="error-message">' + icon('alert', 14) + escapeHtml(state.authError) + '</p>' : '') + (state.authSuccess ? '<p class="success-message">' + icon('check', 14) + escapeHtml(state.authSuccess) + '</p>' : '') + '<button class="button button-primary auth-submit" type="submit">' + icon('arrow', 15) + ' Sign in</button></form><p class="auth-bottom">New to Bookwise? <a class="auth-link" href="#register">Create an account</a></p><p class="auth-note">Your account is secured by the existing Booking System API.</p></div></section></div>';
  }

  function renderRegister() {
    app.innerHTML = '<div class="auth-shell"><section class="auth-visual"><div class="auth-brand"><span class="brand-mark">' + icon('sparkles', 17) + '</span><span>Bookwise</span></div><div class="auth-copy"><p class="eyebrow">A better rhythm</p><h1>Your schedule deserves a little more clarity.</h1><p>Create your workspace and keep your appointments close, organized, and easy to act on.</p></div><p class="auth-footer">Already have an account? <a href="#login">Sign in</a></p></section><section class="auth-form-side"><div class="auth-form">' + authBrand() + '<a class="back-link" href="#login">' + icon('arrowLeft', 15) + ' Back to sign in</a><h2>Create your account</h2><p class="auth-form-intro">A few details and your workspace is ready.</p><form id="register-form" class="auth-form-fields"><label class="form-group"><span class="form-label">Full name</span><input class="field" name="fullName" placeholder="Alex Morgan" required></label><div class="form-grid"><label class="form-group"><span class="form-label">Age</span><input class="field" name="age" type="number" min="0" placeholder="28" required></label><label class="form-group"><span class="form-label">Location</span><input class="field" name="location" placeholder="Beirut"></label></div><label class="form-group"><span class="form-label">Email address</span><input class="field" name="email" type="email" placeholder="you@company.com" required></label><label class="form-group"><span class="form-label">Password</span><input class="field" name="password" type="password" minlength="6" placeholder="At least 6 characters" required></label>' + (state.authError ? '<p class="error-message">' + icon('alert', 14) + escapeHtml(state.authError) + '</p>' : '') + '<button class="button button-primary auth-submit" type="submit">' + icon('arrow', 15) + ' Create account</button></form><p class="auth-note">By creating an account, you’ll use the existing Booking System authentication service.</p></div></section></div>';
  }

  function renderApp() {
    var r = route();
    if (!token) { if (r.page === 'register') renderRegister(); else renderLogin(); return; }
    if (r.page === 'login' || r.page === 'register') { location.hash = '#dashboard'; return; }
    renderProtected(r);
  }

  function showToast(message, type) {
    var toast = document.createElement('div'); toast.className = 'toast ' + (type || 'success'); toast.innerHTML = '<span class="toast-icon">' + icon(type === 'error' ? 'alert' : 'check', 14) + '</span><span>' + escapeHtml(message) + '</span>';
    toastRegion.appendChild(toast); setTimeout(function () { toast.remove(); }, 3600);
  }

  function formDataObject(form) { return Object.fromEntries(new FormData(form).entries()); }

  async function submitLogin(form) {
    var data = formDataObject(form); state.authError = ''; var submit = form.querySelector('[type="submit"]'); submit.classList.add('loading'); submit.disabled = true; submit.innerHTML = icon('loader', 15) + ' Signing in';
    try { var response = await api.login({ email: data.email, password: data.password }); saveSession(response.accessToken, response.user); state.appointmentsLoaded = false; state.authSuccess = ''; location.hash = '#dashboard'; }
    catch (error) { state.authError = error.message || 'We could not sign you in.'; renderApp(); }
  }

  async function submitRegister(form) {
    var data = formDataObject(form); state.authError = ''; var submit = form.querySelector('[type="submit"]'); submit.classList.add('loading'); submit.disabled = true; submit.innerHTML = icon('loader', 15) + ' Creating account';
    try { await api.register({ fullName: data.fullName, age: Number(data.age), email: data.email, password: data.password, location: data.location }); state.authSuccess = 'Account created. Sign in to continue.'; state.authError = ''; location.hash = '#login'; renderApp(); }
    catch (error) { state.authError = error.message || 'We could not create your account.'; renderApp(); }
  }

  async function submitAppointment(form) {
    var data = formDataObject(form); state.formError = ''; var submit = form.querySelector('[type="submit"]'); submit.classList.add('loading'); submit.disabled = true; submit.innerHTML = icon('loader', 15) + ' Saving';
    var payload = { Trajtimi: data.Trajtimi, date: data.date, time: data.time, status: data.status };
    try { var response = form.dataset.editing === 'true' ? await api.updateAppointment(form.dataset.id, payload) : await api.createAppointment(payload); state.appointmentsLoaded = false; state.detail = null; state.formError = ''; showToast(form.dataset.editing === 'true' ? 'Appointment updated.' : 'Appointment created.'); location.hash = '#appointments/' + encodeURIComponent(response._id); }
    catch (error) { state.formError = error.message || 'Could not save this appointment.'; renderApp(); }
  }

  async function submitSettings(form) {
    var data = formDataObject(form); state.settingsError = ''; state.settingsMessage = ''; var submit = form.querySelector('[type="submit"]'); submit.classList.add('loading'); submit.disabled = true; submit.innerHTML = icon('loader', 15) + ' Saving';
    try { var updated = await api.updateUser(state.user._id, { fullName: data.fullName, age: Number(data.age), email: data.email, location: data.location, Image: data.Image }); state.user = cleanUser(updated); localStorage.setItem('booking_user', JSON.stringify(state.user)); state.settingsMessage = 'Your profile has been updated.'; renderApp(); }
    catch (error) { state.settingsError = error.message || 'Could not update your profile.'; renderApp(); }
  }

  async function submitPayment(form, id) {
    var data = formDataObject(form); var submit = form.querySelector('[type="submit"]'); submit.classList.add('loading'); submit.disabled = true;
    try { var payment = await api.createPayment(id, { amount: Number(data.amount), status: data.paymentStatus }); state.detail.payment = payment; showToast('Payment recorded.'); renderApp(); }
    catch (error) { showToast(error.message || 'Could not record payment.', 'error'); submit.disabled = false; submit.classList.remove('loading'); }
  }

  async function submitFeedback(form, id) {
    var data = formDataObject(form); var submit = form.querySelector('[type="submit"]'); submit.classList.add('loading'); submit.disabled = true;
    try { var feedback = await api.createFeedback(id, { comment: data.comment, rating: Number(data.rating), language: 'English', needToImprove: 'Everything is good' }); state.detail.feedback = feedback; showToast('Feedback saved.'); renderApp(); }
    catch (error) { showToast(error.message || 'Could not save feedback.', 'error'); submit.disabled = false; submit.classList.remove('loading'); }
  }

  async function updateStatus(id, status) {
    try { var item = await api.updateAppointment(id, { status: status }); state.appointments = state.appointments.map(function (appointment) { return appointment._id === id ? item : appointment; }); if (state.detail) state.detail.appointment = item; showToast('Appointment marked ' + status.toLowerCase() + '.'); renderApp(); }
    catch (error) { state.formError = error.message || 'Could not update the appointment.'; renderApp(); }
  }

  async function deleteCurrentAppointment(id) {
    if (!window.confirm('Delete this appointment? This action cannot be undone.')) return;
    try { await api.deleteAppointment(id); state.appointments = state.appointments.filter(function (item) { return item._id !== id; }); state.appointmentsLoaded = true; showToast('Appointment deleted.'); location.hash = '#appointments'; }
    catch (error) { state.formError = error.message || 'Could not delete this appointment.'; renderApp(); }
  }

  document.addEventListener('click', function (event) {
    var target = event.target.closest('[data-action]');
    if (!target) return;
    var action = target.dataset.action;
    if (action === 'open-menu') { document.getElementById('sidebar').classList.add('open'); document.body.classList.add('menu-open'); }
    if (action === 'close-menu') { var sidebar = document.getElementById('sidebar'); if (sidebar) sidebar.classList.remove('open'); document.body.classList.remove('menu-open'); }
    if (action === 'logout') { clearSession(); location.hash = '#login'; renderApp(); }
    if (action === 'route-new') location.hash = '#appointments/new';
    if (action === 'retry') { state.appointmentsLoaded = false; state.appointmentsError = ''; state.detail = null; renderApp(); }
    if (action === 'reset-filters') { state.filters = { search: '', status: 'all', date: '' }; renderApp(); }
    if (action === 'previous-month') { state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1); renderApp(); }
    if (action === 'next-month') { state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1); renderApp(); }
    if (action === 'status-update') { var r = route(); if (r.id) updateStatus(r.id, target.dataset.status); }
    if (action === 'delete-appointment') { var routeData = route(); if (routeData.id) deleteCurrentAppointment(routeData.id); }
    if (action === 'toggle-password') { var input = target.parentElement.querySelector('input'); input.type = input.type === 'password' ? 'text' : 'password'; target.innerHTML = icon(input.type === 'password' ? 'eye' : 'eyeOff', 15); }
  });

  document.addEventListener('click', function (event) {
    var routeTarget = event.target.closest('[data-route]');
    if (routeTarget) { var sidebar = document.getElementById('sidebar'); if (sidebar) sidebar.classList.remove('open'); }
  });

  document.addEventListener('submit', function (event) {
    if (event.target.id === 'login-form') { event.preventDefault(); submitLogin(event.target); }
    if (event.target.id === 'register-form') { event.preventDefault(); submitRegister(event.target); }
    if (event.target.id === 'appointment-form') { event.preventDefault(); submitAppointment(event.target); }
    if (event.target.id === 'settings-form') { event.preventDefault(); submitSettings(event.target); }
    if (event.target.id === 'payment-form') { event.preventDefault(); var detailRoute = route(); submitPayment(event.target, detailRoute.id); }
    if (event.target.id === 'feedback-form') { event.preventDefault(); var feedbackRoute = route(); submitFeedback(event.target, feedbackRoute.id); }
  });

  document.addEventListener('change', function (event) {
    if (event.target.id === 'status-filter') { state.filters.status = event.target.value; renderApp(); }
    if (event.target.id === 'date-filter') { state.filters.date = event.target.value; renderApp(); }
  });
  var searchTimer;
  document.addEventListener('input', function (event) {
    if (event.target.id === 'search-filter') { state.filters.search = event.target.value; clearTimeout(searchTimer); searchTimer = setTimeout(renderApp, 150); }
  });

  window.addEventListener('hashchange', function () { state.formError = ''; state.authError = ''; renderApp(); });
  window.addEventListener('load', function () { renderApp(); });
})();
