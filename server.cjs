var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var DB_FILE = import_path.default.join(process.cwd(), "requests_db.json");
function getInitialDbData() {
  return [
    {
      id: "WH-2026-8492",
      createdAt: new Date(Date.now() - 1e3 * 60 * 60 * 3).toISOString(),
      status: "new",
      customer: {
        fullName: "Kak Dana Farhad",
        phone: "+964 750 445 8899",
        email: "dana.farhad@kurdoil.com",
        company: "Farhad Villa Project",
        city: "Erbil (Dream City)",
        projectType: "Luxury Private Villa",
        timeline: "1 Month",
        serviceNeeded: "Full Fabrication & Installation by Winhome Engineers",
        preferredContact: "whatsapp",
        additionalNotes: "Require high thermal insulation against summer heat. Master bedroom requires maximum acoustic isolation."
      },
      items: [
        {
          id: "item-1",
          productId: "legend-80",
          productName: "Deceuninck Legend 80",
          category: "upvc",
          image: "/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg",
          quantity: 12,
          widthMm: 1600,
          heightMm: 2200,
          color: "Anthracite Grey (RAL 7016)",
          glazing: "Triple Glazed Argon (4+12+4+12+4 Low-E)",
          openingType: "Tilt & Turn Double Sash",
          notes: "Ground floor and first floor bedrooms",
          estimatedAreaSqm: 42.24
        },
        {
          id: "item-2",
          productId: "lorenzo-70ls",
          productName: "Lorenzoline 70LS Monumental",
          category: "aluminum",
          image: "/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg",
          quantity: 3,
          widthMm: 3600,
          heightMm: 2800,
          color: "Deep Anodized Black",
          glazing: "Double Glazed Solar Control 6mm+16Ar+6mm",
          openingType: "2-Track Heavy Lift & Slide",
          notes: "Direct garden and swimming pool terrace access",
          estimatedAreaSqm: 30.24
        }
      ],
      totalQuantity: 15,
      totalAreaSqm: 72.48,
      adminNotes: "Contacted client via WhatsApp. Scheduled site measurement visit for tomorrow 11:00 AM in Dream City.",
      quotedAmount: 18600,
      currency: "USD"
    },
    {
      id: "WH-2026-8480",
      createdAt: new Date(Date.now() - 1e3 * 60 * 60 * 28).toISOString(),
      status: "quoted",
      customer: {
        fullName: "Eng. Ahmed Al-Jabouri",
        phone: "+964 770 123 4567",
        email: "ahmed.jabouri@almansour-const.iq",
        company: "Al-Mansour Architectural Contracting",
        city: "Baghdad (Al-Jadriya)",
        projectType: "Commercial Car Showroom & Offices",
        timeline: "2-3 Months",
        serviceNeeded: "Fabrication, Steel Structure Sub-frames & Delivery",
        preferredContact: "phone",
        additionalNotes: "Need 50F curtain wall facade with high wind resistance structural calculations."
      },
      items: [
        {
          id: "item-3",
          productId: "facade-50f",
          productName: "Commercial 50F Curtain Wall",
          category: "aluminum",
          image: "/assets/winhome/photo_2023-07-03_15-42-28-1120x716.jpg",
          quantity: 1,
          widthMm: 18e3,
          heightMm: 6500,
          color: "Silver Metallic Anodized",
          glazing: "Laminated Double Glazed Low-E (8+16Ar+8mm)",
          openingType: "Fixed Structural Glazing with Concealed Vents",
          notes: "Main street frontage on Al-Jadriya",
          estimatedAreaSqm: 117
        }
      ],
      totalQuantity: 1,
      totalAreaSqm: 117,
      adminNotes: "Formal BOQ sent with structural calculations. Awaiting client signature.",
      quotedAmount: 34500,
      currency: "USD"
    }
  ];
}
function readDb() {
  try {
    if (!import_fs.default.existsSync(DB_FILE)) {
      const initial = getInitialDbData();
      import_fs.default.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file:", err);
    return getInitialDbData();
  }
}
function writeDb(data) {
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.get("/api/requests", (req, res) => {
    const data = readDb();
    res.json(data);
  });
  app.post("/api/requests", (req, res) => {
    const newRequest = req.body;
    if (!newRequest || !newRequest.customer || !newRequest.items) {
      return res.status(400).json({ error: "Invalid request payload" });
    }
    const current = readDb();
    const updated = [newRequest, ...current.filter((r) => r.id !== newRequest.id)];
    writeDb(updated);
    res.status(201).json(newRequest);
  });
  app.patch("/api/requests/:id", (req, res) => {
    const { id } = req.params;
    const { status, adminNotes, quotedAmount } = req.body;
    const current = readDb();
    const targetIdx = current.findIndex((r) => r.id === id);
    if (targetIdx === -1) {
      return res.status(404).json({ error: "Request not found" });
    }
    const existing = current[targetIdx];
    const updated = {
      ...existing,
      status: status !== void 0 ? status : existing.status,
      adminNotes: adminNotes !== void 0 ? adminNotes : existing.adminNotes,
      quotedAmount: quotedAmount !== void 0 ? quotedAmount : existing.quotedAmount
    };
    current[targetIdx] = updated;
    writeDb(current);
    res.json(updated);
  });
  app.delete("/api/requests/:id", (req, res) => {
    const { id } = req.params;
    const current = readDb();
    const filtered = current.filter((r) => r.id !== id);
    writeDb(filtered);
    res.json({ success: true, id });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
