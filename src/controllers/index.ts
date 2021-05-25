// import fs from 'fs';
// import { Request, Response } from 'express';
// import { Org, either } from '../types/index';

// const database = process.env.NODE_ENV === 'test' ? 'database-test.json' : 'database.json';

// class Organization {
//   static async getOrganizations(): Promise<Array<Org>> {
//     try {
//       const buffer: Buffer = await fs.promises.readFile(database);
//       const allOrganizations: Array<Org> = JSON.parse(buffer.toString());
//       return allOrganizations;
//     } catch (error) {
//       return [];
//     }
//   }

//   static async generateId(): Promise<number> {
//     const allOrganizations = await Organization.getOrganizations();
//     let ID = 1;
//     if (allOrganizations.length > 0) {
//       const allIDs: number[] = allOrganizations.map((org) => org.id!);
//       const maxId: number = Math.max(...allIDs);
//       ID = maxId + 1;
//       return ID;
//     }
//     return ID;
//   }

//   static async saveToDb(organization: Org): Promise<void> {
//     try {
//       const organizations: Array<Org> = await Organization.getOrganizations();
//       if (organizations.length > 0) {
//         organizations.push(organization);
//         const json: string = JSON.stringify(organizations, null, 2);
//         await fs.promises.writeFile(database, json);
//       } else {
//         const data = [organization];
//         const json: string = JSON.stringify(data, null, 2);
//         await fs.promises.writeFile(database, json);
//       }
//     } catch (error) {
//       throw new Error('could not save to database');
//     }
//   }

//   static async findById(id: number): Promise<either> {
//     const organizations: Array<Org> = await Organization.getOrganizations();
//     const org: either = organizations.find((or) => or.id === id);
//     return org;
//   }

//   static async getAll(req: Request, res: Response): Promise<Response> {
//     try {
//       const allOrg: Org[] = await Organization.getOrganizations();

//       return res.status(200).send({
//         status: 'successful',
//         data: allOrg,
//       });
//     } catch (error) {
//       return res.status(500).send({
//         status: 'error',
//         message: 'An error occurred',
//       });
//     }
//   }

//   static async getOne(req: Request, res: Response): Promise<Response> {
//     try {
//       if (!req.params || !Number(req.params.id)) {
//         return res.status(400).send({
//           status: 'error',
//           message: 'Please provide a valid id',
//         });
//       }
//       const id: number = req.params.id ? Number(req.params.id) : 0;
//       const org: either = await Organization.findById(id);
//       if (!org) {
//         return res.status(404).send({
//           status: 'error',
//           message: 'Not found',
//         });
//       }
//       return res.status(200).send({
//         status: 'successful',
//         data: org,
//       });
//     } catch (error) {
//       return res.status(500).send({
//         status: 'error',
//         message: 'An error occurred',
//       });
//     }
//   }

//   static async createOne(req: Request, res: Response): Promise<Response> {
//     function check(
//       data: {
//         organization: string;
//         address: string;
//         ceo: string;
//         country: string;
//         marketValue: string;
//         products: string[];
//         employees: string[];
//         noOfEmployees: number;
//       },

//     ) {
//       return !data.organization || !data.ceo
//        || !data.address || !data.country || !data.marketValue
//        || !data.products || !data.address || !data.noOfEmployees
//        || !data.employees;
//     }
//     try {
//       if (!req.body || check(req.body)) {
//         return res.status(400).send({
//           status: 'error',
//           message: 'Please provide valid data',
//         });
//       }
//       const id: number = await Organization.generateId();
//       const newData: Org = {
//         id,
//         organization: req.body.organization,
//         products: req.body.products,
//         marketValue: req.body.marketValue,
//         address: req.body.address,
//         ceo: req.body.ceo,
//         country: req.body.country,
//         noOfEmployees: req.body.noOfEmployees,
//         employees: req.body.employees,
//         createdAt: new Date(),
//         updatedAt: null,

//       };
//       await Organization.saveToDb(newData);
//       return res.status(201).send({
//         status: 'successful',
//         data: newData,
//       });
//     } catch (error) {
//       return res.status(500).send({
//         status: 'error',
//         message: 'An error occurred',
//       });
//     }
//   }

//   static async removeOne(req: Request, res: Response): Promise<Response> {
//     if (!req.params || !Number(req.params.id)) {
//       return res.status(400).send({
//         status: 'error',
//         message: 'Please provide valid id',
//       });
//     }
//     try {
//       const id: number = req.params.id ? Number(req.params.id) : 0;
//       const newOrg = await Organization.findById(id);
//       if (!newOrg) {
//         return res.status(404).send({
//           status: 'error',
//           message: 'Not Found',
//         });
//       }
//       const orgs: Array<Org> = await Organization.getOrganizations();
//       const newOrgs: Array<Org> = orgs.filter((org) => org.id !== id);
//       const json: string = JSON.stringify(newOrgs, null, 2);
//       await fs.promises.writeFile(database, json);
//       return res.status(200).send({
//         status: 'successful',
//         message: 'successfully deleted',
//       });
//     } catch (error) {
//       return res.status(500).send({
//         status: 'error',
//         message: 'An error occurred',
//       });
//     }
//   }

//   static async updateOne(req: Request, res: Response): Promise<Response> {
//     if (!req.body || !req.params || !Number(req.params.id)) {
//       return res.status(400).send({
//         status: 'error',
//         message: 'Please provide valid id or data',
//       });
//     }
//     const id: number = req.params.id ? Number(req.params.id) : 0;
//     try {
//       const org: either = await Organization.findById(id);
//       if (!org) {
//         return res.status(404).send({
//           status: 'error',
//           message: 'Not Found',
//         });
//       }
//       const newData: Org = {
//         ...org,
//         ...req.body,
//         updatedAt: new Date(),
//       };
//       const organizations: Array<Org> = await Organization.getOrganizations();
//       const index: number = organizations.findIndex((d) => d.id === id);
//       organizations[index] = newData;
//       const json: string = JSON.stringify(organizations, null, 2);
//       await fs.promises.writeFile(database, json);
//       return res.status(200).send({
//         status: 'successful',
//         message: 'successfully  updated',
//         data: newData,
//       });
//     } catch (error) {
//       return res.status(500).send({
//         status: 'error',
//         message: 'An error occurred',
//       });
//     }
//   }
// }

// export default Organization;
