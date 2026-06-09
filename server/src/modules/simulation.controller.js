import asyncHandler from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Simulation from "../../database/models/simulation.model.js";
import * as engine from "../services/simulation.engine.js";
import { addClient } from "../services/simulation.broadcaster.js";

const DEFAULT_CIRCUITS = [
  {
    name: "Kitchen",
    devices: [
      { name: "Refrigerator", wattage: 200, isOn: true },
      { name: "Microwave", wattage: 1200, isOn: false },
      { name: "Blender", wattage: 300, isOn: false },
    ],
  },
  {
    name: "Living Room",
    devices: [
      { name: "AC Unit", wattage: 2200, isOn: false },
      { name: "TV", wattage: 150, isOn: false },
      { name: "Lights", wattage: 100, isOn: false },
    ],
  },
  {
    name: "Bedroom",
    devices: [
      { name: "AC Unit", wattage: 1500, isOn: false },
      { name: "Fan", wattage: 75, isOn: false },
      { name: "Lights", wattage: 80, isOn: false },
    ],
  },
  {
    name: "Bathroom",
    devices: [
      { name: "Water Heater", wattage: 1500, isOn: false },
      { name: "Washing Machine", wattage: 500, isOn: false },
      { name: "Lights", wattage: 60, isOn: false },
    ],
  },
  {
    name: "Office",
    devices: [
      { name: "PC", wattage: 300, isOn: false },
      { name: "Monitor", wattage: 50, isOn: false },
      { name: "Router", wattage: 15, isOn: true },
      { name: "Lights", wattage: 40, isOn: false },
    ],
  },
];

function formatDoc(doc) {
  const obj = doc.toObject();
  obj.id = obj._id.toString();
  delete obj.__v;
  return obj;
}

// ─── CRUD ───────────────────────────────────────────────

export const createSimulation = asyncHandler(async (req, res) => {
  const { name, autoGenerate } = req.body;
  const circuits = autoGenerate
    ? DEFAULT_CIRCUITS.map(c => ({
        ...c,
        devices: c.devices.map(d => ({ ...d })),
      }))
    : [];

  const simulation = await Simulation.create({
    user: req.user.id,
    name,
    circuits,
  });

  res.status(201).json({ success: true, data: formatDoc(simulation) });
});

export const getSimulations = asyncHandler(async (req, res) => {
  const simulations = await Simulation.find({ user: req.user.id }).sort({ createdAt: -1 });
  const data = simulations.map(formatDoc).map(s => ({
    ...s,
    runtime: engine.getRuntimeState(s.id) || null,
  }));
  res.json({ success: true, data });
});

export const getSimulation = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findById(req.params.id);
  if (!simulation) throw new AppError("Simulation not found", 404);
  if (simulation.user.toString() !== req.user.id) throw new AppError("Not authorized", 403);

  const doc = formatDoc(simulation);
  doc.runtime = engine.getRuntimeState(doc.id) || null;
  res.json({ success: true, data: doc });
});

export const deleteSimulation = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findById(req.params.id);
  if (!simulation) throw new AppError("Simulation not found", 404);
  if (simulation.user.toString() !== req.user.id) throw new AppError("Not authorized", 403);

  engine.removeSimulation(simulation._id.toString());
  await simulation.deleteOne();
  res.json({ success: true, data: { id: req.params.id } });
});

// ─── Circuits ────────────────────────────────────────────

export const addCircuit = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findById(req.params.id);
  if (!simulation) throw new AppError("Simulation not found", 404);
  if (simulation.user.toString() !== req.user.id) throw new AppError("Not authorized", 403);

  const { name, autoGenerate } = req.body;
  let devices = [];

  if (autoGenerate) {
    const template = DEFAULT_CIRCUITS.find(
      c => c.name.toLowerCase() === name.toLowerCase()
    );
    if (template) {
      devices = template.devices.map(d => ({ ...d }));
    }
  }

  simulation.circuits.push({ name, devices });
  await simulation.save();

  engine.syncConfig(simulation._id.toString(), simulation.toObject());
  res.status(201).json({ success: true, data: formatDoc(simulation) });
});

