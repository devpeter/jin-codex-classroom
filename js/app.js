/* Peter的codex建站小课堂 - 交互逻辑 */

const STORAGE_KEY = 'peter-codex-classroom-form-data';

function toast(msg, ms = 2200) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), ms);
}

function copyText(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const text = el.innerText.replace(/\s*复制\s*$/, '').trim();
  navigator.clipboard.writeText(text).then(() => toast('已复制到剪贴板')).catch(() => toast('复制失败'));
}

function copyPageText(btn) {
  const panel = btn.closest('.content-panel');
  const text = panel ? panel.innerText : '';
  navigator.clipboard.writeText(text).then(() => toast('本页内容已复制')).catch(() => toast('复制失败'));
}

function loadFormData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function saveFormData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function collectFormFields(root = document) {
  const data = loadFormData();
  root.querySelectorAll('[data-key]').forEach(el => { data[el.dataset.key] = el.value; });
  saveFormData(data);
  return data;
}

function restoreFormFields() {
  const data = loadFormData();
  document.querySelectorAll('[data-key]').forEach(el => {
    if (data[el.dataset.key] != null) el.value = data[el.dataset.key];
  });
}

function clearFormKeys(selector) {
  const data = loadFormData();
  document.querySelectorAll(`${selector} [data-key]`).forEach(el => {
    el.value = '';
    delete data[el.dataset.key];
  });
  saveFormData(data);
}

document.addEventListener('input', (e) => {
  if (e.target.matches('[data-key]')) {
    collectFormFields();
    const badge = document.getElementById('saveStatus');
    if (badge) {
      const label = badge.querySelector('span:last-child');
      if (label) {
        label.textContent = '已自动保存';
        clearTimeout(badge._timer);
        badge._timer = setTimeout(() => { label.textContent = '已启用本地保存'; }, 1500);
      }
    }
  }
});

function showPanel(pageId, pushHash = true) {
  document.querySelectorAll('.content-panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('panel-' + pageId) || document.getElementById('panel-home');
  if (target) target.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId);
  });
  const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (activeNav) {
    const group = activeNav.closest('.nav-group');
    if (group) group.classList.add('open');
  }
  document.getElementById('sidebar')?.classList.remove('open');
  window.scrollTo(0, 0);
  if (pushHash) {
    const hash = pageId === 'home' ? '' : '#' + pageId;
    if (location.hash !== hash) history.replaceState(null, '', hash || location.pathname);
  }
}

function pageFromHash() {
  return (location.hash || '').replace(/^#/, '') || 'home';
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-page]');
  if (link) { e.preventDefault(); showPanel(link.dataset.page); }
});

window.addEventListener('hashchange', () => showPanel(pageFromHash(), false));

document.querySelectorAll('.nav-group-header').forEach(header => {
  header.addEventListener('click', () => header.parentElement.classList.toggle('open'));
});

document.getElementById('menuToggle')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

document.querySelectorAll('.section-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.section-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const section = tab.dataset.section;
    if (section === 'prep') {
      document.querySelector('.nav-group[data-group="prep"]')?.classList.add('open');
      document.querySelector('.nav-group[data-group="practice"]')?.classList.remove('open');
    } else {
      document.querySelector('.nav-group[data-group="practice"]')?.classList.add('open');
      document.querySelector('.nav-group[data-group="prep"]')?.classList.remove('open');
      showPanel('prac-01');
    }
  });
});

document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.tool-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('form-' + card.dataset.tool);
    if (panel) panel.classList.add('active');
  });
});

document.querySelectorAll('#infoTabs .form-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#infoTabs .form-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const name = tab.dataset.tab;
    document.querySelectorAll('#form-info .form-tab-panel').forEach(p => {
      p.classList.toggle('active', p.dataset.tabPanel === name);
    });
  });
});

document.getElementById('btnClear')?.addEventListener('click', () => {
  if (!confirm('确定清空「外贸独立站信息填写表」的全部内容？')) return;
  clearFormKeys('#form-info');
  toast('已清空');
});

