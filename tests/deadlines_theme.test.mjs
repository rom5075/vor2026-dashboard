import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../deadlines.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const source = scripts.at(-1)?.[1];

function runPageScript(savedTheme) {
  const attributes = new Map();
  const listeners = new Map();
  const stored = new Map([['vor_theme', savedTheme]]);
  const root = {
    setAttribute(name, value) { attributes.set(name, String(value)); },
    removeAttribute(name) { attributes.delete(name); },
    toggleAttribute(name, force) {
      if (force) attributes.set(name, '');
      else attributes.delete(name);
    },
    hasAttribute(name) { return attributes.has(name); },
    getAttribute(name) { return attributes.get(name) ?? null; },
  };
  const themeBtn = {
    textContent: '',
    setAttribute() {},
    addEventListener(type, handler) { listeners.set(type, handler); },
  };
  const themeMeta = { setAttribute() {} };
  const windowObject = {
    matchMedia: () => ({ matches: false }),
    addEventListener() {},
  };
  const context = {
    document: {
      documentElement: root,
      getElementById: () => themeBtn,
      querySelector: () => themeMeta,
    },
    localStorage: {
      getItem: key => stored.get(key) ?? null,
      setItem: (key, value) => stored.set(key, value),
    },
    navigator: {},
    location: { protocol: 'file:' },
    window: windowObject,
  };

  vm.runInNewContext(source, context, { filename: 'deadlines-inline.js' });
  return { root, themeBtn, listeners, stored };
}

test('saved dark theme activates the dark CSS selector', () => {
  assert.ok(source, 'deadline page must include an inline script');
  const { root, themeBtn } = runPageScript('dark');

  assert.equal(root.getAttribute('data-theme'), 'dark');
  assert.equal(themeBtn.textContent, 'Светлая тема');
});
