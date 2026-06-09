import express from "express";
import {
  createSimulation,
  getSimulations,
  getSimulation,
  deleteSimulation,
  addCircuit,
  updateCircuit,
  deleteCircuit,
  addDevice,
  updateDevice,
  deleteDevice,
  startSimulation,
  pauseSimulation,
  resetSimulation,
  streamSimulation,
} from "./simulation.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { validateRequestBody } from "../middlewares/validateRequestBody.js";
import {
  createSimulationSchema,
  addCircuitSchema,
  addDeviceSchema,
  updateDeviceSchema,
  updateCircuitSchema,
} from "./simulation.validation.js";

const router = express.Router();

router.route("/")
  .get(isAuthenticated, getSimulations)
  .post(isAuthenticated, validateRequestBody(createSimulationSchema), createSimulation);

router.route("/:id")
  .get(isAuthenticated, getSimulation)
  .delete(isAuthenticated, deleteSimulation);

router.post("/:id/circuits", isAuthenticated, validateRequestBody(addCircuitSchema), addCircuit);
router.patch("/:id/circuits/:cid", isAuthenticated, validateRequestBody(updateCircuitSchema), updateCircuit);
router.delete("/:id/circuits/:cid", isAuthenticated, deleteCircuit);

router.post("/:id/devices", isAuthenticated, validateRequestBody(addDeviceSchema), addDevice);
router.patch("/:id/devices/:did", isAuthenticated, validateRequestBody(updateDeviceSchema), updateDevice);
router.delete("/:id/devices/:did", isAuthenticated, deleteDevice);

router.post("/:id/start", isAuthenticated, startSimulation);
router.post("/:id/pause", isAuthenticated, pauseSimulation);
router.post("/:id/reset", isAuthenticated, resetSimulation);

router.get("/:id/stream", isAuthenticated, streamSimulation);

export default router;