document.querySelectorAll('[data-action="clear-seo"]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!confirm('确定清空 SEO 表？')) return;
    clearFormKeys('#form-seo');
    toast('已清空');
  });
});

document.querySelectorAll('[data-action="clear-fw"]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!confirm('确定清空框架表？')) return;
    clearFormKeys('#form-framework');
    toast('已清空');
  });
});

function formToMarkdown(selector, title) {
  const lines = [`# ${title}`, '', `导出时间：${new Date().toLocaleString('zh-CN')}`, ''];
  document.querySelectorAll(`${selector} [data-key]`).forEach(el => {
    const labelEl = el.closest('.field')?.querySelector('.field-label');
    let label = el.dataset.key;
    if (labelEl) {
      label = Array.from(labelEl.childNodes).filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent.trim()).join(' ').trim() || el.dataset.key;
    }
    lines.push(`## ${label}`);
    lines.push((el.value || '').trim() || '（空）');
    lines.push('');
  });
  return lines.join('\n');
}

document.getElementById('btnCopyMd')?.addEventListener('click', () => {
  navigator.clipboard.writeText(formToMarkdown('#form-info', '外贸独立站信息填写表')).then(() => toast('Markdown 已复制')).catch(() => toast('复制失败'));
});
document.querySelectorAll('[data-action="copy-seo"]').forEach(btn => {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(formToMarkdown('#form-seo', 'SEO 关键词规划表')).then(() => toast('Markdown 已复制')).catch(() => toast('复制失败'));
  });
});
document.querySelectorAll('[data-action="copy-fw"]').forEach(btn => {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(formToMarkdown('#form-framework', '网站框架与 SEO 执行表')).then(() => toast('Markdown 已复制')).catch(() => toast('复制失败'));
  });
});

function formToSheet(selector, sheetName) {
  const rows = [['字段', '内容']];
  document.querySelectorAll(`${selector} [data-key]`).forEach(el => {
    const labelEl = el.closest('.field')?.querySelector('.field-label');
    let label = el.dataset.key;
    if (labelEl) {
      label = Array.from(labelEl.childNodes).filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent.trim()).join(' ').trim() || el.dataset.key;
    }
    rows.push([label, el.value || '']);
  });
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 28 }, { wch: 60 }];
  return { name: sheetName, ws };
}

function downloadWorkbook(sheets, filename) {
  if (typeof XLSX === 'undefined') { toast('Excel 库未加载，请检查网络'); return; }
  const wb = XLSX.utils.book_new();
  sheets.forEach(({ name, ws }) => XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31)));
  XLSX.writeFile(wb, filename);
}

document.getElementById('btnExportXlsx')?.addEventListener('click', () => {
  downloadWorkbook([formToSheet('#form-info', '建站信息')], '外贸独立站信息填写表.xlsx');
  toast('Excel 已下载');
});
document.querySelectorAll('[data-action="export-seo"]').forEach(btn => {
  btn.addEventListener('click', () => {
    downloadWorkbook([formToSheet('#form-seo', 'SEO规划')], 'SEO关键词规划表.xlsx');
    toast('Excel 已下载');
  });
});
document.querySelectorAll('[data-action="export-fw"]').forEach(btn => {
  btn.addEventListener('click', () => {
    downloadWorkbook([formToSheet('#form-framework', '网站框架')], '网站框架与SEO执行表.xlsx');
    toast('Excel 已下载');
  });
});