export const updateCircuit = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findById(req.params.id);
  if (!simulation) throw new AppError("Simulation not found", 404);
  if (simulation.user.toString() !== req.user.id) throw new AppError("Not authorized", 403);

  const circuit = simulation.circuits.id(req.params.cid);
  if (!circuit) throw new AppError("Circuit not found", 404);

  if (req.body.name) circuit.name = req.body.name;
  await simulation.save();

  engine.syncConfig(simulation._id.toString(), simulation.toObject());
  res.json({ success: true, data: formatDoc(simulation) });
});

export const deleteCircuit = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findById(req.params.id);
  if (!simulation) throw new AppError("Simulation not found", 404);
  if (simulation.user.toString() !== req.user.id) throw new AppError("Not authorized", 403);

  simulation.circuits.pull({ _id: req.params.cid });
  await simulation.save();

  engine.syncConfig(simulation._id.toString(), simulation.toObject());
  res.json({ success: true, data: formatDoc(simulation) });
});

// ─── Devices ─────────────────────────────────────────────

export const addDevice = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findById(req.params.id);
  if (!simulation) throw new AppError("Simulation not found", 404);
  if (simulation.user.toString() !== req.user.id) throw new AppError("Not authorized", 403);

  const circuit = simulation.circuits.id(req.body.circuitId);
  if (!circuit) throw new AppError("Circuit not found", 404);

  circuit.devices.push({ name: req.body.name, wattage: req.body.wattage, isOn: false });
  await simulation.save();

  engine.syncConfig(simulation._id.toString(), simulation.toObject());
  res.status(201).json({ success: true, data: formatDoc(simulation) });
});

export const updateDevice = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findById(req.params.id);
  if (!simulation) throw new AppError("Simulation not found", 404);
  if (simulation.user.toString() !== req.user.id) throw new AppError("Not authorized", 403);

  let found = false;
  for (const circuit of simulation.circuits) {
    const device = circuit.devices.id(req.params.did);
    if (device) {
      if (req.body.name !== undefined) device.name = req.body.name;
      if (req.body.wattage !== undefined) device.wattage = req.body.wattage;
      if (req.body.isOn !== undefined) device.isOn = req.body.isOn;
      found = true;
      break;
    }
  }
  if (!found) throw new AppError("Device not found", 404);

  await simulation.save();
  engine.syncConfig(simulation._id.toString(), simulation.toObject());
  res.json({ success: true, data: formatDoc(simulation) });
});

export const deleteDevice = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findById(req.params.id);
  if (!simulation) throw new AppError("Simulation not found", 404);
  if (simulation.user.toString() !== req.user.id) throw new AppError("Not authorized", 403);

  for (const circuit of simulation.circuits) {
    const device = circuit.devices.id(req.params.did);
    if (device) {
      device.deleteOne();
      break;
    }
  }
  await simulation.save();

  engine.syncConfig(simulation._id.toString(), simulation.toObject());
  res.json({ success: true, data: formatDoc(simulation) });
});

// ─── Engine Control ─────────────────────────────────────

export const startSimulation = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findById(req.params.id);
  if (!simulation) throw new AppError("Simulation not found", 404);
  if (simulation.user.toString() !== req.user.id) throw new AppError("Not authorized", 403);

  await engine.startSimulation(simulation._id.toString());
  const state = engine.getRuntimeState(simulation._id.toString());
  res.json({ success: true, data: state });
});

export const pauseSimulation = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findById(req.params.id);
  if (!simulation) throw new AppError("Simulation not found", 404);
  if (simulation.user.toString() !== req.user.id) throw new AppError("Not authorized", 403);

  engine.pauseSimulation(simulation._id.toString());
  const state = engine.getRuntimeState(simulation._id.toString());
  res.json({ success: true, data: state });
});

export const resetSimulation = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findById(req.params.id);
  if (!simulation) throw new AppError("Simulation not found", 404);
  if (simulation.user.toString() !== req.user.id) throw new AppError("Not authorized", 403);

  engine.resetSimulation(simulation._id.toString());
  const state = engine.getRuntimeState(simulation._id.toString());
  res.json({ success: true, data: { ...formatDoc(simulation), runtime: state } });
});

// ─── SSE Stream ──────────────────────────────────────────

export const streamSimulation = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findById(req.params.id);
  if (!simulation) throw new AppError("Simulation not found", 404);
  if (simulation.user.toString() !== req.user.id) throw new AppError("Not authorized", 403);

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const state = engine.getRuntimeState(simulation._id.toString());
  if (state) {
    res.write(`data: ${JSON.stringify(state)}\n\n`);
  }

  addClient(simulation._id.toString(), res);
});
