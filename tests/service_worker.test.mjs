import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

async function dispatchNavigation({ online }) {
  const listeners = new Map();
  const putKeys = [];
  const matchKeys = [];
  const request = {
    method: 'GET',
    mode: 'navigate',
    url: 'https://example.test/deadlines.html',
  };
  const onlineResponse = {
    kind: 'network-deadlines',
    ok: true,
    clone() { return { ...this }; },
  };
  const cachedDeadlineResponse = { kind: 'cached-deadlines', ok: true };
  const cachedMainResponse = { kind: 'cached-main', ok: true };
  const caches = {
    async open() {
      return {
        async put(key) { putKeys.push(key); },
      };
    },
    async match(key) {
      matchKeys.push(key);
      if (key === request) return cachedDeadlineResponse;
      if (key === './') return cachedMainResponse;
      return undefined;
    },
    async keys() { return []; },
  };
  const context = {
    URL,
    Promise,
    caches,
    fetch: online
      ? async () => onlineResponse
      : async () => { throw new Error('offline'); },
    location: { origin: 'https://example.test' },
    self: {
      addEventListener(type, handler) { listeners.set(type, handler); },
      skipWaiting() {},
      clients: { claim() {} },
    },
  };

  vm.runInNewContext(source, context, { filename: 'sw.js' });
  let responsePromise;
  listeners.get('fetch')({
    request,
    respondWith(value) { responsePromise = Promise.resolve(value); },
  });
  const response = await responsePromise;
  await Promise.resolve();
  await Promise.resolve();
  return { request, response, putKeys, matchKeys };
}

test('online deadline navigation is cached under its own request URL', async () => {
  const { request, response, putKeys } = await dispatchNavigation({ online: true });

  assert.equal(response.kind, 'network-deadlines');
  assert.equal(putKeys.length, 1);
  assert.equal(putKeys[0], request);
});

test('offline deadline navigation reads its own cached response first', async () => {
  const { request, response, matchKeys } = await dispatchNavigation({ online: false });

  assert.equal(matchKeys[0], request);
  assert.equal(response.kind, 'cached-deadlines');
});
