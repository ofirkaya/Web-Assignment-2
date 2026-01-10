import { Request, Response } from "express";
import { Model, Document } from "mongoose";

class BaseController<T extends Document> {
    model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async get(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.model.find(req.query);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.model.findById(req.params.id);
            if (!data) {
                res.status(404).json({ error: "Data not found" });
                return;
            }
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }

    async post(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.model.create(req.body);
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }

    async put(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!data) {
                res.status(404).json({ error: "Data not found" });
                return;
            }
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.model.findByIdAndDelete(req.params.id);
            if (!data) {
                res.status(404).json({ error: "Data not found" });
                return;
            }
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }
}

export default BaseController;
