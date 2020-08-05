import { assertEquals, assertNotEquals } from "https://deno.land/std@0.63.0/testing/asserts.ts";

// @ts-ignore
Deno.test("short example test", () => {
  assertEquals("deno", "deno");
  assertNotEquals({
    runtime: 'deno'
  }, {
    runtime: 'node'
  });
});


Deno.test({
  name: 'ops leak',
  sanitizeOps: false,

  fn() {
    setTimeout(console.log, 1000);
  }
});

Deno.test({
  name: 'ops leak resource',
  sanitizeResources: false,

  async fn() {
    await Deno.open('./models/planets.ts')
  }
});
