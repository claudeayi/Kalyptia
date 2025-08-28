import crypto from "crypto";

// Simule un "mini ledger" blockchain en mémoire (peut être migré vers une vraie blockchain ensuite)
let ledger = [];

export function addBlock(action, payload) {
  const prevHash = ledger.length ? ledger[ledger.length - 1].hash : "GENESIS";
  const data = JSON.stringify(payload);
  const timestamp = Date.now();

  const hash = crypto
    .createHash("sha256")
    .update(prevHash + data + timestamp)
    .digest("hex");

  const block = {
    index: ledger.length,
    timestamp,
    action,
    data: payload,
    prevHash,
    hash
  };

  ledger.push(block);
  return block;
}

export function getLedger() {
  return ledger;
}
