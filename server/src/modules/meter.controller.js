import asyncHandler from "../middlewares/asyncHandler.js";
import Meter from "../../database/models/meter.model.js";

// @desc    Get all meters for logged in user
// @route   GET /api/meters
// @access  Private
export const getMeters = asyncHandler(async (req, res) => {
    const meters = await Meter.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    // Transform _id to id for frontend compatibility
    const formattedMeters = meters.map(meter => {
        const m = meter.toObject();
        m.id = m._id.toString();
        delete m._id;
        delete m.__v;
        return m;
    });

    res.json(formattedMeters);
});

// @desc    Create a new meter
// @route   POST /api/meters
// @access  Private
export const createMeter = asyncHandler(async (req, res) => {
    const { name, number, type, status } = req.body;

    if (!name || !number) {
        res.status(400);
        throw new Error("Please provide name and number for the meter");
    }

    const meterExists = await Meter.findOne({ user: req.user.id, number });

    if (meterExists) {
        res.status(400);
        throw new Error("Meter with this number already exists for this user");
    }

    const meter = await Meter.create({
        user: req.user.id,
        name,
        number,
        type: type || "residential",
        status: status || "active",
        trend: [0],
        consumption: 0
    });

    if (meter) {
        const m = meter.toObject();
        m.id = m._id.toString();
        delete m._id;
        delete m.__v;
        res.status(201).json(m);
    } else {
        res.status(400);
        throw new Error("Invalid meter data");
    }
});

// @desc    Update a meter
// @route   PUT /api/meters/:id
// @access  Private
export const updateMeter = asyncHandler(async (req, res) => {
    const meter = await Meter.findById(req.params.id);

    if (!meter) {
        res.status(404);
        throw new Error("Meter not found");
    }

    // Make sure user owns meter
    if (meter.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    const updatedMeter = await Meter.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    const m = updatedMeter.toObject();
    m.id = m._id.toString();
    delete m._id;
    delete m.__v;

    res.json(m);
});

// @desc    Delete a meter
// @route   DELETE /api/meters/:id
// @access  Private
export const deleteMeter = asyncHandler(async (req, res) => {
    const meter = await Meter.findById(req.params.id);

    if (!meter) {
        res.status(404);
        throw new Error("Meter not found");
    }

    // Make sure user owns meter
    if (meter.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    await meter.deleteOne();

    res.json({ id: req.params.id });
});