const SEARCH_ITEMS = [
  { title: '建站资料整理标准', path: '准备部分 / 01', page: 'prep-01' },
  { title: '使用标准 md 模板整理建站资料', path: '准备部分 / 02', page: 'prep-02' },
  { title: '第一轮：用 GPT 完成 SEO 关键词规划表', path: '准备部分 / 03', page: 'prep-03' },
  { title: '公司画册处理流程', path: '准备部分 / 04', page: 'prep-04' },
  { title: '第二轮：用 GPT 完成网站框架与 SEO 执行表', path: '准备部分 / 05', page: 'prep-05' },
  { title: '各类资料转换与素材补齐', path: '准备部分 / 06', page: 'prep-06' },
  { title: '判断能否进入首页 MVP', path: '准备部分 / 07', page: 'prep-07' },
  { title: '检查 ICP 是否足以驱动建站', path: '准备部分 / 08', page: 'prep-08' },
  { title: '基于证据建立 ICP 与反 ICP', path: '准备部分 / 09', page: 'prep-09' },
  { title: '从客户需求到 SERP 与关键词—页面地图', path: '准备部分 / 10', page: 'prep-10' },
  { title: '规划信息架构与内容模型', path: '准备部分 / 11', page: 'prep-11' },
  { title: '生成定位方案与 Message House', path: '准备部分 / 12', page: 'prep-12' },
  { title: '建立主张与证据登记表', path: '准备部分 / 13', page: 'prep-13' },
  { title: '开工资料确认', path: '实操部分 / 01', page: 'prac-01' },
  { title: '网站架构规划', path: '实操部分 / 02', page: 'prac-02' },
  { title: '视觉与体验定稿', path: '实操部分 / 03', page: 'prac-03' },
  { title: '首页 MVP', path: '实操部分 / 04', page: 'prac-04' },
  { title: '全站导航与超级菜单', path: '实操部分 / 05', page: 'prac-05' },
  { title: '关于我们与信任内容', path: '实操部分 / 06', page: 'prac-06' },
  { title: '产品体系与产品单页', path: '实操部分 / 07', page: 'prac-07' },
  { title: '联系页面与询盘表单', path: '实操部分 / 08', page: 'prac-08' },
  { title: '应用场景页面', path: '实操部分 / 09', page: 'prac-09' },
  { title: '客户案例与项目页面', path: '实操部分 / 10', page: 'prac-10' },
  { title: '网站页面补齐', path: '实操部分 / 11', page: 'prac-11' },
  { title: '图片素材与功能完善', path: '实操部分 / 12', page: 'prac-12' },
  { title: '整站 SEO 与体验验收', path: '实操部分 / 13', page: 'prac-13' },
  { title: '修改、回档与本地交付', path: '实操部分 / 14', page: 'prac-14' },
  { title: '外贸独立站信息填写表', path: '课前填写工作台', page: 'home' },
  { title: 'SEO 关键词规划表', path: '课前填写工作台', page: 'home' },
  { title: '网站框架与 SEO 执行表', path: '课前填写工作台', page: 'home' },
];

const searchOverlay = document.getElementById('searchOverlay');
const searchModalInput = document.getElementById('searchModalInput');
const searchResults = document.getElementById('searchResults');

function openSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.add('open');
  searchModalInput.value = '';
  renderSearchResults('');
  setTimeout(() => searchModalInput.focus(), 50);
}
function closeSearch() { searchOverlay?.classList.remove('open'); }
function renderSearchResults(q) {
  const query = q.trim().toLowerCase();
  const list = query
    ? SEARCH_ITEMS.filter(i => i.title.toLowerCase().includes(query) || i.path.toLowerCase().includes(query))
    : SEARCH_ITEMS;
  searchResults.innerHTML = list.slice(0, 12).map((item, idx) => `
    <div class="search-result-item ${idx === 0 ? 'active' : ''}" data-page="${item.page}">
      <div>${item.title}</div>
      <div class="path">${item.path}</div>
    </div>`).join('') || '<div style="padding:16px;color:#999;">无匹配结果</div>';
}

document.getElementById('searchInput')?.addEventListener('click', openSearch);
document.getElementById('searchInput')?.addEventListener('focus', openSearch);
searchModalInput?.addEventListener('input', (e) => renderSearchResults(e.target.value));
searchModalInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const first = searchResults?.querySelector('.search-result-item');
    if (first) { closeSearch(); showPanel(first.dataset.page); }
  }
});
searchResults?.addEventListener('click', (e) => {
  const item = e.target.closest('.search-result-item');
  if (item) { closeSearch(); showPanel(item.dataset.page); }
});
searchOverlay?.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  if (e.key === 'Escape') closeSearch();
});

function initApp() {
  restoreFormFields();
  showPanel(pageFromHash(), false);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp);
else initApp();
