import Joi from "joi";

const deviceFields = {
  name: Joi.string().trim().min(1).max(100),
  wattage: Joi.number().min(1).max(100000),
  isOn: Joi.boolean(),
};

export const createSimulationSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200).default("New Simulation"),
  autoGenerate: Joi.boolean().default(false),
});

export const addCircuitSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  autoGenerate: Joi.boolean().default(false),
});

export const addDeviceSchema = Joi.object({
  circuitId: Joi.string().required(),
  name: Joi.string().trim().min(1).max(100).required(),
  wattage: Joi.number().min(1).max(100000).required(),
});

export const updateDeviceSchema = Joi.object({
  ...deviceFields,
}).min(1);

export const updateCircuitSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100),
}).min(1);
