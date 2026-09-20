/**
 * Send a B2B invoice to a partner (hotel, tourism board, brand) for a
 * placement, campaign or content deal.
 *
 * Stripe hosts the payment page and sends the emails, so this does not touch
 * the website at all: no route, no CSP change, no Worker dependency. That is
 * why it lives here rather than in app/ -- see package.json.
 *
 *   export STRIPE_RESTRICTED_KEY=rk_test_...
 *   bun invoice.mjs --name "Hotel Azur" --to billing@hotelazur.com \
 *     --item "Homepage placement, October 2026:1500" \
 *     --item "Destination feature, Marrakech:450"
 *
 * Nothing is created until you pass --send. Without it you get a priced
 * preview and no API writes at all.
 *
 * SAFETY: a live key (rk_live_/sk_live_) is refused unless you also pass
 * --live. Test and live keys differ by four characters in the middle of a
 * long opaque string, which is not a difference you can rely on noticing at
 * the moment you hit enter on a real invoice to a real customer.
 */

import Stripe from "stripe";
import process from "node:process";

// Pinned, not floating. An invoice is a financial document: it should be
// built by the API shape this script was tested against, and move to a newer
// one deliberately.
const API_VERSION = "2026-07-29.dahlia";

// The site prices in EUR (app/src/lib/prices.server.ts DEFAULT_CURRENCY), so
// partner invoices follow it unless told otherwise.
const DEFAULT_CURRENCY = "eur";

// Net 30. Standard B2B terms, and the reason collection_method is
// send_invoice rather than charge_automatically -- a partner being billed for
// a placement has no card on file and should not be asked for one.
const DEFAULT_DUE_DAYS = 30;

function parseArgs(argv) {
  const out = { items: [], dryRun: true, live: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const next = () => {
      const v = argv[i + 1];
      if (v === undefined || v.startsWith("--")) fail(`${a} needs a value`);
      i += 1;
      return v;
    };
    if (a === "--name") out.name = next();
    else if (a === "--to") out.to = next();
    else if (a === "--item") out.items.push(next());
    else if (a === "--currency") out.currency = next().toLowerCase();
    else if (a === "--due") out.dueDays = Number(next());
    else if (a === "--memo") out.memo = next();
    else if (a === "--po") out.po = next();
    else if (a === "--send") out.dryRun = false;
    else if (a === "--live") out.live = true;
    else if (a === "--help" || a === "-h") out.help = true;
    else fail(`unknown argument: ${a}`);
  }
  return out;
}

function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

/**
 * "Homepage placement, October 2026:1500" -> { description, amount: 150000 }
 *
 * Split on the LAST colon so a description may contain one, which they do:
 * "Placement: October" is a natural thing to type.
 *
 * Amounts are given in whole currency units and converted to minor units.
 * Parsed from the string rather than via parseFloat*100 so that 1500.10 does
 * not land on 150009 -- binary floating point cannot represent .10, and an
 * invoice that is one cent light is a real and embarrassing thing to send.
 */
function parseItem(raw) {
  const cut = raw.lastIndexOf(":");
  if (cut < 1) fail(`--item needs "Description:amount", got: ${raw}`);
  const description = raw.slice(0, cut).trim();
  const amountText = raw.slice(cut + 1).trim().replace(/,/g, "");
  if (!description) fail(`--item has an empty description: ${raw}`);
  if (!/^\d+(\.\d{1,2})?$/.test(amountText)) {
    fail(`--item amount must be a positive number with up to 2 decimals, got: ${amountText}`);
  }
  const [whole, frac = ""] = amountText.split(".");
  const minor = Number(whole) * 100 + Number(frac.padEnd(2, "0"));
  if (minor <= 0) fail(`--item amount must be greater than zero: ${raw}`);
  return { description, amount: minor };
}

function money(minor, currency) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(minor / 100);
}

