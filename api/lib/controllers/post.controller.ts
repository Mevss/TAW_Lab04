import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import { checkPostCount } from '../middlewares/checkPostCount.middleware';
import { config } from "../config";
import DataService from "../modules/services/data.service";
import logRequest from "../middlewares/logRequest.middleware"
import * as Joi from "joi";

let testArr = [4, 5, 6, 3, 5, 3, 7, 5, 13, 5, 6, 4, 3, 6, 3, 6];

class PostController implements Controller {
  public path = '/api/post';
  public router = Router();
  private dataService = new DataService();


  constructor() {
    this.router.use(logRequest);
    this.initializeRoutes();

  }

  private initializeRoutes() {
    this.router.get(`${this.path}/latest`, this.getAll);
    this.router.get(`${this.path}/:id`, this.getElementById);
    // this.router.post(`${this.path}/:id`, this.addData);
    this.router.get(`${this.path}/num/:num`, this.getNEntries);
    this.router.get(`${this.path}s`, this.getAllEntries);

    this.router.post(this.path, this.addData);
    this.router.post(`${this.path}/:num`, checkPostCount, this.addData);

    this.router.delete(`${this.path}/:id`, this.removePost);
    this.router.delete(`${this.path}s`, this.deleteAllEntries);
    // this.router.post(`${this.path}/:num`, checkPostCount, this.addPostByNum);
  }

  private getAll = async (request: Request, response: Response) => {
    response.status(200).json(testArr);
  };


  private getNEntries = async (request: Request, response: Response) => {
    const num = parseInt(request.params.num, 10);

    if (num > 0) {
      response.status(200).json(testArr.slice(0, num));
    } else {
      response.status(400).json({ message: 'Invalid number of elements requested' });
    }
  };

  private addData = async (request: Request, response: Response, next: NextFunction) => {
    const {title, text, image} = request.body;
 
    // const readingData = {
    //     title,
    //     text,
    //     image
    // };
    const readingData = Joi.object({
      title: Joi.string().required(),
      text: Joi.string().required(),
      image: Joi.string().uri().required()
    });
    try {
      // await this.dataService.createPost(readingData);
      const validatedData = await readingData.validateAsync( { title, text, image} );
      await this.dataService.createPost(validatedData);
      response.status(200).json(validatedData);
  } catch (error) {
      console.log('eeee', error)

      console.error(`Validation Error: ${error.message}`);
      response.status(400).json({error: 'Invalid input data.'});
  }
}


  private getElementById = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    try {
      const allData = await this.dataService.query({ _id: id });
      if (!allData) {
          return response.status(404).json({ error: 'Entry not found' });
      }
      response.status(200).json(allData);
    } catch (error) {
      console.error(`Error fetching data by ID: ${error.message}`);
      response.status(500).json({ error: 'Server error' });
    }
  }
  private removePost = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    await this.dataService.deleteData({_id: id});
    response.sendStatus(200);
  };

  private getAllEntries = async (request: Request, response: Response) => {
    try {
        const allPosts = await this.dataService.query({});
        response.status(200).json(allPosts);
    } catch (error) {
        response.status(500).json({ error: 'Wystąpił błąd podczas pobierania wszystkich danych' });
    }
  };

  private deleteAllEntries = async (request: Request, response: Response) => {
    testArr = [];
    response.status(200).json({ message: 'All entries deleted', testArr });
  };
}

export default PostController;
