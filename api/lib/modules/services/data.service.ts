import { IPost, Query } from "../models/data.model";
import PostModel from '../schemas/data.schema';
import mongoose from 'mongoose';

class DataService {
    public async createPost(postParams: IPost) {
        try {
            const dataModel = new PostModel(postParams);
            await dataModel.save();
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async query(query: Query<number | string | boolean>) {
        try {
            const result = await PostModel.find(query, { __v: 0 });
            return result;
        } catch (error) {
            console.error('Wystąpił błąd podczas wykonywania zapytania:', error);
            throw new Error(`Wystąpił błąd podczas wykonywania zapytania: ${error.message}`);
        }
    }

    public async deleteData(query: Query<number | string | boolean>) {
        try {
            await PostModel.deleteMany(query);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }

    public async getById(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Nieprawidłowy format ID');
            }
            const post = await PostModel.findById(id, { __v: 0 });
            if (!post) {
                throw new Error('Nie znaleziono postu o podanym ID');
            }
            return post;
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych po ID:', error);
            throw new Error(`Wystąpił błąd podczas pobierania danych po ID: ${error.message}`);
        }
    }

    public async deleteById(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Nieprawidłowy format ID');
            }
            const result = await PostModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error('Nie znaleziono postu do usunięcia o podanym ID');
            }
            return result;
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych po ID:', error);
            throw new Error(`Wystąpił błąd podczas usuwania danych po ID: ${error.message}`);
        }
    }

    public async deleteAllPosts() {
        try {
            const result = await PostModel.deleteMany({});
            return result;
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania wszystkich danych:', error);
            throw new Error(`Wystąpił błąd podczas usuwania wszystkich danych: ${error.message}`);
        }
    }
}

export default DataService;