const HELP = `
Send a B2B partner invoice through Stripe.

  --name      <string>   Partner/company name              (required)
  --to        <email>    Billing email                     (required)
  --item      <desc:amt> Line item, repeatable             (at least one)
  --currency  <code>     Default: ${DEFAULT_CURRENCY}
  --due       <days>     Payment terms. Default: ${DEFAULT_DUE_DAYS}
  --memo      <string>   Note shown on the invoice
  --po        <string>   Partner's PO / reference
  --send                 Actually create and send it (default: preview only)
  --live                 Permit a live-mode key

Key is read from STRIPE_RESTRICTED_KEY, or STRIPE_SECRET_KEY as a fallback.
Prefer a restricted key with write access to Customers and Invoices only.
`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(HELP);
    return;
  }

  const key = process.env.STRIPE_RESTRICTED_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) {
    fail(
      "no API key. Set STRIPE_RESTRICTED_KEY (preferred) or STRIPE_SECRET_KEY.\n" +
        "       Create a restricted key at https://dashboard.stripe.com/apikeys\n" +
        "       with write access to Customers and Invoices, nothing else.",
    );
  }
  if (/^[sr]k_live_/.test(key) && !args.live) {
    fail(
      "that is a LIVE key and would bill a real partner for real money.\n" +
        "       Re-run with --live if you mean it, or export a test key instead.",
    );
  }

  if (!args.name) fail("--name is required");
  if (!args.to) fail("--to is required");
  if (!args.to.includes("@")) fail(`--to does not look like an email: ${args.to}`);
  if (args.items.length === 0) fail("at least one --item is required");
  if (args.dueDays !== undefined && (!Number.isInteger(args.dueDays) || args.dueDays < 0)) {
    fail("--due must be a whole number of days");
  }

  const currency = args.currency ?? DEFAULT_CURRENCY;
  const dueDays = args.dueDays ?? DEFAULT_DUE_DAYS;
  const items = args.items.map(parseItem);
  const total = items.reduce((sum, i) => sum + i.amount, 0);
  const mode = /^[sr]k_live_/.test(key) ? "LIVE" : "test";

  console.log(`\n  ${args.name}  <${args.to}>`);
  console.log(`  ${"-".repeat(52)}`);
  for (const i of items) {
    console.log(`  ${i.description.padEnd(38)} ${money(i.amount, currency).padStart(12)}`);
  }
  console.log(`  ${"-".repeat(52)}`);
  console.log(`  ${"Total".padEnd(38)} ${money(total, currency).padStart(12)}`);
  console.log(`  Net ${dueDays} · ${mode} mode`);
  if (args.po) console.log(`  Ref: ${args.po}`);

  if (args.dryRun) {
    console.log("\n  Preview only — nothing was created. Add --send to issue it.\n");
    return;
  }

  // An instance, never the deprecated global-key pattern.
  const stripe = new Stripe(key, { apiVersion: API_VERSION });

  // Reuse a partner rather than creating a duplicate every billing cycle --
  // duplicates split their payment history across two records and make the
  // account look like it has twice the customers it has.
  const found = await stripe.customers.list({ email: args.to, limit: 1 });
  const customer =
    found.data[0] ?? (await stripe.customers.create({ name: args.name, email: args.to }));
  console.log(`\n  customer  ${customer.id}${found.data[0] ? " (existing)" : " (new)"}`);

  // Invoice FIRST, then items attached to it by id.
  //
  // Creating items first and letting invoices.create sweep up the customer's
  // pending items is the documented default, and it is a trap in a script: a
  // failed earlier run leaves orphaned pending items behind, and the next
  // invoice silently adopts them. Binding each item to a known invoice id
  // means this run can only ever bill what this run was given.
  const invoice = await stripe.invoices.create({
    customer: customer.id,
    collection_method: "send_invoice",
    days_until_due: dueDays,
    currency,
    // Left false so finalisation happens below, explicitly, after every line
    // item is confirmed attached.
    auto_advance: false,
    ...(args.memo ? { description: args.memo } : {}),
    ...(args.po ? { metadata: { partner_reference: args.po } } : {}),
  });

  for (const item of items) {
    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      amount: item.amount,
      currency,
      description: item.description,
    });
  }

  const finalised = await stripe.invoices.finalizeInvoice(invoice.id);

  // Guard against a silent mismatch: if the totals disagree, something was
  // attached that this run did not intend, and the partner should not be
  // emailed it. Stripe leaves it as a finalised-but-unsent invoice, which is
  // voidable from the Dashboard.
  if (finalised.amount_due !== total) {
    fail(
      `refusing to send: invoice totals ${money(finalised.amount_due, currency)} ` +
        `but this run priced ${money(total, currency)}.\n` +
        `       Inspect ${finalised.id} in the Dashboard and void it if wrong.`,
    );
  }

  const sent = await stripe.invoices.sendInvoice(invoice.id);

  console.log(`  invoice   ${sent.id}  ${sent.number ?? ""}`);
  console.log(`  status    ${sent.status}`);
  console.log(`  due       ${new Date(sent.due_date * 1000).toISOString().slice(0, 10)}`);
  console.log(`\n  ${sent.hosted_invoice_url}\n`);
}

main().catch((err) => {
  // Stripe errors carry the useful part in .message; the stack is noise here.
  console.error(`\nerror: ${err?.message ?? err}\n`);
  process.exit(1);
});
