import { Request, Response } from 'express';
import { OrgSchema } from '../models/organization';
// import { Org } from '../types/index';
import { validateInput, validateId, checkUpdateField } from '../utils/validate';

export async function createOrganization(req: Request, res: Response): Promise<Response | void> {
  try {
    const { error } = validateInput(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message,
        data: [],
      });
    }

    const orgdata = new OrgSchema(req.body);
    const data = await orgdata.save();

    return res.status(201).json({
      status: 'success',
      message: 'successful',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred',
      data: [],
    });
  }
}

export async function getAllOrganizations(req: Request, res: Response): Promise<Response | void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const previous = page - 1 <= 0 ? null : page - 1;

    const skip = (page - 1) * (limit);
    const allOrg = await OrgSchema.find({}).skip(skip).limit(limit);
    const numberOfOrg = await OrgSchema.count();
    const next = (numberOfOrg - (page * limit)) <= 0 ? null : (page + 1);
    return res.status(200).json({
      status: 'success',
      message: 'successful',
      previous,
      next,
      data: allOrg,
      results: numberOfOrg,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'An internal error occurred',
      data: [],
    });
  }
}

export async function getOneOrganization(req: Request, res: Response): Promise<Response | void> {
  try {
    const { error } = validateId({ id: req.params.id });
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid Id',
        data: [],
      });
    }

    const data = await OrgSchema.findById(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Org not found',
        data: [],
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'successful',
      data,
    });
  } catch (error) {
    return res.status(404).json({
      status: 'error',
      message: 'An error occurred',
      data: [],
    });
  }
}

export async function updateAnOrganization(req: Request, res: Response): Promise<Response | void> {
  try {
    const { error } = validateId({ id: req.params.id });
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid Id',
        data: [],
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot send an empty data',
        data: [],
      });
    }

    const err = checkUpdateField(req.body);
    if (err.error) {
      return res.status(400).json({
        status: 'error',
        message: err.error.details[0].message,
        data: [],
      });
    }
    const data = await OrgSchema.findByIdAndUpdate(req.params.id, req.body,
      { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Org Not Found',
        data: [],
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'successful',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred',
      data: [],
    });
  }
}

export async function deleteOrganization(req: Request, res: Response): Promise<Response | void> {
  try {
    const { error } = validateId({ id: req.params.id });
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid Id',
        data: [],
      });
    }

    const data = await OrgSchema.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Org Not Found',
        data: [],
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'successful',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred',
      data: [],
    });
  }
}
