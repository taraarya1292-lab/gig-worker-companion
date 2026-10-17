import { describe, expect, it } from "vitest";
import { demoEarnings } from "./demo";
import { hourlyFromTotals, hourlyOf, netOf, totalsOf } from "./money";

describe("pay math", () => {
  it("keeps the sample ₹500 deduction story consistent", () => {
    const [today, yesterday, before] = demoEarnings();

    expect(netOf(today)).toBe(330);
    expect(hourlyOf(today)).toBe(55);
    expect(netOf(yesterday)).toBe(820);
    expect(hourlyOf(yesterday)).toBe(164);
    expect(netOf(before)).toBe(840);

    const totals = totalsOf(demoEarnings());
    expect(totals).toMatchObject({
      gross: 2700,
      expense: 210,
      deduction: 500,
      net: 1990,
      hours: 17,
    });
    expect(hourlyFromTotals(totals.hours, totals.net)).toBe(117);
  });

  it("returns no hourly rate when hours are missing", () => {
    expect(hourlyOf({ id: "a", date: "2026-10-17", amount: 100, expense: 0, deduction: 0, hours: 0, note: "" })).toBeNull();
    expect(hourlyFromTotals(0, 100)).toBeNull();
  });

  it("ignores a missing or bad expense instead of inventing one", () => {
    const totals = totalsOf([
      {
        id: "a",
        date: "2026-10-17",
        amount: 100,
        expense: undefined as unknown as number,
        deduction: undefined as unknown as number,
        hours: 1,
        note: "",
      },
    ]);
    expect(totals.expense).toBe(0);
    expect(totals.net).toBe(100);
  });
});
