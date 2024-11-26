import Controller from '../interfaces/controller.interface';
import { Request, Response, Router } from 'express';

let testArr = [4, 5, 6, 3, 5, 3, 7, 5, 13, 5, 6, 4, 3, 6, 3, 6];

class PostController implements Controller {
  public path = '/api/post';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/latest`, this.getAll);
    this.router.post(this.path, this.addNewEntry);
    this.router.get(`${this.path}/:id`, this.getEntryById);
    this.router.post(`${this.path}/:id`, this.addData);
    this.router.delete(`${this.path}/:id`, this.deleteEntryById);
    this.router.get(`${this.path}/num/:num`, this.getNEntries);
    this.router.get(`${this.path}s`, this.getAllEntries);
    this.router.delete(`${this.path}s`, this.deleteAllEntries);
  }

  private getAll = async (request: Request, response: Response) => {
    response.status(200).json(testArr);
  };

  private addData = async (request: Request, response: Response) => {
    const { value } = request.body;

    testArr.push(value);
    response.status(201).json({ message: 'Value added', testArr });
  };

  private getEntryById = async (request: Request, response: Response) => {
    const id = parseInt(request.params.id, 10);

    if (id >= 0 && id < testArr.length) {
      response.status(200).json({ id, value: testArr[id] });
    } else {
      response.status(404).json({ message: 'Entry not found' });
    }
  };

  private addNewEntry = async (request: Request, response: Response) => {
    const { value } = request.body;

    if (value !== undefined) {
      testArr.push(value);
      response.status(201).json({ message: 'New entry added', testArr });
    } else {
      response.status(400).json({ message: 'Invalid data' });
    }
  };

  private deleteEntryById = async (request: Request, response: Response) => {
    const id = parseInt(request.params.id, 10);

    if (id >= 0 && id < testArr.length) {
      const removedValue = testArr.splice(id, 1);
      response.status(200).json({ message: 'Entry deleted', removedValue, testArr });
    } else {
      response.status(404).json({ message: 'Entry not found' });
    }
  };

  private getNEntries = async (request: Request, response: Response) => {
    const num = parseInt(request.params.num, 10);

    if (num > 0) {
      response.status(200).json(testArr.slice(0, num));
    } else {
      response.status(400).json({ message: 'Invalid number of elements requested' });
    }
  };

  private getAllEntries = async (request: Request, response: Response) => {
    response.status(200).json(testArr);
  };

  private deleteAllEntries = async (request: Request, response: Response) => {
    testArr = [];
    response.status(200).json({ message: 'All entries deleted', testArr });
  };
}

export default PostController;
